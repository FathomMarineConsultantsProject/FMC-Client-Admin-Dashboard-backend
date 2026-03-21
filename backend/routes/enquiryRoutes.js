const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");

// Create enquiry + send email
router.post("/", enquiryController.createEnquiry);

// Get enquiry by token
router.get("/:token", enquiryController.getEnquiryByToken);

// Confirm / Decline
router.post("/confirm", enquiryController.confirmAvailability);
router.post("/decline", enquiryController.declineEnquiry);

// Admin dashboard
router.get("/", enquiryController.getAllEnquiries);

module.exports = router;