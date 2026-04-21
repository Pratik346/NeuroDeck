const User = require("../models/user.js");

// XP required to level up
const xpForLevel = (level) => level * 100;

// Badge logic
const checkBadges = (user) => {
  const badges = new Set(user.badges);

  if (user.streak >= 7) badges.add("7-Day Streak");
  if (user.streak >= 30) badges.add("30-Day Streak");

  if (user.totalCardsStudied >= 100) badges.add("100 Cards Completed");
  if (user.totalCardsStudied >= 500) badges.add("500 Cards Completed");

  if (user.level >= 5) badges.add("Level 5 Achiever");

  return [...badges];
};

// @route POST /api/gamification/update
// Called after every card review
const updateProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "xp totalXP level streak badges totalCardsStudied lastStudyDate xpHistory"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Date helpers
    const todayStr = new Date().toISOString().split("T")[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDate = user.lastStudyDate
      ? new Date(user.lastStudyDate)
      : null;

    // 🔹 Streak logic
    if (!lastDate || lastDate < today) {
      if (lastDate && lastDate >= yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastStudyDate = new Date();
    }

    // 🔹 XP gained per action
    const XP_GAIN = 10;
    const xpGained = XP_GAIN;

    // 🔹 Ensure history exists
    if (!user.xpHistory) {
      user.xpHistory = [];
    }

    // 🔹 Update today's XP entry
    const todayEntry = user.xpHistory.find(
      (item) => item.date === todayStr
    );

    if (todayEntry) {
      todayEntry.xp += xpGained;
    } else {
      user.xpHistory.push({
        date: todayStr,
        xp: xpGained,
      });
    }

    // 🔹 Keep only last 30 days
    if (user.xpHistory.length > 30) {
      user.xpHistory = user.xpHistory.slice(-30);
    }

    // 🔹 Safe totalXP init (for old users)
    if (user.totalXP == null) {
      user.totalXP = 0;
    }

    // 🔹 Add XP
    user.totalXP += xpGained; // lifetime XP
    user.xp += xpGained;      // current level XP
    user.totalCardsStudied += 1;

    // 🔹 Level-up logic
    while (user.xp >= xpForLevel(user.level)) {
      user.xp -= xpForLevel(user.level);
      user.level += 1;
    }

    // 🔹 Update badges
    user.badges = checkBadges(user);

    await user.save();

    // 🔹 Sort history before sending (important for graph)
    const sortedHistory = user.xpHistory.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 🔹 Final response
    res.json({
      xpGained,
      xp: user.xp,
      totalXP: user.totalXP,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      totalCardsStudied: user.totalCardsStudied,
      xpHistory: sortedHistory,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProgress };