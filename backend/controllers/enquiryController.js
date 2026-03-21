const Enquiry = require("../models/Enquiry"); // Check karein aapka model name yahi hai
const crypto = require("crypto");

// 1. Create Enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { email, details } = req.body;
    
    // Ek unique token generate karna (Confirm/Decline ke liye)
    const token = crypto.randomBytes(20).toString('hex');

    const newEnquiry = new Enquiry({
      email,
      details,
      token,
      status: "Pending"
    });

    await newEnquiry.save();
    
    // Yahan aap mailer use karke email bhej sakte hain (baad mein)
    res.status(201).json({ msg: "Enquiry created successfully", enquiry: newEnquiry });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// 2. Get Enquiry by Token
exports.getEnquiryByToken = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ token: req.params.token });
    if (!enquiry) return res.status(404).json({ msg: "Invalid token" });
    
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3. Confirm Availability
exports.confirmAvailability = async (req, res) => {
  try {
    const { token } = req.body;
    const enquiry = await Enquiry.findOneAndUpdate(
      { token },
      { status: "Confirmed" },
      { new: true }
    );
    res.json({ msg: "Availability confirmed!", enquiry });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 4. Decline Enquiry
exports.declineEnquiry = async (req, res) => {
  try {
    const { token } = req.body;
    await Enquiry.findOneAndUpdate({ token }, { status: "Declined" });
    res.json({ msg: "Enquiry declined." });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 5. Get All Enquiries (Admin)
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};