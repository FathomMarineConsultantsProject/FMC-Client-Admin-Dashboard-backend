const Inspection = require("../models/Inspection");
const Request = require("../models/InspectionRequest");
const Surveyor = require("../surveyor.js"); // ⚠️ match your filename
const transporter = require("../config/mailer");

/* =========================
   ASSIGN SURVEYOR
========================= */
exports.assignSurveyor = async (req, res) => {
  try {
    const { requestId, surveyorId } = req.body;

    if (!requestId || !surveyorId) {
      return res.status(400).json({ msg: "Missing data" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const surveyor = await Surveyor.findById(surveyorId);
    if (!surveyor) {
      return res.status(404).json({ msg: "Surveyor not found" });
    }

    request.status = "Surveyor Assigned";
    await request.save();

    const inspection = await Inspection.create({
      requestId,
      surveyorId
    });

    res.json({
      msg: "Surveyor assigned successfully",
      inspection
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
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
        <p><b>Vessel:</b> ${inspection.vesselName || "N/A"}</p>
        <p><b>IMO:</b> ${inspection.imoNumber || "N/A"}</p>
        <p><b>Port:</b> ${inspection.port || "N/A"}</p>
      `
    });

    res.json({ msg: "Email sent to surveyor" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};