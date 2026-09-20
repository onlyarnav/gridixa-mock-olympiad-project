const rateLimit = require("express-rate-limit");

exports.otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Try later."
});

exports.otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many OTP attempts. Try later."
});