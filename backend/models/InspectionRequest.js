const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientEmail: { type: String, required: true },

  requestId: { type: String, unique: true },

  inspectionType: String,
  shipType: String,
  port: String,
  country: String,

  dateFrom: String,
  dateTo: String,

  status: {
    type: String,
    default: "Pending Review"
  }
}, { timestamps: true });

module.exports = mongoose.model("InspectionRequest", requestSchema);