const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiryRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fmc-ca-inspection-dashboardd.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "CA Backend is running" });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false
  });

  isConnected = true;
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    return res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/enquiries", enquiryRoutes);

module.exports = app;