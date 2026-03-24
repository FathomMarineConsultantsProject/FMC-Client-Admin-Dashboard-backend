const express = require("express");
const router = express.Router();
const Inspection = require("../models/Inspection");

// CLIENT: Create New Request
router.post("/add", async (req, res) => {
  try {
    const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);
    const newRequest = new Inspection({ 
      ...req.body, 
      requestId,
      status: "Pending Review" // Default starting status
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET all requests for the Admin table
router.get("/all", async (req, res) => {
  try {
    // Sort by most recent first
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve requests" });
  }
});

module.exports = router;