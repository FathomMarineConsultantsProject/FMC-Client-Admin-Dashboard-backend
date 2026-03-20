const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const surveyorRoutes = require("./routes/surveyorRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes"); 

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/surveyors", surveyorRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/enquiries", enquiryRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));