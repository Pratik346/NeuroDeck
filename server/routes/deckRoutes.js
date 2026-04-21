const express = require("express");
const router = express.Router();
const {
  getDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
} = require("../controller/deckController.js");
const { protect } = require("../middleware/authMiddleware.js");
router.route("/")
  .get(protect, getDecks)
  .post(protect, createDeck);
router.route("/:id")
  .get(protect, getDeckById)
  .put(protect, updateDeck)
  .delete(protect, deleteDeck);

module.exports = router;