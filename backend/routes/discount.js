// routes/discount.route.js
const express = require("express");
const router = express.Router();
const { validateCoupon } = require("../controllers/discount");

router.post("/validate", validateCoupon);

module.exports = router;