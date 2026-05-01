import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      // ✅ ADD YOUR ROLE LOGIC HERE
      if (res.data.message === "Login successful") {

  // ✅ get from backend (must be returned)
  const role = res.data.role;
  const user_id = res.data.user_id;

  // store in localStorage
  localStorage.setItem("role", role);
  localStorage.setItem("user_id", user_id);

  showAlert("Login successful!", "success");

  // redirect
  if (role === "admin") navigate("/admin");
  else if (role === "organizer") navigate("/organizer");
  else navigate("/");
} else {
        showAlert("Invalid credentials", "error");
      }

    } catch (error) {
      console.error(error);
      showAlert(error.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Login</button>
    </form>
  );
}

export default Login;