const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  surveyorName: String,
  surveyorEmail: String,

  shipType: String,
  serviceType: String,
  portCountry: String,

  inspectionFrom: Date,
  inspectionTo: Date,

  recommendedFee: Number,
  surveyorFee: Number,

  token: String,

  status: {
    type: String,
    enum: ["pending", "confirmed", "declined"],
    default: "pending"
  },

  declineReason: String

}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);