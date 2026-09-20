const rateLimit = require("express-rate-limit");

exports.resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many reset attempts. Try later."
});