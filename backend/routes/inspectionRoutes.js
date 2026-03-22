const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspectionController");

// ✅ Route: GET /api/inspections/all
// Frontend call: axios.get('.../api/inspections/all')
router.get("/all", inspectionController.getAllInspections);

// ✅ Route: POST /api/inspections/add
// Frontend call: axios.post('.../api/inspections/add')
router.post("/add", inspectionController.createInspection);

// Surveyor and Prep routes
router.post("/assign", inspectionController.assignSurveyor);
router.post("/send-prep", inspectionController.sendPreparation);

module.exports = router;