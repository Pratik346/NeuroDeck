import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const CARDS_URL = `${import.meta.env.VITE_API_URL}/api/cards`;
const GAMIFICATION_URL = `${import.meta.env.VITE_API_URL}/api/gamification`;
// Update card difficulty after review
const updateCardDifficulty = async (cardId, difficulty) => {
  const response = await axios.patch(
    `${CARDS_URL}/review/${cardId}`,
    { difficulty },
    { headers: getAuthHeader() }
  );
  return response.data;
};
// Update gamification after each card
const updateProgress = async () => {
  const response = await axios.post(
    `${GAMIFICATION_URL}/update`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

const studyService = { updateCardDifficulty, updateProgress };
export default studyService;