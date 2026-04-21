import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DeckCard = ({ deck, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition duration-300 blur-xl"></div>

      {/* Top Section */}
      <div className="flex justify-between items-center mb-2 relative z-10">
        <h3 className="text-lg font-semibold text-white tracking-wide">
          {deck.title}
        </h3>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium">
          {deck.totalCards} cards
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/70 mb-2 line-clamp-2 relative z-10">
        {deck.description || "No description provided"}
      </p>

      {/* Date */}
      <p className="text-xs text-white/50 mb-4 relative z-10">
        Created {new Date(deck.createdAt).toLocaleDateString()}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {/* Study */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/study/${deck._id}`)}
          className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow hover:opacity-90"
        >
           Study
        </motion.button>

        {/* Add Cards */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/upload/${deck._id}`)}
          className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-medium shadow hover:opacity-90"
        >
           Add
        </motion.button>

        {/* Edit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(deck)}
          className="px-3 py-2 rounded-xl bg-yellow-400/90 text-white text-sm shadow hover:bg-yellow-400"
        >
          Edit
        </motion.button>

        {/* Delete */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(deck._id)}
          className="px-3 py-2 rounded-xl bg-red-500/90 text-white text-sm shadow hover:bg-red-500"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeckCard;