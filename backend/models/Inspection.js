const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  clientId: { type: String, required: true },
  clientEmail: { type: String, required: true },
  inspectionType: String,
  shipType: String,
  port: String,
  country: String,
  dateFrom: String,
  dateTo: String,
  status: { 
    type: String, 
    enum: ['Pending Review', 'Quote Sent', 'Quote Approved', 'Surveyor Assigned', 'Inspection Completed'],
    default: 'Pending Review' 
  },
  // Data for the "Preparation" form
  vesselDetails: {
    name: String,
    imo: String,
    flag: String,
    classSociety: String
  },
  preparationInfo: {
    lastInspectionDate: String,
    certificateValidity: String,
    complianceIssues: String,
    captainName: String,
    captainContact: { phone: String, email: String },
    shipEmail: String,
    specialFocus: [String],
    crewMembers: [{ name: String, position: String, nationality: String }],
    ownerDetails: {
      company: String,
      contact: String,
      managerContact: String,
      chartererContact: String
    }
  },
  fees: Number,
  surveyorId: String, // ID or Email from your other backend
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspection', InspectionSchema);