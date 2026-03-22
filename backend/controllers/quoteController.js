const Quote = require("../models/Quote");
const Request = require("../models/Request");
const transporter = require("../config/mailer");

/* =========================
   CREATE QUOTE
========================= */
exports.createQuote = async (req, res) => {
  try {
    const { requestId, amount, clientEmail } = req.body;

    // Validation
    if (!requestId || !amount || !clientEmail) {
      return res.status(400).json({ msg: "Missing requestId, amount or clientEmail" });
    }

    // Check request exists
    const request = await Request.findOne({ requestId: requestId });
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Create quote
    const quote = await Quote.create({
      requestId,
      amount,
      clientEmail,
      status: "Pending"
    });

    // Update request status
    request.status = "Quote Sent";
    await request.save();

    // Send email
    await transporter.sendMail({
      to: clientEmail,
      subject: "Inspection Quote",
      html: `
        <h3>Inspection Quote</h3>
        <p>Your quotation amount:</p>
        <h2>₹ ${amount}</h2>
      `
    });

    res.json({
      msg: "Quote created successfully",
      quote
    });

  } catch (error) {
    console.error("CREATE QUOTE ERROR:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


/* =========================
   UPDATE QUOTE STATUS
========================= */
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    // Find quote
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ msg: "Quote not found" });
    }

    // Update quote
    quote.status = status;
    await quote.save();

    // Update request
    const request = await Request.findById(quote.requestId);
    if (request) {
      request.status = status;
      await request.save();
    }

    // Send email
    if (quote.clientEmail) {
      await transporter.sendMail({
        to: quote.clientEmail,
        subject: `Quote ${status}`,
        html: `
          <h3>Quote ${status}</h3>
          <p>Amount: ₹ ${quote.amount}</p>
        `
      });
    }

    res.json({
      msg: `Quote ${status}`,
      quote
    });

  } catch (error) {
    console.error("UPDATE QUOTE ERROR:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};