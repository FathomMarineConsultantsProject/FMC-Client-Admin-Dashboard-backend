const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  clientName: String,
  vesselName: String,
  port: String,
  serviceType: String,
  status: {
    type: String,
    default: "pending"
  },
  assignedSurveyor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);