// app.js
require("dotenv").config(); // MUST be first line
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const moduleRoutes = require("./routes/module");
const progressRoutes = require("./routes/progress");
const adminRoutes = require("./routes/admin");
const couponsRoutes = require("./routes/coupons");
const discountRoutes = require("./routes/discount");
const olympiadRoutes = require("./modules/olympiad/routes/olympiadRoutes").default;

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai.gridixa.in",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/coupons", couponsRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/olympiad", olympiadRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

module.exports = app;