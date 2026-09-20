// routes/auth.route.js

const express = require("express");
const router = express.Router();

const {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  checkUser,
  getProfile,
  logActivity,
  updateProfile
} = require("../controllers/auth");

const { authMiddleware } = require("../middleware/auth");

const { loginLimiter } = require("../middleware/rate-limiters/authLimiter");
const { otpSendLimiter, otpVerifyLimiter } = require("../middleware/rate-limiters/otpLimiter");
const { resetLimiter } = require("../middleware/rate-limiters/resetLimiter");

// routes/auth.route.js
router.get("/profile", authMiddleware, getProfile);
router.post("/log-activity", authMiddleware, logActivity);
router.patch("/profile", authMiddleware, updateProfile);

// CHECK USER
router.get("/check-user", checkUser);

// REGISTER FLOW
router.post("/send-register-otp", otpSendLimiter, sendRegisterOtp);
router.post("/verify-register-otp", otpVerifyLimiter, verifyRegisterOtp);
router.post("/register", register); // ❌ no limiter needed

// LOGIN
router.post("/login", loginLimiter, login);

// FORGOT PASSWORD
router.post("/forgot-password", otpSendLimiter, forgotPassword);
router.post("/verify-otp", otpVerifyLimiter, verifyOtp);
router.post("/reset-password", resetLimiter, resetPassword);

module.exports = router;