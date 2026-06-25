const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: String,
    requirement: {
      type: String,
      required: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    openedAt: Date,
    clicked: {
      type: Boolean,
      default: false,
    },
    clickedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
