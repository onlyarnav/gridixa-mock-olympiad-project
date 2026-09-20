const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require("fs/promises");
const generateInvoice = require("../utils/generateInvoice");
const { sendStudentPaymentSuccessEmail, sendParentPaymentSuccessEmail } = require("../utils/emailService");
const Payment = require("../models/payment");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧾 CREATE ORDER
const Coupon = require("../models/coupons");

exports.createOrder = async (req, res) => {
  try {
    const {
      email,
      couponCode,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.paymentStatus === "completed") {
      return res.status(400).json({ message: "Already paid. Please go to Login page and start your learning journey." });
    }

    const BASE_PRICE = 19900; // paise
    const GST_RATE = 0.18;

    let coupon = null;
    let taxableBase = BASE_PRICE;
    let discount = 0;

    if (couponCode) {
      const normalized = String(couponCode).trim().toUpperCase().replace(/\s+/g, "");
      coupon = await Coupon.findOne({ code: normalized });

      if (!coupon || !coupon.active) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      const now = new Date();

      if (coupon.startsAt && new Date(coupon.startsAt) > now) {
        return res.status(400).json({ message: "Coupon not started yet" });
      }

      if (coupon.endsAt && new Date(coupon.endsAt) < now) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon limit reached" });
      }

      discount =
        coupon.type === "percentage"
          ? Math.floor((taxableBase * coupon.value) / 100)
          : Math.min(coupon.value * 100, taxableBase);

      taxableBase = Math.max(0, taxableBase - discount);
    }

    const gst = Math.floor(taxableBase * GST_RATE);
    const finalPayable = taxableBase + gst;

    const order = await razorpay.orders.create({
      amount: finalPayable,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    await Payment.create({
      userEmail: email,
      razorpay_order_id: order.id,
      currency: "INR",
      subtotalAmount: taxableBase,
      gstAmount: gst,
      discountAmount: discount,
      payableAmount: finalPayable,
      couponId: coupon?._id || null,
      couponCode: coupon?.code || null,
      status: "created",
    });

    return res.json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// 🔐 VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
    } = req.body;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 🔍 GET PAYMENT RECORD
    const payment = await Payment.findOne({ razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      return res.json({ message: "Already verified" });
    }

    // ✅ UPDATE PAYMENT
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    // 👤 UPDATE USER
    await User.updateOne(
      { email },
      { paymentStatus: "completed" }
    );

    const user = await User.findOne({ email });

    // 🔥 INCREMENT COUPON USAGE
    if (payment.couponId) {
      await Coupon.findByIdAndUpdate(payment.couponId, {
        $inc: { usedCount: 1 },
      });
    }

    // 📄 GENERATE INVOICE WITH REAL DATA
    const invoiceNumber = razorpay_payment_id;
    const invoiceDate = new Date().toLocaleDateString("en-IN");

    const invoicePath = await generateInvoice({
      name: user.name,
      email: user.email,
      invoiceNumber,
      date: invoiceDate,
      originalAmount: 19900, // paise
      subtotalAmount: payment.subtotalAmount,
      gstAmount: payment.gstAmount,
      discountAmount: payment.discountAmount,
      payableAmount: payment.payableAmount,
      couponCode: payment.couponCode,
    });

    // 📩 SEND EMAILS
    try {
      await Promise.all([
        sendStudentPaymentSuccessEmail({
          email: user.email,
          name: user.name,
          invoicePath,
          invoiceNumber,
          date: invoiceDate,

          // ✅ ADD ALL
          subtotalAmount: payment.subtotalAmount,
          gstAmount: payment.gstAmount,
          discountAmount: payment.discountAmount,
          payableAmount: payment.payableAmount,
          couponCode: payment.couponCode,
        }),

        user.parentEmail
          ? sendParentPaymentSuccessEmail({
              parentEmail: user.parentEmail,
              childName: user.name,
              invoicePath,
              invoiceNumber,
              date: invoiceDate,
              payableAmount: payment.payableAmount,
              subtotalAmount: payment.subtotalAmount,
              gstAmount: payment.gstAmount,
              discountAmount: payment.discountAmount,
              couponCode: payment.couponCode,
            })
          : Promise.resolve(),
      ]);
    } catch (err) {
      console.error("Email error:", err.message);
    }

    // 🗑 DELETE INVOICE
    try {
      await fs.unlink(invoicePath);
    } catch (err) {
      console.error("Invoice delete error:", err.message);
    }

    res.json({ message: "Payment verified successfully" });

  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ message: err.message });
  }
};