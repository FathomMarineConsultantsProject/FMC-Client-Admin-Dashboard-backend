const router = require("express").Router();
const Surveyor = require("../models/Surveyor");

// GET all
router.get("/", async (req, res) => {
  try {
    const surveyors = await Surveyor.find();
    res.json(surveyors);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const surveyor = await Surveyor.create(req.body);
    res.json(surveyor);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;