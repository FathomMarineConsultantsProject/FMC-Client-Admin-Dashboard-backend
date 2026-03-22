const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  // Link to the original request
  requestId: { type: String, unique: true, required: true },
  
  // Client Info (Made optional if you don't always have it at creation)
  clientId: { type: String }, 
  clientEmail: { type: String },

  // Fields from your Postman request
  surveyorId: { type: String }, 
  inspectionDate: { type: String }, // Or Date type if you prefer
  notes: { type: String },

  // General Metadata
  inspectionType: String,
  shipType: String,
  port: String,
  country: String,
  dateFrom: String,
  dateTo: String,
  
  status: { 
    type: String, 
    enum: ['Pending Review', 'Quote Sent', 'Quote Approved', 'Scheduled', 'Surveyor Assigned', 'Inspection Completed'],
    default: 'Pending Review' 
  },

  // Vessel Data
  vesselDetails: {
    name: String,
    imo: String,
    flag: String,
    classSociety: String
  },

  // Preparation Data
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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspection', InspectionSchema);