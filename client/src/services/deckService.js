import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const API_URL = `${import.meta.env.VITE_API_URL}/api/decks`;
const getDecks = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const getDeckById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const createDeck = async (deckData) => {
  const response = await axios.post(API_URL, deckData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const updateDeck = async (id, deckData) => {
  const response = await axios.put(`${API_URL}/${id}`, deckData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const deleteDeck = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

const deckService = { getDecks, getDeckById, createDeck, updateDeck, deleteDeck };
export default deckService;