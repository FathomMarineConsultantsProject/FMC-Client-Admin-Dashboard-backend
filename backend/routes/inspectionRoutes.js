const express = require('express');
const router = express.Router();
const Inspection = require('../models/Inspection');
const Quote = require('../models/Quote');
const nodemailer = require('nodemailer');

// 1. CLIENT: Create Inspection Request
router.post('/add', async (req, res) => {
  try {
    const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);
    const newRequest = new Inspection({ ...req.body, requestId });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ADMIN: Send Quote
router.post('/send-quote', async (req, res) => {
  const { requestId, amount, clientEmail, inspectionType, port } = req.body;
  try {
    const quoteId = "QT-" + Math.floor(1000 + Math.random() * 9000);
    const newQuote = new Quote({ id: quoteId, requestId, clientEmail, amount, inspectionType, port });
    await newQuote.save();

    await Inspection.findOneAndUpdate({ requestId }, { status: 'Quote Sent' });
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CLIENT: Approve/Reject Quote
router.patch('/update-quote/:id', async (req, res) => {
  const { status } = req.body; // 'Approved' or 'Rejected'
  try {
    const quote = await Quote.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (status === 'Approved') {
      await Inspection.findOneAndUpdate({ requestId: quote.requestId }, { status: 'Quote Approved' });
    }
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ADMIN: Send Preparation Info (Final Email to Surveyor)
router.post('/send-prep-info', async (req, res) => {
  const { inspectionId, surveyorEmail, vesselDetails, preparationInfo } = req.body;
  
  try {
    // Save details to DB
    await Inspection.findOneAndUpdate(
      { requestId: inspectionId }, 
      { vesselDetails, preparationInfo, status: 'Surveyor Assigned' }
    );

    // Setup Mailer
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: surveyorEmail,
      subject: `Inspection Assignment: ${vesselDetails.name}`,
      text: `
        Dear Surveyor,

        You have been assigned for a vessel inspection.

        VESSEL DETAILS:
        Name: ${vesselDetails.name}
        IMO: ${vesselDetails.imo}
        Port: ${vesselDetails.port}

        CAPTAIN CONTACT:
        Phone: ${preparationInfo.captainContact.phone}
        Email: ${preparationInfo.captainContact.email}

        SPECIAL FOCUS AREAS:
        ${preparationInfo.specialFocus.join(', ')}

        Regards,
        Fathom Marine Consultants
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Preparation info sent and surveyor notified." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetching all data for the Admin Dashboard
// GET all inspections for Admin Dashboard stats
router.get("/all", async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    const quotes = await Quote.find().sort({ createdAt: -1 });
    
    // Send both in one response to reduce network calls
    res.json({
      inspections,
      quotes
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
module.exports = router;