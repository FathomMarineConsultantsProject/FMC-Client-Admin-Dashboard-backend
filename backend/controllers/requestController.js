const Request = require("../models/InspectionRequest");

// Client creates request
exports.createRequest = async (req, res) => {
  const request = await Request.create({
    ...req.body,
    clientId: req.user.id
  });

  res.json(request);
};

// Client sees own requests
exports.getMyRequests = async (req, res) => {
  const data = await Request.find({ clientId: req.user.id });
  res.json(data);
};

// Admin sees all
exports.getAllRequests = async (req, res) => {
  const data = await Request.find().populate("clientId", "email");
  res.json(data);
};