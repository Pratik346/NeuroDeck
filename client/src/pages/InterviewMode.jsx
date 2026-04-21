import { useState } from "react";
import { useNavigate } from "react-router-dom";
import interviewService from "../services/interviewService.js";

const InterviewMode = () => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState("intro");
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    setPhase("loading");
    try {
      const data = await interviewService.startInterview();
      setCards(data.cards);
      setPhase("answering");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview");
      setPhase("intro");
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      setError("Write an answer first");
      return;
    }

    const answerObj = {
      cardId: cards[currentIndex]._id,
      question: cards[currentIndex].question,
      correctAnswer: cards[currentIndex].answer,
      userAnswer: currentAnswer.trim(),
    };
    console.log(cards[currentIndex]);
    const updated = [...answers, answerObj];
    setAnswers(updated);
    setCurrentAnswer("");
    setError("");

    if (currentIndex + 1 >= cards.length) {
      handleSubmit(updated);
    } else {
      setCurrentIndex((p) => p + 1);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setPhase("submitting");
    try {
      const data = await interviewService.submitInterview(finalAnswers);
      setResults(data);
      setPhase("results");
    } catch (err) {
      setError("Evaluation failed");
      console.log(err);
      setPhase("answering");
    }
  };

  const progress =
    cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  /* ───────────────── INTRO ───────────────── */
  if (phase === "intro") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎯 Interview Mode</h1>
          <p style={styles.subtitle}>
            Practice like a real interview. Answer questions and get AI feedback.
          </p>

          <div style={styles.grid}>
            <div style={styles.info}>❓ 10 Questions</div>
            <div style={styles.info}>✍️ Write Answers</div>
            <div style={styles.info}>🤖 AI Review</div>
            <div style={styles.info}>📊 Score Report</div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.primaryBtn} onClick={handleStart}>
            Start Interview →
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ───────────────── LOADING ───────────────── */
  if (phase === "loading") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.loader}>⏳ Preparing your interview...</div>
        </div>
      </div>
    );
  }

  /* ───────────────── SUBMITTING ───────────────── */
  if (phase === "submitting") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.loader}>
            AI is evaluating your answers...
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────── ANSWERING ───────────────── */
  if (phase === "answering") {
    const current = cards[currentIndex];

    return (
      <div style={styles.page}>
        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.heading}>Interview</h2>
            <span style={styles.counter}>
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          {/* Progress */}
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Question */}
          <div style={styles.questionCard}>
            <p style={styles.questionLabel}>Question</p>
            <h3 style={styles.question}>{current.question}</h3>
          </div>

          {/* Answer */}
          <div style={styles.answerBox}>
            <textarea
              style={styles.textarea}
              placeholder="Type your answer..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {/* Actions */}
          <div style={styles.actions}>
            <span style={styles.meta}>
              {cards.length - currentIndex - 1} left
            </span>

            <button style={styles.primaryBtn} onClick={handleNext}>
              {currentIndex + 1 === cards.length
                ? "Submit"
                : "Next →"}
            </button>
          </div>

          {/* Dots */}
          <div style={styles.dots}>
            {cards.map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  background:
                    i < currentIndex
                      ? "#6c63ff"
                      : i === currentIndex
                      ? "#a78bfa"
                      : "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────── RESULTS ───────────────── */
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>Results</h1>

        <div style={styles.resultCard}>
          <h2 style={styles.score}>{results.average}%</h2>
          <p style={styles.subtitle}>{results.message}</p>
        </div>

        <div style={styles.actions}>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>

          <button
            style={styles.primaryBtn}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── STYLES ───────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
    padding: "20px",
    color: "white",
  },

  container: {
    width: "100%",
    maxWidth: "650px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
    backdropFilter: "blur(12px)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    margin: "20px 0",
  },

  info: {
    background: "rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#6c63ff",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    marginTop: "10px",
    cursor: "pointer",
  },

  secondaryBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #475569",
    borderRadius: "10px",
    color: "#cbd5e1",
    marginTop: "10px",
    cursor: "pointer",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  heading: { fontSize: "20px" },

  counter: {
    background: "#6c63ff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  progressBar: {
    height: "6px",
    background: "#1f2937",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  progressFill: {
    height: "100%",
    background: "#6c63ff",
    borderRadius: "10px",
  },

  questionCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  questionLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "5px",
  },

  question: {
    fontSize: "18px",
    lineHeight: "1.5",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  meta: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    marginTop: "15px",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },

  loader: {
    fontSize: "18px",
    color: "#cbd5e1",
  },

  resultCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center",
  },

  score: {
    fontSize: "40px",
    color: "#6c63ff",
  },

  error: {
    color: "#f87171",
    marginTop: "10px",
  },
};

export default InterviewMode;