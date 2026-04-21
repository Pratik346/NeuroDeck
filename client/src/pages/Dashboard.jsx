import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import deckService from "../services/deckService";
import analyticsService from "../services/analyticsServices";
import DeckCard from "../components/DeckCard";
import DeckModal from "../components/DeckModal";
import Skeleton from "../components/Skeleton";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [decksData, analyticsData] = await Promise.all([
        deckService.getDecks(),
        analyticsService.getAnalytics(),
      ]);

      setDecks(decksData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    const newDeck = await deckService.createDeck(formData);
    setDecks([newDeck, ...decks]);
  };

  const handleEdit = (deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    const updated = await deckService.updateDeck(editingDeck._id, formData);
    setDecks(decks.map((d) => (d._id === updated._id ? updated : d)));
    setEditingDeck(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deck and all its cards?")) return;
    await deckService.deleteDeck(id);
    setDecks(decks.filter((d) => d._id !== id));
  };

  const openCreateModal = () => {
    setEditingDeck(null);
    setIsModalOpen(true);
  };

  // LOADING UI (fixed)
  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-6 space-y-10">
  
        {/* HERO */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
  
        {/* PROGRESS BAR */}
        <Skeleton className="h-16 w-full" />
  
        {/* DECKS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">{error}</p>
    );

  // XP LOGIC FIX (IMPORTANT)
  const level = analytics?.level || 1;
  const xp = analytics?.xp || 0;
  const xpRequired = level * 100;
  const xpProgress = (xp / xpRequired) * 100;

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white px-6 pb-16 space-y-10">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Hi,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              {user?.name}
            </span>
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            Your smart AI-powered learning dashboard
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition px-6 py-3 rounded-xl shadow-xl font-semibold"
        >
          Create Deck
        </button>
      </motion.div>
      {decks.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-wrap gap-4"
  >
    <button
      onClick={() => navigate(`/study/${decks[0]._id}`)}
      className="bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
    >
      Continue Study
    </button>

    <button
      onClick={() => navigate("/interview")}
      className="bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
    >
       Start Interview
    </button>

    <button
      onClick={() => navigate("/analytics")}
      className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl shadow-lg transition hover:scale-105 active:scale-95"
    >
       Review Weak Topics
    </button>
  </motion.div>
)}

      {/* STATS */}
      {analytics && (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
    {[
      { label: "Accuracy", value: `${analytics.accuracy}%`, icon: "📊", highlight: true },
      { label: "Total XP", value: analytics.totalXP, icon: "⭐", highlight: true },
      { label: "Streak", value: analytics.streak, icon: "🔥" },
      { label: "Cards Studied", value: analytics.totalCardsStudied, icon: "📅" },
      { label: "Level", value: analytics.level, icon: "🎯" },
      { label: "Badges", value: analytics.badges.length, icon: "🏆" },
    ].map((stat, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.08, y: -5 }}
        whileTap={{ scale: 0.97 }}
        className={`
          rounded-2xl p-6 text-center shadow-lg transition border backdrop-blur-xl
          ${
            stat.highlight
              ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/40 scale-105"
              : "bg-white/5 hover:bg-white/10 border-white/10"
          }
        `}
      >
        <div className={`mb-2 ${stat.highlight ? "text-4xl" : "text-3xl"}`}>
          {stat.icon}
        </div>

        <div
          className={`${
            stat.highlight
              ? "text-3xl font-extrabold"
              : "text-2xl font-bold"
          }`}
        >
          {stat.value}
        </div>

        <div className="text-sm text-gray-400">{stat.label}</div>
      </motion.div>
    ))}
  </div>
)}

      {/* FIXED PROGRESS BAR */}
      {analytics && (
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Level {level} → {level + 1}</span>
            <span>
              {xp} / {xpRequired} XP
            </span>
          </div>

          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${xpProgress}%`,
              }}
            />
          </div>

          {/* Optional improvement */}
          <p className="text-xs text-gray-400 mt-2">
            {xpRequired - xp} XP to next level
          </p>
        </div>
      )}

      {/* WEAK TOPICS */}
      {analytics?.weakTopics?.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-400/30 shadow-lg">
          <p className="text-red-400 font-semibold mb-3 text-lg">
            Focus Needed
          </p>
          <div className="flex flex-wrap gap-3">
  {analytics.weakTopics.map((topic, i) => {
    const deck = decks.find(
      (d) => d.title.toLowerCase() === topic.toLowerCase()
    );

    return (
      <span
        key={i}
        onClick={() => {
          if (deck) {
            navigate(`/study/${deck._id}`);
          }
        }}
        className="bg-red-400/20 px-4 py-1 rounded-full text-sm cursor-pointer hover:scale-110 hover:bg-red-400/30 transition"
      >
        {topic}
      </span>
    );
  })}
</div>
        </div>
      )}

      {/* DECKS */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Decks</h2>

        {decks.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-4 text-lg">
              No decks yet
            </p>

            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Create Your First Deck
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {decks.map((deck) => (
              <motion.div key={deck._id} whileHover={{ y: -8 }}>
                <DeckCard
                  deck={deck}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <DeckModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeck(null);
        }}
        onSubmit={editingDeck ? handleUpdate : handleCreate}
        editingDeck={editingDeck}
      />
    </div>
  );
};

export default Dashboard;