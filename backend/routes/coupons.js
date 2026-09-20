const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} = require("../controllers/coupons");

const { authMiddleware } = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/admin");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getCoupons);
router.post("/", createCoupon);
router.patch("/:id", updateCoupon);
router.patch("/:id/toggle", toggleCouponStatus);
router.delete("/:id", deleteCoupon);

module.exports = router;