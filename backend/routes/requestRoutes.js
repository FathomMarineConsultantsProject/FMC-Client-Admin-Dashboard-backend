const express = require("express");
const router = express.Router();

// ✅ USE CORRECT MODEL
const Request = require("../models/InspectionRequest");

/* =========================
   CREATE REQUEST
========================= */
router.post("/add", async (req, res) => {
  try {
    const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);

    const newRequest = new Request({
      ...req.body,
      requestId,
      status: "pending review" // ✅ match enum
    });

    await newRequest.save();

    res.status(201).json(newRequest);

  } catch (err) {
    console.error("ADD ERROR:", err); // ✅ debug
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL REQUESTS
========================= */
router.get("/all", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Could not retrieve requests" });
  }
});

module.exports = router;