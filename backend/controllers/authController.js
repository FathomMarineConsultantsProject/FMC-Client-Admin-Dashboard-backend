const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      username
    } = req.body;

    // check existing
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      companyName,
      email,
      username,
      password: hashedPassword,
      role: "client"
    });

    res.json({
      success: true,
      msg: "Registered successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
};