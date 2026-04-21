import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const API_URL = `${import.meta.env.VITE_API_URL}/api/interview`;
const startInterview = async () => {
  try {
    const response = await axios.get(`${API_URL}/start`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to start interview";
  }
};
// answers = [{ cardId, userAnswer }]
const submitInterview = async (answers) => {
  try {
    const response = await axios.post(
      `${API_URL}/submit`,
      { answers },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to submit interview";
  }
};
export default {
  startInterview,
  submitInterview,
};