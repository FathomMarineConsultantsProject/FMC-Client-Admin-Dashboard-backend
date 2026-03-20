const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generatePassword, sendPasswordEmail } = require("../utils/emailService");

const router = express.Router();

router.post("/create-user", async (req, res) => {
  try {
    const { email } = req.body;

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    await sendPasswordEmail(email, password);

    res.json({ message: "User created & email sent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;