const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  // ✅ Unique Request ID (safe with sparse)
  requestId: { type: String, unique: true, sparse: true },

  // ✅ Client Info (IMPROVED)
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: false
  },

  clientEmail: { 
    type: String, 
    required: true,          // ✅ make email required
    lowercase: true,         // ✅ always store in lowercase
    trim: true               // ✅ remove spaces
  },

  // ✅ Survey Info
  surveyorId: { type: String }, 
  inspectionDate: { type: Date },   // ✅ better than string
  notes: { type: String },

  // ✅ Request Details
  inspectionType: String,
  shipType: String,
  port: String,
  country: String,
  dateFrom: { type: Date },   // ✅ better as Date
  dateTo: { type: Date },

  // ✅ Status (MATCH FRONTEND EXACTLY)
  status: { 
    type: String, 
    enum: [
      'Pending Review',
      'Quote Sent',
      'Quote Approved',
      'Scheduled',
      'Surveyor Assigned',
      'Inspection Completed'
    ],
    default: 'Pending Review'
  },

  // ✅ Vessel Data
  vesselDetails: {
    name: String,
    imo: String,
    flag: String,
    classSociety: String
  },

  // ✅ Preparation Data
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
    crewMembers: [
      { 
        name: String, 
        position: String, 
        nationality: String 
      }
    ],
    ownerDetails: {
      company: String,
      contact: String,
      managerContact: String,
      chartererContact: String
    }
  },

  fees: Number

}, { timestamps: true }); // ✅ auto createdAt & updatedAt

module.exports = mongoose.model('Inspection', InspectionSchema);