import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

const TICKER_ITEMS = ["Live Music", "Art Exhibitions", "Tech Conferences", "Food Festivals", "Sports Events", "Workshops", "Comedy Shows", "Film Screenings"];

function Landing() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { showAlert("Please fill all fields", "info"); return; }
    try {
      const res = await loginUser(form);
      if (res.data.message === "Login successful") {
        const { role, user_id } = res.data;
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", user_id);
        showAlert("Login successful!", "success");
        if (role === "admin") navigate("/admin");
        else if (role === "organizer") navigate("/organizer");
        else navigate("/events");
      } else {
        showAlert(res.data.message, "error");
      }
    } catch (error) {
      showAlert(error.response?.data?.message || "Login failed", "error");
    }
  };

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* Ticker */}
      <div className="ticker" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1001 }}>
        <div className="ticker-track">
          {tickerContent.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      <div className="hero" style={{ paddingTop: "48px" }}>
        <div className="hero-watermark">EVENTS</div>

        <div className="hero-inner">
          {/* Left: Headline */}
          <div className="hero-text">
            <span className="label">★ Your Next Experience Awaits</span>
            <h1>Discover<br /><span>Bold</span><br />Events.</h1>
            <p>Book unforgettable experiences — concerts, exhibitions, conferences and more. Brutally simple. Endlessly exciting.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ width: "auto", background: "var(--yellow)", color: "var(--charcoal)", borderColor: "var(--charcoal)" }}
                onClick={() => navigate("/register")}>
                Get Started →
              </button>
              <button className="btn-primary" style={{ width: "auto", background: "transparent", borderColor: "rgba(255,255,255,0.5)", color: "var(--white)" }}
                onClick={() => navigate("/events")}>
                Browse Events
              </button>
            </div>
          </div>

          {/* Right: Login Card */}
          <form className="login-card" onSubmit={handleSubmit} id="login-form">
            <h2>Sign In</h2>

            <label className="field-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
              required
            />

            <label className="field-label">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value.trim() })}
              required
            />

            <div className="forgot-row">
              <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
            </div>

            <button id="login-submit" type="submit" className="btn-primary">Login →</button>

            <div className="login-footer">
              <span>No account?</span>
              <button type="button" className="link-btn" onClick={() => navigate("/register")}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Landing;