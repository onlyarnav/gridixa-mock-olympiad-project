const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    usageLimit: {
      type: Number,
      default: null,
      min: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    startsAt: {
      type: Date,
      default: null,
    },

    endsAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: false }
);

couponSchema.pre("save", function () {
  if (this.code) {
    this.code = this.code.toUpperCase().replace(/\s+/g, "");
  }
});

couponSchema.index({ active: 1 });

module.exports = mongoose.model("Coupon", couponSchema);