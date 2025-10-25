const mongoose = require("mongoose");
const visitoreMessageSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name Required"] },
  email: {
    type: String,
    required: [true, "Email Required"],
  },
  subject: {
    type: String,
    required: [true, "Subject Required"],
  },
  message: {
    type: String,
    required: [true, "Message Required"],
  },
});

const vistoreRecordSchema = new mongoose.Schema({
  ip: { type: String, unique: true, required: true }, // 🔥 unique IP
  country: { type: String, default: "Unknown" },
  region: { type: String, default: "Unknown" },
  city: { type: String, default: "Unknown" },
  createdAt: { type: Date, default: Date.now },
});

const visitorRecorModel = mongoose.model("VisitorRecord", vistoreRecordSchema);
const vistorModel = mongoose.model("visitorMessage", visitoreMessageSchema);

module.exports = { vistorModel, visitorRecorModel };
