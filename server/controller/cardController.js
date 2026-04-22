const fs = require("fs");
const Tesseract = require("tesseract.js");
const Card = require("../models/card.js");
const Deck = require("../models/deck.js");
const { generateFlashcards } = require("../services/geminiService.js");
const safeDelete = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
const extractTextFromImage = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: () => {},
  });
  return result.data.text;
};
const generateCards = async (req, res) => {
  let filePath;

  try {
    const deck = await Deck.findById(req.params.deckId);

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    if (deck.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    filePath = req.file.path;

    const count = Math.min(parseInt(req.body.count) || 10, 20);

    //OCR
    const extractedText = await extractTextFromImage(filePath);

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        message: "Could not extract enough text from image",
      });
    }

    // Trim text safely
    const trimmedText = extractedText.slice(0, 10000);

    //Generate flashcards
    const flashcards = await generateFlashcards(trimmedText, count);

    const savedCards = await Card.insertMany(
      flashcards.map((card) => ({
        deck: deck._id,
        user: req.user._id,
        question: card.question,
        answer: card.answer,
      }))
    );

    await Deck.findByIdAndUpdate(deck._id, {
      $inc: { totalCards: savedCards.length },
    });

    res.status(201).json({
      message: `${savedCards.length} flashcards generated`,
      cards: savedCards,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });

  } finally {
    safeDelete(filePath);
  }
};
const getCardsByDeck = async (req, res) => {
  try {
    const cards = await Card.find({
      deck: req.params.deckId,
      user: req.user._id,
    });

    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addCard = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer required",
      });
    }

    const deck = await Deck.findById(req.params.deckId);

    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }

    const card = await Card.create({
      deck: req.params.deckId,
      user: req.user._id,
      question,
      answer,
    });

    await Deck.findByIdAndUpdate(req.params.deckId, {
      $inc: { totalCards: 1 },
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await card.deleteOne();

    await Deck.findByIdAndUpdate(card.deck, {
      $inc: { totalCards: -1 },
    });

    res.json({ message: "Card deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCard = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    card.question = question || card.question;
    card.answer = answer || card.answer;

    const updated = await card.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const reviewCard = async (req, res) => {
  try {
    const { difficulty } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const now = new Date();
    let nextReview;

    switch (difficulty) {
      case "again":
        nextReview = new Date(now.getTime() + 1 * 60 * 1000);
        break;
      case "hard":
        nextReview = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
      case "good":
        nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        break;
      case "easy":
        nextReview = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        nextReview = now;
    }

    card.difficulty = difficulty;
    card.nextReview = nextReview;
    card.lastReviewed = now;
    card.isCorrect = ["good", "easy"].includes(difficulty);
    card.reviewCount += 1;

    const updated = await card.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  generateCards,
  getCardsByDeck,
  addCard,
  deleteCard,
  updateCard,
  reviewCard,
};