const Coupon = require("../models/coupons");

////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////

function getCouponStatus(coupon) {
  if (!coupon.active) return "inactive";

  const now = new Date();

  if (coupon.startsAt && new Date(coupon.startsAt) > now) return "scheduled";
  if (coupon.endsAt && new Date(coupon.endsAt) < now) return "expired";

  return "active";
}

function formatCoupon(coupon) {
  return {
    ...coupon,
    createdBy: coupon.createdBy
      ? `${coupon.createdBy.name || ""} (${coupon.createdBy.email || ""})`
      : "-",
    computedStatus: getCouponStatus(coupon),
  };
}

function parsePagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildFilter(query) {
  const filter = {};

  if (query.search) {
    const s = query.search;
    filter.$or = [
      { code: { $regex: s, $options: "i" } },
      { title: { $regex: s, $options: "i" } },
    ];
  }

  return filter;
}

////////////////////////////////////////////////////////////
// VALIDATE
////////////////////////////////////////////////////////////

exports.validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const payableAmountInput = Number(amount);
    if (!Number.isFinite(payableAmountInput) || payableAmountInput <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const normalizedCode = String(code).trim().toUpperCase().replace(/\s+/g, "");
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.active) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return res.status(400).json({ message: "Coupon is not active yet" });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < now) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined) {
      if ((coupon.usedCount || 0) >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }
    }

    const discountAmount =
      coupon.type === "percentage"
        ? Math.floor((payableAmountInput * coupon.value) / 100)
        : Math.min(Math.round(coupon.value * 100), payableAmountInput);

    const payableAmount = Math.max(0, payableAmountInput - discountAmount);

    return res.json({
      message: "Coupon is valid",
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      subtotalAmount: payableAmountInput,
      discountAmount,
      payableAmount,
    });
  } catch (err) {
    console.error("validateCoupon error:", err);
    return res.status(500).json({
      message: err.message || "Failed to validate coupon",
    });
  }
};