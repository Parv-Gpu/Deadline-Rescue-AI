import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const analyzeDeadline = async (userInput) => {
  const response = await axios.post(`${API_BASE_URL}/deadline-rescue-fast`, {
    user_input: userInput,
  });

  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};

export const getHistoryById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/history/${id}`);
  return response.data;
};