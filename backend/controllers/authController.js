const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   REGISTER (FIXED)
========================= */
exports.register = async (req, res) => {
  try {
    const {
      companyName,
      addressRegional,
      addressISM,
      shipType,
      contactPerson,
      phone,
      email,
      username,
      password
    } = req.body;

    // check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        msg: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with ALL fields
    const user = await User.create({
      companyName,
      addressRegional,
      addressISM,
      shipType,
      contactPerson,
      phone,
      email,
      username,
      password: hashedPassword,
      role: "client" // 🔒 fixed role
    });

    res.status(201).json({
      success: true,
      msg: "Registered successfully",
      user: {
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
};


/* =========================
   LOGIN (ALREADY CORRECT)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 ADMIN LOGIN
    if (
      email === "admin@fathommarine.com" &&
      password === "admin123"
    ) {
      return res.json({
        success: true,
        user: {
          email,
          role: "admin"
        },
        token: "admin-token"
      });
    }

    // 👤 CLIENT LOGIN
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid password"
      });
    }

    res.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      },
      token: "client-token"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message
    });
  }
};