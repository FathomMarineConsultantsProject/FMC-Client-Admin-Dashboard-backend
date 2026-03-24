const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const surveyorRoutes = require("./routes/surveyorRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

/* =========================
   MIDDLEWARE
========================= */
app.use(helmet());
app.use(morgan("dev"));

app.use(cors({
  origin: [
    "http://localhost:8080", // for local dev
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

app.use(express.json());

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({ message: "🚀 CA Backend running" });
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/surveyors", surveyorRoutes);
app.use("/api/enquiries", enquiryRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
});

/* =========================
   DB CONNECTION (IMPORTANT FIX)
========================= */

// ✅ Always connect DB (Vercel needs this)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch(err => console.error("❌ DB Error:", err));

/* =========================
   LOCAL SERVER ONLY
========================= */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
}

module.exports = app;