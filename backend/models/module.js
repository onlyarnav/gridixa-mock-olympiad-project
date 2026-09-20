const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: String,
  notePath: String, // S3 markdown
  videoUrl: String,
});

const chapterSchema = new mongoose.Schema({
  chapterKey: { type: String, required: true }, // 🔥 ADD THIS
  title: String,
  topics: [topicSchema],
  practiceUrl: String,
});

// models/module.js

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  level: {
    type: String,
    enum: ["4-5", "6-8", "9-10", "11-12", "1-2", "3-4"],
    required: true,
  },

  order: Number,

  chapters: [chapterSchema],

  // 🔥 TEST CONFIG
  moduleTestUrl: String,

  moduleTestQuestions: {
    type: Number,
    default: 30,
  },

  moduleTestDuration: {
    type: Number,
    default: 15, // minutes
  },

}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);