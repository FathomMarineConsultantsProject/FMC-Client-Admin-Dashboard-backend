const router = require("express").Router();
const Surveyor = require("../models/Surveyor");

// GET all surveyors
router.get("/", async (req, res) => {
  try {
    const surveyors = await Surveyor.find();
    res.json(surveyors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create surveyor
router.post("/", async (req, res) => {
  try {
    const surveyor = await Surveyor.create(req.body);
    res.json(surveyor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;