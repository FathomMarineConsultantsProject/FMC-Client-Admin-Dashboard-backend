const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { protect, admin } = require("../middleware/authMiddleware"); // ✅ Auth check zaroori hai

// 1. CLIENT: Create New Request
// URL: POST /api/requests/create
router.post("/create", protect, requestController.createRequest);

// 2. CLIENT: Get Logged-in User's Requests
// URL: GET /api/requests/my-requests
router.get("/my-requests", protect, requestController.getMyRequests);

// 3. ADMIN: Get All Requests for Admin Table
// URL: GET /api/requests/all
router.get("/all", protect, admin, requestController.getAllRequests);

// 4. ADMIN: Update Request (Quote/Status)
// URL: PATCH /api/requests/update/:id
router.patch("/update/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await Request.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    );
    res.json({ success: true, data: updatedRequest });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;