const Inspection = require("../models/Inspection");
const Request = require("../models/InspectionRequest");
const Surveyor = require('../models/Surveyor');
const transporter = require("../config/mailer");

/* =========================
   CREATE INSPECTION (Add)
========================= */
exports.createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      clientId: req.user ? req.user.id : req.body.clientId // Backup if no token
    });
    res.json(request);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

    // Handle Duplicate Key (e.g., same requestId sent twice)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        msg: "An inspection with this requestId already exists." 
      });
    }

    res.status(500).json({ 
      success: false, 
      msg: "Internal Server Error", 
      details: error.message 
    });
  }
};

/* =========================
   ASSIGN SURVEYOR
========================= */
exports.assignSurveyor = async (req, res) => {
  try {
    const { requestId, surveyorId } = req.body;

    // Check karein ki IDs valid ObjectId format mein hain ya nahi
    if (!requestId || !surveyorId) {
      return res.status(400).json({ msg: "Please provide both requestId and surveyorId" });
    }

    // Yahan findById hi use karein
    const request = await Request.findById(requestId); 
    if (!request) {
      return res.status(404).json({ msg: "Request not found in Database" });
    }

    const surveyor = await Surveyor.findById(surveyorId);
    if (!surveyor) {
      return res.status(404).json({ msg: "Surveyor not found in Database" });
    }

    // Status update
    request.status = "Surveyor Assigned";
    await request.save();

    // Inspection record create karein
    const inspection = await Inspection.create({
      requestId: request._id,
      surveyorId: surveyor._id
    });

    res.json({ msg: "Surveyor assigned successfully", inspection });

  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

/* =========================
   SEND PREPARATION EMAIL
========================= */
exports.sendPreparation = async (req, res) => {
  try {
    const { inspectionId } = req.body;

    const inspection = await Inspection.findById(inspectionId)
      .populate("surveyorId")
      .populate("requestId");

    if (!inspection) {
      return res.status(404).json({ msg: "Inspection not found" });
    }

    if (!inspection.surveyorId) {
      return res.status(400).json({ msg: "Surveyor not assigned" });
    }

    await transporter.sendMail({
      to: inspection.surveyorId.email,
      subject: "Inspection Assignment",
      html: `
        <h3>Inspection Assigned</h3>
        <p><b>Vessel:</b> ${inspection.requestId?.vesselName || "N/A"}</p>
        <p><b>IMO:</b> ${inspection.requestId?.imoNumber || "N/A"}</p>
        <p><b>Port:</b> ${inspection.requestId?.port || "N/A"}</p>
      `
    });

    res.json({ msg: "Email sent to surveyor" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================
   GET ALL INSPECTIONS
========================= */
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find()
      .populate("surveyorId")
      .populate("requestId");
    res.json(inspections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};