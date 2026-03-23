const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  // ObjectId agar user login hai, warna string bhi rakh sakte hain
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientEmail: String, // Filtering ke liye zaroori hai
  requestId: { type: String, unique: true },
  inspectionType: String,
  shipType: String,
  port: String,
  country: String,
  dateFrom: Date,
  dateTo: Date,
  fees: { type: Number, default: 0 },
  status: {
    type: String,
    // Enum lowercase rakhein taaki Postman aur Frontend se mismatch na ho
    enum: ["pending review", "quote sent", "quote approved", "rejected", "surveyor assigned"],
    default: "pending review"
  }
}, { timestamps: true });

module.exports = mongoose.model("InspectionRequest", requestSchema);