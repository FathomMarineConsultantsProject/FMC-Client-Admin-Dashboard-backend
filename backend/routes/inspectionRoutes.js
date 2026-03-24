const express = require("express");
const router = express.Router();
const Inspection = require("../models/InspectionRequest");

// ✅ GET ALL INSPECTIONS
router.get("/", async (req, res) => {
  try {
    console.log("📥 Fetching inspections...");

    const data = await Inspection.find().sort({ createdAt: -1 });

    console.log("✅ Found:", data.length);

    res.status(200).json(data); // ❗ VERY IMPORTANT
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;