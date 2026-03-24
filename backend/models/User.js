const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  addressRegional: String,
  addressISM: String,
  shipType: String,
  contactPerson: String,
  phone: String,

  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);