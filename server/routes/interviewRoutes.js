const express = require("express");
const router = express.Router();
const { startInterview, submitInterview } = require("../controller/interviewController.js");
const { protect } = require("../middleware/authMiddleware");
router.get("/start", protect, startInterview);
router.post("/submit", protect, submitInterview);
module.exports = router;