const express = require("express");
const router = express.Router();
const surveyorController = require("../controllers/surveyorController");
const Enquiry = require("../models/Enquiry"); // Enquiry model import karein

// Dashboard ke liye saari enquiries fetch karna
router.get("/all", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

// Surveyor actions
router.post("/create", surveyorController.createEnquiry);
router.get("/token/:token", surveyorController.getEnquiryByToken); // Token path sahi kiya
router.post("/confirm", surveyorController.confirmAvailability);
router.post("/decline", surveyorController.declineEnquiry);

module.exports = router;