import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../services/analyticsServices.js";
import useAuth from "../hooks/useAuth";
import Skeleton from "../components/Skeleton.jsx";
import XPChart from "../components/XPChart";
const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };
  const chartData =
  analytics?.xpHistory?.map((item) => ({
    date: item.date,
    xp: item.xp,
  })) || [];
  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
  
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
  
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (error)
    return <div style={{ ...styles.center, color: "#ff4d4d" }}>{error}</div>;
  // 🎯 Accuracy color
  const accuracyColor =
    analytics.accuracy >= 80
      ? "#22c55e"
      : analytics.accuracy >= 60
      ? "#f59e0b"
      : "#ef4444";

  // 🔥 CORRECT XP LOGIC (based on backend)
  const level = analytics.level || 1;
  const xp = analytics.xp || 0;

  const xpRequired = level * 100;
  const xpProgress = (xp / xpRequired) * 100;
  const xpRemaining = xpRequired - xp;

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
          <p style={styles.subtitle}>
            Keep going{" "}
            <span style={styles.userName}>{user?.name}</span> 🚀
          </p>
        </div>

        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      {/* TOP STATS */}
      <div style={styles.grid}>
        <Stat icon="🔥" label="Streak" value={analytics.streak} />
        <Stat icon="📚" label="Cards Studied" value={analytics.totalCardsStudied} />
        <Stat icon="📅" label="Today Cards" value={analytics.todayCards} />
        <Stat icon="⭐" label="Total XP" value={analytics.totalXP} />
      </div>
      {/* XP GRAPH */}
{chartData.length > 0 && (
  <div style={{ marginBottom: "2rem" }}>
    <XPChart data={chartData} />
  </div>
)}
      {/* MAIN SECTION */}
      <div style={styles.mainGrid}>
        {/* ACCURACY CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎯 Accuracy</h3>

          <div style={styles.centerBox}>
            <div style={{ ...styles.bigNumber, color: accuracyColor }}>
              {analytics.accuracy}%
            </div>
            <p style={styles.muted}>Correct Answers</p>
          </div>

          <div style={styles.bar}>
            <div
              style={{
                ...styles.fill,
                width: `${analytics.accuracy}%`,
                background: accuracyColor,
              }}
            />
          </div>

          <p style={styles.tip}>
            {analytics.accuracy >= 80
              ? "🏆 Excellent performance!"
              : analytics.accuracy >= 60
              ? "👍 Good, keep improving!"
              : "📚 Keep practicing!"}
          </p>
        </div>

        {/*  LEVEL CARD (FIXED) */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🚀 Level Progress</h3>

          <div style={styles.levelRow}>
            <span style={styles.levelText}>
              Level {level} → {level + 1}
            </span>
            <span style={styles.muted}>
              {xp} / {xpRequired} XP
            </span>
          </div>

          <div style={styles.bar}>
            <div
              style={{
                ...styles.fill,
                width: `${xpProgress}%`,
                background:
                  "linear-gradient(90deg,#6366f1,#a855f7)",
              }}
            />
          </div>

          <div style={styles.levelInfo}>
            {xpRemaining} XP to next level
          </div>
        </div>
      </div>

      {/* WEAK TOPICS */}
      <div style={styles.cardFull}>
        <h3 style={styles.cardTitle}>⚠️ Weak Topics</h3>

        {analytics.weakTopics?.length ? (
          <div style={styles.tags}>
            {analytics.weakTopics.map((t, i) => (
              <span key={i} style={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p style={styles.muted}>No weak topics — great job 🎉</p>
        )}
      </div>

      {/* BADGES */}
      <div style={styles.cardFull}>
        <h3 style={styles.cardTitle}>🏆 Badges</h3>

        {analytics.badges?.length ? (
          <div style={styles.tags}>
            {analytics.badges.map((b, i) => (
              <span key={i} style={styles.badge}>
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p style={styles.muted}>No badges yet</p>
        )}
      </div>
    </div>
  );
};

/* ---------- SMALL COMPONENT ---------- */
const Stat = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: "0.3rem",
    fontSize: "1rem",
    color: "rgba(255,255,255,0.7)",
  },

  userName: {
    background: "linear-gradient(90deg,#6366f1,#a855f7,#ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "600",
  },

  backBtn: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  statCard: {
    padding: "1.2rem",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  statIcon: { fontSize: "1.5rem" },
  statValue: { fontSize: "1.4rem", fontWeight: "bold" },
  statLabel: { opacity: 0.6, fontSize: "0.8rem" },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },

  card: {
    padding: "1.5rem",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  cardFull: {
    padding: "1.5rem",
    borderRadius: "18px",
    marginBottom: "1.5rem",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  cardTitle: {
    marginBottom: "1rem",
  },

  centerBox: {
    textAlign: "center",
    marginBottom: "1rem",
  },

  bigNumber: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },

  muted: {
    opacity: 0.6,
    fontSize: "0.85rem",
  },

  bar: {
    height: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: "10px",
    transition: "0.4s",
  },

  tip: {
    marginTop: "0.8rem",
    fontSize: "0.85rem",
    opacity: 0.8,
  },

  levelRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },

  levelText: {
    fontWeight: "bold",
  },

  levelInfo: {
    marginTop: "0.8rem",
    opacity: 0.7,
    fontSize: "0.85rem",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },

  tag: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "linear-gradient(90deg,#fbbf24,#f59e0b)",
    color: "#000",
    fontWeight: "bold",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    color: "white",
  },
};

export default AnalyticsPage;