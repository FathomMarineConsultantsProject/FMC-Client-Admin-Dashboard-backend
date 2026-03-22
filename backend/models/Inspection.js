const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  // 🆔 Unique Request ID (String format: REQ-123456)
  requestId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  
  // 👤 Client Info
  clientId: { type: String }, 
  clientEmail: { type: String },

  // 🛠️ Surveyor Assignment 
  // (Isse hum Admin Dashboard mein Surveyor ka actual data 'populate' kar payenge)
  surveyorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Surveyor' 
  }, 

  // 📅 Inspection Details
  inspectionDate: { type: String }, 
  notes: { type: String },
  inspectionType: { type: String },
  shipType: { type: String },
  port: { type: String },
  country: { type: String },
  dateFrom: { type: String },
  dateTo: { type: String },
  
  // 🚦 Workflow Status
  status: { 
    type: String, 
    enum: [
      'Pending Review', 
      'Quote Sent', 
      'Quote Approved', 
      'Scheduled', 
      'Surveyor Assigned', 
      'Inspection Completed',
      'Rejected'
    ],
    default: 'Pending Review' 
  },

  // 🚢 Vessel Data
  vesselDetails: {
    name: { type: String },
    imo: { type: String },
    flag: { type: String },
    classSociety: { type: String }
  },

  // 📋 Full Preparation Data (For Surveyor App)
  preparationInfo: {
    lastInspectionDate: String,
    certificateValidity: String,
    complianceIssues: String,
    captainName: String,
    captainContact: { 
      phone: String, 
      email: String 
    },
    shipEmail: String,
    specialFocus: [String],
    crewMembers: [{ 
      name: String, 
      position: String, 
      nationality: String 
    }],
    ownerDetails: {
      company: String,
      contact: String,
      managerContact: String,
      chartererContact: String
    }
  },

  // 💰 Financials
  fees: { 
    type: Number, 
    default: 0 
  },

  // 🕒 Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware: Save se pehle date format ya auto-id logic yahan add kar sakte hain
module.exports = mongoose.model('Inspection', InspectionSchema);