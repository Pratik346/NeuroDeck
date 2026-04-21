const express = require("express");
const router = express.Router();
const { updateProgress } = require("../controller/gamificationController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.post("/update", protect, updateProgress);
module.exports = router;