const router = require("express").Router();
const Surveyor = require("../models/Surveyor");

// GET all -> /api/surveyors
router.get("/", async (req, res) => {
  try {
    const surveyors = await Surveyor.find();
    res.json(surveyors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE -> /api/surveyors/add (Isse image_a411e4.png fix hogi)
router.post("/add", async (req, res) => {
  try {
    const surveyor = await Surveyor.create(req.body);
    res.status(201).json(surveyor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;