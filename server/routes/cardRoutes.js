const express = require("express");
const router = express.Router();
const {
  generateCards,
  getCardsByDeck,
  addCard,
  deleteCard,
  updateCard,reviewCard
} = require("../controller/cardController.js");
const { protect } = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");

//  Specific routes FIRST
router.post("/generate/:deckId", protect, upload.single("file"), generateCards);
router.delete("/delete/:id", protect, deleteCard);
router.put("/:id", protect, updateCard);
router.patch("/review/:id", protect, reviewCard);

//  Generic routes LAST
router.get("/:deckId", protect, getCardsByDeck);
router.post("/:deckId", protect, addCard);

module.exports = router;