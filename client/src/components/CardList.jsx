import { useState } from "react";
import FlashCard from "./FlashCard";
import cardService from "../services/cardService.js";

const CardList = ({ cards, setCards, deckId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const [newCard, setNewCard] = useState({ question: "", answer: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    await cardService.deleteCard(id);
    setCards(cards.filter((c) => c._id !== id));
  };

  //  ADD
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.question || !newCard.answer) {
      return setError("Both question and answer are required");
    }

    setLoading(true);
    try {
      const card = await cardService.addCard(deckId, newCard);
      setCards([...cards, card]);
      setNewCard({ question: "", answer: "" });
      setShowAddForm(false);
      setError("");
    } catch (err) {
      setError("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  //  EDIT SAVE
  const handleEditSave = async () => {
    try {
      const updated = await cardService.updateCard(
        editingCard._id,
        editingCard
      );

      setCards(
        cards.map((c) => (c._id === updated._id ? updated : c))
      );

      setEditingCard(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
           {cards.length} Cards
        </h2>

        <button
          style={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "✕ Cancel" : "+ Add Card"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div style={styles.glassBox}>
          {error && <p style={styles.error}>{error}</p>}

          <textarea
            style={styles.input}
            placeholder="Question..."
            value={newCard.question}
            onChange={(e) =>
              setNewCard({ ...newCard, question: e.target.value })
            }
          />
          <textarea
            style={styles.input}
            placeholder="Answer..."
            value={newCard.answer}
            onChange={(e) =>
              setNewCard({ ...newCard, answer: e.target.value })
            }
          />

          <button
            style={styles.primaryBtn}
            onClick={handleAddCard}
          >
            {loading ? "Adding..." : "Add Card"}
          </button>
        </div>
      )}

{cards.length === 0 ? (
  <div style={styles.emptyContainer}>
    <div style={styles.emptyCard}>
      <h2 style={styles.emptyTitle}>No Cards Yet 📭</h2>

      <p style={styles.emptyText}>
        Start building your deck by adding your first flashcard.
      </p>

      <button
        style={styles.emptyBtn}
        onClick={() => setShowAddForm(true)}
      >
        + Add Your First Card
      </button>
    </div>
  </div>
) : (
  <div style={styles.grid}>
    {cards.map((card) => (
      <div key={card._id} style={{ position: "relative" }}>
        
        {/* Edit button */}
        <button
          style={styles.editBtn}
          onClick={() => setEditingCard(card)}
        >
          
        </button>

        <FlashCard
          card={card}
          onDelete={handleDelete}
        />
      </div>
    ))}
  </div>
)}

      {/*  EDIT MODAL */}
      {editingCard && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Card</h3>

            <textarea
              style={styles.input}
              value={editingCard.question}
              onChange={(e) =>
                setEditingCard({
                  ...editingCard,
                  question: e.target.value,
                })
              }
            />

            <textarea
              style={styles.input}
              value={editingCard.answer}
              onChange={(e) =>
                setEditingCard({
                  ...editingCard,
                  answer: e.target.value,
                })
              }
            />

            <div style={styles.modalActions}>
              <button
                style={styles.primaryBtn}
                onClick={handleEditSave}
              >
                Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setEditingCard(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },
  emptyContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "60px",
  },
  
  emptyCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },
  
  emptyTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    fontWeight: "600",
  },
  
  emptyText: {
    opacity: 0.7,
    marginBottom: "20px",
  },
  
  emptyBtn: {
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "500",
  },

  addBtn: {
    background: "rgba(56,161,105,0.3)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  glassBox: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  primaryBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },

  empty: {
    textAlign: "center",
    opacity: 0.6,
  },

  error: {
    color: "#f87171",
  },

  editBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "8px",
    padding: "5px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "20px",
    borderRadius: "16px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between",
  },
};

export default CardList;