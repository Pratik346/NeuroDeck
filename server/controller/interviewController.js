const Card = require("../models/card.js");
const { evaluateInterview } = require("../services/geminiService.js");

// -------------------- START INTERVIEW --------------------
const startInterview = async (req, res) => {
  try {
    const cards = await Card.aggregate([
      { $match: { user: req.user._id } },
      { $sample: { size: 10 } },
    ]);

    if (cards.length === 0) {
      return res.status(400).json({
        message: "No cards found. Create some decks first!",
      });
    }

    res.json({
      totalQuestions: cards.length,
      cards: cards.map((c) => ({
        cardId: c._id,
        question: c.question,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- SUBMIT INTERVIEW --------------------
const submitInterview = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        message: "No answers provided",
      });
    }

    // 1️⃣ Fetch cards securely from DB
    const cards = await Card.find({
      _id: { $in: answers.map((a) => a.cardId) },
      user: req.user._id,
    }).lean();

    // 2️⃣ Prepare AI input (NO cardId used)
    const formatted = answers.map((a, index) => {
      const card = cards.find(
        (c) => c._id.toString() === a.cardId.toString()
      );

      return {
        index,
        question: card?.question,
        correctAnswer: card?.answer,
        userAnswer: a.userAnswer,
      };
    });

    // 3️⃣ AI evaluation
    const evaluations = await evaluateInterview(formatted);

    if (!Array.isArray(evaluations)) {
      return res.status(500).json({
        message: "Invalid AI response",
      });
    }

    // 4️⃣ Score + weak cards (INDEX BASED)
    let totalScore = 0;
    const weakCards = [];

    for (const e of evaluations) {
      totalScore += e.score;

      const card = cards[e.index]; // 🔥 SAFE MAPPING

      if (!e.isCorrect && card) {
        weakCards.push(card);
      }
    }

    // 5️⃣ Bulk update (SAFE OBJECTID USAGE)
    const operations = evaluations
      .map((e) => {
        const card = cards[e.index];

        if (!card) return null;

        return {
          updateOne: {
            filter: { _id: card._id },
            update: {
              isCorrect: e.isCorrect,
              lastReviewed: new Date(),
              difficulty:
                e.score >= 8
                  ? "easy"
                  : e.score >= 6
                  ? "good"
                  : e.score >= 4
                  ? "hard"
                  : "again",
              $inc: { reviewCount: 1 },
            },
          },
        };
      })
      .filter(Boolean);

    await Card.bulkWrite(operations);

    // 6️⃣ Weak areas
    const weakAreas = [
      ...new Set(
        weakCards.map((c) => c.deck?.title).filter(Boolean)
      ),
    ];

    // 7️⃣ Average score
    const average = +(
      (totalScore / (answers.length * 10)) *
      100
    ).toFixed(1);

    // 8️⃣ Response
    res.json({
      evaluations,
      totalScore,
      average,
      total: answers.length,
      weakAreas,
      message:
        average >= 80
          ? "🏆 Excellent! You're interview ready!"
          : average >= 60
          ? "👍 Good job! Review your weak areas."
          : "📚 Keep studying — you'll get there!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  submitInterview,
};