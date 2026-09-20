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
// CREATE
////////////////////////////////////////////////////////////

exports.createCoupon = async (req, res) => {
  try {
    const { code, title, description, type, value, usageLimit, startsAt, endsAt } = req.body;

    if (!code || !title || !type || !value) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (type === "percentage" && value > 100) {
      return res.status(400).json({ message: "Percentage cannot exceed 100" });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(409).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      title,
      description,
      type,
      value,
      usageLimit,
      startsAt,
      endsAt,
      createdBy: req.user.id, // ✅ from auth
    });

    const populated = await Coupon.findById(coupon._id)
      .populate("createdBy", "name email")
      .lean();

    res.status(201).json({
      message: "Created",
      coupon: formatCoupon(populated),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

////////////////////////////////////////////////////////////
// GET ALL
////////////////////////////////////////////////////////////

exports.getCoupons = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildFilter(req.query);

    const [data, total] = await Promise.all([
      Coupon.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Coupon.countDocuments(filter),
    ]);

    res.json({
      coupons: data.map(formatCoupon),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

////////////////////////////////////////////////////////////
// UPDATE
////////////////////////////////////////////////////////////

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Not found" });

    Object.assign(coupon, req.body);
    await coupon.save();

    const populated = await Coupon.findById(coupon._id)
      .populate("createdBy", "name email")
      .lean();

    res.json({
      message: "Updated",
      coupon: formatCoupon(populated),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

////////////////////////////////////////////////////////////
// DELETE
////////////////////////////////////////////////////////////

exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

////////////////////////////////////////////////////////////
// TOGGLE
////////////////////////////////////////////////////////////

exports.toggleCouponStatus = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: "Not found" });

  coupon.active = !coupon.active;
  await coupon.save();

  res.json({ message: "Status updated" });
};
