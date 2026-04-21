const Card = require("../models/card.js");
const User = require("../models/user.js");
// @route GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Card.countDocuments({
      user: userId,
      lastReviewed: { $ne: null },
    });
    const correct = await Card.countDocuments({
      user: userId,
      isCorrect: true,
      lastReviewed: { $ne: null },
    });
    const accuracy = total > 0 ? +(correct / total * 100).toFixed(1) : 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCards = await Card.countDocuments({
      user: userId,
      lastReviewed: { $gte: todayStart },
    });
    const weakCards = await Card.find({
      user: userId,
      difficulty: { $in: ["again", "hard"] },
    })
      .select("deck")
      .populate("deck", "title");
    const weakTopics = [
      ...new Set(
        weakCards
          .map((c) => c.deck?.title)
          .filter(Boolean)
      ),
    ];
    const user = await User.findById(userId).select(
      "xp totalXP level streak badges totalCardsStudied xpHistory"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      accuracy,
      streak: user.streak,
      todayCards,
      totalCardsStudied: user.totalCardsStudied,
      weakTopics,
      xp: user.xp,
      totalXP: user.totalXP || 0, 
      level: user.level,
      badges: user.badges,
      xpHistory: user.xpHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getAnalytics };