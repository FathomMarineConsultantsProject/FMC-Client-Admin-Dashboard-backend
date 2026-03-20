const Quote = require('../models/Quote');
const Request = require("../models/InspectionRequest");
const transporter = require("../config/mailer");

/* =========================
   CREATE QUOTE
========================= */
exports.createQuote = async (req, res) => {
  try {
    const { requestId, amount } = req.body;

    // Validation
    if (!requestId || !amount) {
      return res.status(400).json({ msg: "Missing requestId or amount" });
    }

    // Find request
    const request = await Request.findById(requestId).populate("clientId");

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (!request.clientId) {
      return res.status(400).json({ msg: "Client not found" });
    }

    // Create quote
    const quote = await Quote.create({
      requestId,
      amount
    });

    // Update request status
    request.status = "Quote Sent";
    await request.save();

    // Send email
    await transporter.sendMail({
      to: request.clientId.email,
      subject: "Inspection Quote",
      html: `
        <h3>Inspection Quote</h3>
        <p>Your quotation amount is:</p>
        <h2>₹ ${amount}</h2>

        <p>Please login to approve or reject the quote.</p>
      `
    });

    res.json({
      msg: "Quote created and email sent",
      quote
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};