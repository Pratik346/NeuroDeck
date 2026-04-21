import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const API_URL = `${import.meta.env.VITE_API_URL}/api/cards`;
// Generate cards from PDF/TXT
const generateCards = async (deckId, file, count = 10) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("count", count);
  console.log("deckId:", deckId);       // ✅ check deckId
  console.log("file:", file);           // ✅ check file
  console.log("count:", count);  
  const response = await axios.post(
    `${API_URL}/generate/${deckId}`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
// Get all cards for a deck
const getCardsByDeck = async (deckId) => {
  const response = await axios.get(`${API_URL}/${deckId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
// Manually add a card
const addCard = async (deckId, cardData) => {
  const response = await axios.post(`${API_URL}/${deckId}`, cardData, {
    headers: getAuthHeader(),
  });
  return response.data;
};
// Delete a card
const deleteCard = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
//update a card
const updateCard = async (id, cardData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    cardData,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};
const cardService = { generateCards, getCardsByDeck, addCard, deleteCard,updateCard };
export default cardService;