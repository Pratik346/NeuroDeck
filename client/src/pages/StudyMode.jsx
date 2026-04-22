import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import cardService from "../services/cardService";
import studyService from "../services/studyServices.js";
import deckService from "../services/deckService";
import { getDifficultyColor } from "../utils/spaceRepetition.js";

const StudyMode = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  const [xpGained, setXpGained] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    fetchData();
  }, [deckId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setShowAnswer(true);
      }

      if (showAnswer) {
        if (e.key === "1") handleDifficulty("again");
        if (e.key === "2") handleDifficulty("hard");
        if (e.key === "3") handleDifficulty("good");
        if (e.key === "4") handleDifficulty("easy");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showAnswer, currentIndex]);

  const fetchData = async () => {
    try {
      const [deckData, response] = await Promise.all([
        deckService.getDeckById(deckId),
        cardService.getCardsByDeck(deckId),
      ]);

      setDeck(deckData);
      setCards(response.dueCards);
      setTotalCards(response.totalCards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficulty = async (difficulty) => {
    const card = cards[currentIndex];
  
    try {
      await studyService.updateCardDifficulty(card._id, difficulty);
      const progress = await studyService.updateProgress();
      setXpGained((prev) => prev + (progress.xpGained || 0));
      setTotalXP(progress.totalXP || 0);
  
      if (currentIndex + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
      }
  
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;

// Case 1: Deck is truly empty
if (totalCards === 0) {
  return (
    <div style={styles.emptyContainer}>
      <div style={styles.emptyCard}>
        <h2 style={styles.emptyTitle}>No Cards Yet 📭</h2>

        <p style={styles.emptyText}>
          This deck is empty. Add cards to start learning.
        </p>

        <button
          style={styles.emptyBtn}
          onClick={() => navigate(`/upload/${deckId}`)}
        >
          + Add Cards
        </button>
      </div>
    </div>
  );
}

// Case 2: No cards due
if (cards.length === 0) {
  return (
    <div style={styles.emptyContainer}>
      <div style={styles.emptyCard}>
        <h2 style={styles.emptyTitle}>You're Done for Today 🎉</h2>

        <p style={styles.emptyText}>
          No cards are due right now. Come back later.
        </p>

        <button
          style={styles.emptyBtn}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

  if (sessionComplete) {
    return (
      <div style={styles.completeContainer}>
        <div style={styles.completeGlow}></div>
  
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={styles.completeCard}
        >
          <h1 style={styles.completeTitle}>Session Complete</h1>
  
          <p style={styles.completeSub}>
            You have completed this study session
          </p>
  
          {/* XP BOX */}
          <div style={styles.xpBox}>
            <span style={styles.xpLabel}>XP Gained</span>
            <span style={styles.xpValue}>{xpGained}</span>
          </div>
  
          {/* ACTION BUTTONS */}
          <div style={styles.completeActions}>
            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
  
            <button
              style={styles.primaryBtn}
              onClick={() => {
                setCurrentIndex(0);
                setShowAnswer(false);
                setSessionComplete(false);
                setXpGained(0);
              }}
            >
              Study Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
          Back
        </button>

        <div style={styles.headerCenter}>
          <h2>{deck?.title}</h2>
          <span>{currentIndex + 1} / {cards.length}</span>
        </div>

        <div style={styles.xp}>XP:--{xpGained}</div>
      </div>

      {/* PROGRESS */}
      <div style={styles.progressBar}>
        <motion.div
          style={styles.progressFill}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          style={styles.card}
        >
          <p style={styles.label}>Question</p>
          <p style={styles.text}>{currentCard.question}</p>

          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ marginTop: "1rem" }}
              >
                <div style={styles.divider}></div>
                <p style={styles.label}>Answer</p>
                <p style={styles.answer}>{currentCard.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* ACTION */}
      {!showAnswer ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          style={styles.showBtn}
          onClick={() => setShowAnswer(true)}
        >
          Show Answer (Space)
        </motion.button>
      ) : (
        <div style={styles.diffRow}>
          {["again", "hard", "good", "easy"].map((d, i) => (
            <motion.button
              key={d}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.diffBtn,
                backgroundColor: getDifficultyColor(d),
              }}
              onClick={() => handleDifficulty(d)}
            >
              {d} ({i + 1})
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  completeContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    position: "relative",
  },
  
  completeGlow: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "#6366f1",
    filter: "blur(140px)",
    opacity: 0.3,
    pointerEvents: "none",
  },
  
  completeCard: {
    position: "relative",
    zIndex: 1,
    padding: "2.5rem",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "420px",
  
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
  
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    textAlign: "center",
    color: "white",
  },
  
  completeTitle: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  
  completeSub: {
    marginTop: "0.5rem",
    opacity: 0.7,
    fontSize: "0.9rem",
  },
  
  xpBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    borderRadius: "16px",
  
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "white",
  
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  
    boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
  },
  
  xpLabel: {
    fontSize: "0.8rem",
    opacity: 0.8,
  },
  
  xpValue: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  
  completeActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    justifyContent: "center",
  },
  
  primaryBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
  
    background: "linear-gradient(135deg,#22c55e,#4ade80)",
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },
  
  emptyCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    color: "white",
  },
  
  emptyTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  
  emptyText: {
    opacity: 0.7,
    marginBottom: "20px",
    fontSize: "0.95rem",
  },
  
  emptyBtn: {
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
    boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
  },
  secondaryBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
  
    background: "rgba(255,255,255,0.05)",
    color: "white",
  },

  backBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  headerCenter: { textAlign: "center" },

  xp: {
    background: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "10px",
  },

  progressBar: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "2rem",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#6366f1,#a855f7)",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    border: "1px solid rgba(255,255,255,0.15)",
    marginBottom: "2rem",
  },

  label: {
    fontSize: "0.8rem",
    opacity: 0.6,
    marginBottom: "0.5rem",
  },

  text: {
    fontSize: "1.3rem",
    lineHeight: 1.6,
  },

  answer: {
    marginTop: "0.5rem",
    opacity: 0.9,
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.2)",
    margin: "1rem 0",
  },

  showBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "white",
    cursor: "pointer",
  },

  diffRow: {
    display: "flex",
    gap: "10px",
  },

  diffBtn: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  complete: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  completeCard: {
    padding: "2rem",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
  },

  center: {
    textAlign: "center",
    marginTop: "3rem",
  },
};

export default StudyMode;