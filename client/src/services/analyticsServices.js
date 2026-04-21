import axios from "axios";
import { getAuthHeader } from "./authServices.js";
const API_URL = `${import.meta.env.VITE_API_URL}/api/analytics`;
const getAnalytics = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};
export default { getAnalytics };