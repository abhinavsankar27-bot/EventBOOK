import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { forgotPassword } from "../api/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showAlert("Please enter your email", "info");
      return;
    }
    
    try {
      const res = await forgotPassword({ email });
      if (res.data.reset_link) {
        showAlert(`Password reset link: ${res.data.reset_link}`, "success");
        setTimeout(() => navigate("/"), 4000); // Wait a bit so user can copy the link
      } else {
        showAlert(res.data.message || "Request sent", "success");
      }
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to generate reset link", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <span className="section-label">★ Account Recovery</span>
        <h1>Forgot Password</h1>
        <p className="subtitle">Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} id="forgot-password-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>

          <button id="reset-submit" type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Send Reset Link →
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: 20 }}>
          <span>Remember your password?</span>
          <button type="button" className="link-btn" onClick={() => navigate("/")}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
