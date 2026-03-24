const Request = require("../models/InspectionRequest");

/* =========================
   CREATE REQUEST
========================= */
exports.createRequest = async (req, res) => {
  try {
    if (!req.body.clientEmail || !req.body.inspectionType) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const request = await Request.create({
      ...req.body,
      requestId: "REQ-" + Math.floor(100000 + Math.random() * 900000),
      clientId: req.user ? req.user.id : req.body.clientId,
      clientEmail: req.user ? req.user.email : req.body.clientEmail
    });

    res.status(201).json(request);

  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({ msg: "Duplicate request" });
    }

    res.status(500).json({ msg: error.message });
  }
};

/* =========================
   GET ALL REQUESTS (ADMIN)
========================= */
exports.getAllRequests = async (req, res) => {
  try {
    const data = await Request.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================
   UPDATE STATUS
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Update failed" });
  }
};