const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  inspectionType: String,
  shipType: String,
  port: String,
  country: String,
  dateFrom: Date,
  dateTo: Date,

  status: {
    type: String,
    default: "Pending Review"
  }
}, { timestamps: true });

module.exports = mongoose.model("InspectionRequest", requestSchema);