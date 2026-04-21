import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cardService from "../services/cardService";
import deckService from "../services/deckService";
import CardList from "../components/CardList";

const UploadPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);

  const [file, setFile] = useState(null);
  const [count, setCount] = useState(10);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDeckAndCards();
  }, [deckId]);

  const fetchDeckAndCards = async () => {
    try {
      setFetching(true);

      const [deckData, cardsData] = await Promise.all([
        deckService.getDeckById(deckId),
        cardService.getCardsByDeck(deckId),
      ]);

      setDeck(deckData);
      setCards(cardsData);
    } catch {
      setError("Failed to load deck");
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setFile(selected);
    setError("");
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError("");
    setSuccess("");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 120);

    try {
      const result = await cardService.generateCards(deckId, file, count);

      setProgress(100);
      setCards((prev) => [...prev, ...result.cards]);
      setSuccess(result.message);

      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Failed to generate cards");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  if (fetching) return <p style={styles.center}>Loading...</p>;

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.headerBar}>
        <div style={styles.leftSection}>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <div>
            <h1 style={styles.heading}>{deck?.title}</h1>
            <p style={styles.sub}>{deck?.description}</p>
          </div>
        </div>

        <button
          style={styles.studyBtn}
          disabled={cards.length === 0}
          onClick={() => navigate(`/study/${deckId}`)}
        >
          📖 Study
        </button>
      </div>

      {/* MAIN CARD */}
      <div style={styles.glassBox}>
        <div style={styles.glow}></div>

        <h2 style={styles.title}>⚡ AI Flashcard Generator</h2>
        <p style={styles.subtitle}>
          Upload image → AI generates smart flashcards
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        {/* FILE + COUNT + BUTTON */}
        <div style={styles.row}>
          
          {/* FILE */}
          <label style={styles.fileLabel}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <span style={styles.fileBtn}>
              📎 {file ? file.name : "Choose Image"}
            </span>
          </label>

          {/* 🔥 PREMIUM PILLS */}
          <div style={styles.pillGroup}>
            {[5, 10, 15].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  ...styles.pill,
                  background:
                    count === n
                      ? "linear-gradient(135deg, #6366f1, #a855f7)"
                      : "rgba(255,255,255,0.08)",
                  transform: count === n ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    count === n
                      ? "0 8px 25px rgba(99,102,241,0.4)"
                      : "none",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {/* GENERATE */}
          <button
            style={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!file || loading}
          >
            {loading ? "Generating..." : "🤖 Generate"}
          </button>
        </div>

        {/* PROGRESS */}
        {loading && (
          <div style={styles.progressBox}>
            <div style={styles.progressHeader}>
              <span>AI Processing</span>
              <span>{progress}%</span>
            </div>

            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progress}%`,
                }}
              />
            </div>

            <p style={styles.progressText}>
              Extracting content and generating flashcards...
            </p>
          </div>
        )}
      </div>

      {/* CARDS */}
      <CardList cards={cards} setCards={setCards} deckId={deckId} />
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    marginBottom: "2rem",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.12)",
    position: "sticky",
    top: "10px",
    zIndex: 10,
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  backBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#c7d2fe",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  heading: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "600",
  },

  sub: {
    margin: 0,
    fontSize: "0.85rem",
    opacity: 0.7,
  },

  studyBtn: {
    background: "#6366f1",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  },

  glassBox: {
    position: "relative",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "2rem",
  },

  glow: {
    position: "absolute",
    top: "-50px",
    left: "-50px",
    width: "220px",
    height: "220px",
    background: "#6366f1",
    filter: "blur(120px)",
    opacity: 0.25,
    zIndex: -1,
  },

  title: { margin: 0 },
  subtitle: { opacity: 0.7, marginBottom: "1rem" },

  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  fileLabel: { cursor: "pointer", flex: 2 },

  fileBtn: {
    display: "block",
    padding: "12px",
    borderRadius: "12px",
    border: "1px dashed rgba(255,255,255,0.3)",
    textAlign: "center",
    background: "rgba(255,255,255,0.05)",
  },

  /* 🔥 PILLS UI */
  pillGroup: {
    display: "flex",
    gap: "10px",
    padding: "6px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  pill: {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
  },

  generateBtn: {
    background: "linear-gradient(135deg, #22c55e, #4ade80)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
  },

  progressBox: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    marginBottom: "8px",
    opacity: 0.8,
  },

  progressBarBg: {
    height: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #a855f7)",
    transition: "width 0.3s ease",
  },

  progressText: {
    marginTop: "8px",
    fontSize: "0.85rem",
    opacity: 0.7,
  },

  error: { color: "#f87171" },
  success: { color: "#4ade80" },

  center: { textAlign: "center", marginTop: "3rem" },
};

export default UploadPage;