console.log("✅ enquiryRoutes loaded");
const express = require("express");
const router = express.Router();
const surveyorController = require("../controllers/surveyorController");

// ✅ ADD THIS DEBUG
console.log("✅ enquiryRoutes working");

// ✅ FIX: explicitly define full path
router.post("/create", surveyorController.createEnquiry);

router.get("/:token", surveyorController.getEnquiryByToken);
router.post("/confirm", surveyorController.confirmAvailability);
router.post("/decline", surveyorController.declineEnquiry);

module.exports = router;