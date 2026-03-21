const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");

// Create quote
router.post("/", quoteController.createQuote);

// Approve / Reject
router.patch("/:id", quoteController.updateQuoteStatus);

module.exports = router;