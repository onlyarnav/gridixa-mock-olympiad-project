const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    currency: {
      type: String,
      default: "INR",
    },

    subtotalAmount: {
      type: Number,
      default: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    payableAmount: {
      type: Number,
      required: true,
    },

    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    couponCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    invoiceNumber: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);