const Request = require("../models/InspectionRequest");

/* =========================
   1. CLIENT: Create New Request
========================= */
exports.createRequest = async (req, res) => {
  try {
    // Generate a human-readable ID if not sent from frontend
    const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);

    const request = await Request.create({
      ...req.body,
      requestId, // Unique ID for tracking
      clientId: req.user.id, // Auth middleware se user ID uthayega
      status: "Pending Review" // Default status
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create request", 
      error: err.message 
    });
  }
};

/* =========================
   2. CLIENT: See Own Requests
========================= */
exports.getMyRequests = async (req, res) => {
  try {
    // Sirf login kiye hue client ki requests dikhayega
    const data = await Request.find({ clientId: req.user.id })
      .sort({ createdAt: -1 }); // Nayi requests sabse upar
    
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =========================
   3. ADMIN: See All Requests
========================= */
exports.getAllRequests = async (req, res) => {
  try {
    // Admin table ke liye saara data with client email
    const data = await Request.find()
      .populate("clientId", "email name") 
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch all requests" });
  }
};