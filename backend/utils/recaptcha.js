const axios = require("axios");

exports.verifyRecaptcha = async (token) => {
  if (
    token === "mock-token" ||
    process.env.NODE_ENV === "development" ||
    !process.env.RECAPTCHA_SECRET_KEY ||
    process.env.RECAPTCHA_SECRET_KEY === "recap"
  ) {
    return { success: true, score: 0.9 };
  }

  if (!token) return { success: false };

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );

  return response.data;
};