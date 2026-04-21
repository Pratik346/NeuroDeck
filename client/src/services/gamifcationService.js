import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const API_URL = `${import.meta.env.VITE_API_URL}/api/gamification`;
const updateProgress = async () => {
  const response = await axios.post(
    `${API_URL}/update`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};
export default { updateProgress };