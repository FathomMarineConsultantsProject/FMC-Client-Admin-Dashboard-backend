const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientEmail: { type: String, required: true },

  requestId: { type: String, unique: true, required: true },

  inspectionType: String,
  shipType: String,
  port: String,
  country: String,

  dateFrom: String, // ✅ safer
  dateTo: String,   // ✅ safer

  fees: { type: Number, default: 0 },

  status: {
    type: String,
    enum: [
      "pending review",
      "quote sent",
      "quote approved",
      "rejected",
      "surveyor assigned"
    ],
    default: "pending review"
  }
}, { timestamps: true });

module.exports =
  mongoose.models.InspectionRequest ||
  mongoose.model("InspectionRequest", requestSchema);