const mongoose = require('mongoose');

const SurveyorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  location: String,
  status: { type: String, enum: ['Active', 'Busy', 'On Leave', 'Unavailable'], default: 'Active' }
});

module.exports = mongoose.model('Surveyor', SurveyorSchema);