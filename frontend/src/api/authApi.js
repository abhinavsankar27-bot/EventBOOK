import API from "./axios";

// Register user
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    return res;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (data) => {
  try {
    const res = await API.post("/forgot-password", data);
    return res;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error;
  }
};