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

const vistorModel = mongoose.model("visitorMessage", visitoreMessageSchema);

module.exports = vistorModel;
