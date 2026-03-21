const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspectionController");

// Create request
router.post("/add", inspectionController.createInspection);

// Assign surveyor
router.post("/assign", inspectionController.assignSurveyor);

// Send preparation email
router.post("/send-prep", inspectionController.sendPreparation);

// Get all inspections
router.get("/", inspectionController.getAllInspections);

module.exports = router;