const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspectionController");

// 1. Assign surveyor (Ye function controller mein hai)
router.post("/assign", inspectionController.assignSurveyor);

// 2. Send preparation email (Ye function bhi controller mein hai)
router.post("/send-prep", inspectionController.sendPreparation);

// NOTE: Abhi ke liye niche wale dono ko comment kar dijiye jab tak 
// aap controller mein inka logic nahi likh lete.

// router.post("/add", inspectionController.createInspection); 
// router.get("/", inspectionController.getAllInspections);

module.exports = router;