const Enquiry = require("../models/Enquiry");
const transporter = require("../config/mailer");
const crypto = require("crypto");

/* ============================================================
   1. CREATE ENQUIRY & SEND EMAIL (Matching Image 1)
============================================================ */
exports.createEnquiry = async (req, res) => {
  console.log("🚀 API HIT: Sending Mail to Surveyor...");

  try {
    const {
      surveyorName,
      surveyorEmail,
      shipType,
      serviceType,
      portCountry,
      inspectionFrom,
      inspectionTo,
      recommendedFee
    } = req.body;

    // Unique token for the response link
    const token = crypto.randomBytes(24).toString("hex");

    const enquiry = await Enquiry.create({
      surveyorName,
      surveyorEmail,
      shipType,
      serviceType,
      portCountry,
      inspectionFrom,
      inspectionTo,
      recommendedFee,
      token
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${frontendUrl}/surveyor-enquiry/${token}`;

    // Professional HTML Email Layout (Company: Fathom Marine Consultants)
    await transporter.sendMail({
      from: '"Fathom Marine Consultants" <donotreply@fathommarine.com>',
      to: surveyorEmail,
      subject: "You are invited to confirm your availability for a new assignment",
      html: `
        <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 650px; margin: auto; padding: 20px; line-height: 1.5;">
          <p style="margin-bottom: 25px;">Dear ${surveyorName},</p>
          
          <p style="font-weight: bold; margin-bottom: 25px;">PLEASE DO NOT RESPOND TO THIS EMAIL</p>
          
          <p style="margin-bottom: 25px;">
            You are invited to confirm your availabilty for the following assignment: 
            <a href="${link}" style="color: #0056b3; text-decoration: underline;">Please click here to indicate your availability to attend</a>
          </p>

          <p style="font-style: italic; font-size: 13px; color: #333; margin-top: 30px; margin-bottom: 25px;">
            Inspection prices are in the agreed currency (USD, GBP or EUR). This is a lump sum inclusive of time for travel, 
            survey and reporting plus related expenses such as travel, airfares and other subsistence. 
            Prices exclude any local agent fees or launch boat costs if applicable.
          </p>

          <p style="margin-bottom: 25px;">
            This enquiry is time sensitive, therefore your swift response is appreciated. 
            If you are unavailable to attend you can decline on the above line.
          </p>

          <p>In case you require any assistance please contact operations.</p>
        </div>
      `
    });

    res.json({ success: true, message: "Enquiry sent and broadcasted", enquiry });

  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({ success: false, message: "Server error while sending email" });
  }
};

/* ============================================================
   2. GET ENQUIRY BY TOKEN (For the Detail Page - Image 2)
============================================================ */
exports.getEnquiryByToken = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ token: req.params.token });

    if (!enquiry) {
      return res.status(404).json({ message: "Request not found or expired" });
    }

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   3. CONFIRM (Submit Surveyor's Fee)
============================================================ */
exports.confirmAvailability = async (req, res) => {
  try {
    const { token, fee } = req.body;

    const enquiry = await Enquiry.findOneAndUpdate(
      { token },
      { 
        surveyorFee: fee, 
        status: "confirmed" 
      },
      { new: true }
    );

    if (!enquiry) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, message: "Availability confirmed", enquiry });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   4. DECLINE
============================================================ */
exports.declineEnquiry = async (req, res) => {
  try {
    const { token, reason } = req.body;

    const enquiry = await Enquiry.findOneAndUpdate(
      { token },
      { status: "declined", declineReason: reason },
      { new: true }
    );

    res.json({ success: true, message: "Enquiry declined", enquiry });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   5. GET ALL
============================================================ */
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};