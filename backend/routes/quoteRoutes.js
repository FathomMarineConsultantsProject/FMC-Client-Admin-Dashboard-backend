const express = require("express");
const router = express.Router();
const Inspection = require("../models/Inspection");
const nodemailer = require("nodemailer");

// ADMIN: Finalize Preparation and Notify Surveyor
router.post("/send-prep-info", async (req, res) => {
  const { 
    inspectionId, 
    surveyorEmail, 
    surveyorName,
    vesselDetails, 
    preparationInfo 
  } = req.body;

  try {
    // 1. Update the Inspection record with all vessel/crew details
    const updatedInspection = await Inspection.findOneAndUpdate(
      { requestId: inspectionId },
      { 
        vesselDetails, 
        preparationInfo, 
        surveyorEmail,
        surveyorName,
        status: "Surveyor Assigned" 
      },
      { new: true }
    );

    // 2. Setup Nodemailer (Use your .env credentials)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Compose the Email
    const mailOptions = {
      from: `"Fathom Marine Operations" <${process.env.EMAIL_USER}>`,
      to: surveyorEmail,
      subject: `URGENT: Inspection Assignment - ${vesselDetails.name}`,
      html: `
        <h3>Inspection Assignment Details</h3>
        <p>Hello ${surveyorName},</p>
        <p>You have been assigned to the following inspection:</p>
        <ul>
          <li><strong>Vessel:</strong> ${vesselDetails.name} (IMO: ${vesselDetails.imo})</li>
          <li><strong>Type:</strong> ${updatedInspection.inspectionType}</li>
          <li><strong>Location:</strong> ${updatedInspection.port}, ${updatedInspection.country}</li>
        </ul>
        <h4>Preparation Details:</h4>
        <p><strong>Captain:</strong> ${preparationInfo.captainName}</p>
        <p><strong>Special Focus:</strong> ${preparationInfo.specialFocus.join(", ")}</p>
        <br/>
        <p>Please log in to the portal to view full crew lists and documents.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Surveyor notified and data saved successfully", updatedInspection });
  } catch (err) {
    console.error("Prep Info Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch all inspections (for the Overview/Dashboard)
router.get("/all", async (req, res) => {
  try {
    const data = await Inspection.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;