const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspectionController");

// 1. Assign surveyor
router.post("/assign", inspectionController.assignSurveyor);

// 2. Send preparation email
router.post("/send-prep", inspectionController.sendPreparation);

// ✅ ISSE UNCOMMENT KAREIN (Pehle // laga tha, ab hata dein)
router.post("/add", inspectionController.createInspection); 

// ✅ ISSE BHI UNCOMMENT KAREIN (Agar saari inspections dekhni hain)
router.get("/", inspectionController.getAllInspections);

module.exports = router;