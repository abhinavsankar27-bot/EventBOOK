import axios from "axios";

const API_URL = "http://127.0.0.1:5000/admin";

export const getSystemStats = async () => {
  return await axios.get(`${API_URL}/stats`);
};

export const getAllUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const deleteUser = async (userId) => {
  return await axios.delete(`${API_URL}/users/${userId}`);
};
