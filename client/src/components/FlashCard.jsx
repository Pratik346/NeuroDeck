import { useState } from "react";

const FlashCard = ({ card, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div style={styles.wrapper}>
      {/* CARD */}
      <div style={styles.card}>
        
        {/* CONTENT (scroll-safe) */}
        <div style={styles.content}>
          <span style={styles.label}>
            {showAnswer ? "Answer" : "Question"}
          </span>

          <p style={styles.text}>
            {showAnswer ? card.answer : card.question}
          </p>
        </div>

        {/* ACTIONS (always inside) */}
        <div style={styles.actions}>
          <button
            style={styles.flipBtn}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Show Question" : "Show Answer"}
          </button>

          {onDelete && (
            <button
              style={styles.deleteBtn}
              onClick={() => onDelete(card._id)}
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* BADGE */}
      <div style={styles.footer}>
        <span style={styles.diffBadge}>
          {card.difficulty || "new"}
        </span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  /* ✅ FIXED CARD */
  card: {
    minHeight: "220px",
    maxHeight: "320px",   // important fix
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    padding: "1.5rem",
    borderRadius: "18px",

    background:
      "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25))",

    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.2)",

    boxShadow:
      "0 10px 30px rgba(99,102,241,0.25), inset 0 0 10px rgba(255,255,255,0.1)",

    cursor: "default",
  },

  /* ✅ SCROLL INSIDE CONTENT (fix overflow issue) */
  content: {
    flex: 1,
    overflowY: "auto",
    textAlign: "center",
    color: "white",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    paddingRight: "5px",
  },

  label: {
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.7,
    marginBottom: "0.6rem",
  },

  text: {
    fontSize: "1rem",
    lineHeight: 1.6,
    fontWeight: "500",
    wordBreak: "break-word",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    flexShrink: 0, // IMPORTANT: keeps buttons inside
  },

  flipBtn: {
    padding: "8px 14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",

    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: "0.85rem",
  },

  deleteBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",

    background: "rgba(255, 0, 0, 0.25)",
    color: "white",
    fontSize: "0.9rem",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "0.3rem",
  },

  diffBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.7rem",
    background: "rgba(255,255,255,0.2)",
    color: "white",
  },
};

export default FlashCard;