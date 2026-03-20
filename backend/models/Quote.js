const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // generated (e.g., QT-1234)
  requestId: String,
  clientEmail: String,
  inspectionType: String,
  port: String,
  amount: Number,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model('Quote', QuoteSchema);