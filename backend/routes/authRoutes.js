const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");

/* =========================
   AUTH ROUTES
========================= */

// ✅ Register (Client)
router.post("/register", register);

// ✅ Login (Admin + Client)
router.post("/login", login);

module.exports = router;