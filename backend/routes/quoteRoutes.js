const router = require("express").Router();
const quoteController = require("../controllers/quoteController");

// POST -> /api/quotes/send
router.post("/send", quoteController.createQuote);

module.exports = router;