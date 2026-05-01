import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      if (res.data.message === "User registered successfully") {
        showAlert("User registered successfully", "success");
        navigate("/");
      } else {
        showAlert(res.data.message, "info");
      }
    } catch (err) {
      showAlert(err.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <span className="section-label">★ Join EventBOOK</span>
        <h1>Register</h1>
        <p className="subtitle">Create your account and start booking events.</p>

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              placeholder="John Doe"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-role">Account Type</label>
            <select
              id="reg-role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User — Browse & Book Events</option>
              <option value="organizer">Organizer — Create Events</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button id="reg-submit" type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Create Account →
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: 20 }}>
          <span>Already have an account?</span>
          <button type="button" className="link-btn" onClick={() => navigate("/")}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default Register;