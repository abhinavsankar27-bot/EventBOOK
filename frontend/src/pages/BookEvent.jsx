import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookEvent } from "../api/bookingApi";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";

function BookEvent() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      showAlert("Please login to book an event", "error");
      navigate("/");
    }
  }, [userId, navigate, showAlert]);

  const [form, setForm] = useState({
    user_id: userId || "",
    event_id: state?.id || state?.eventId || "",
    ticket_id: Math.random().toString(36).substring(2, 8).toUpperCase()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await bookEvent(form);
      if (res.data.message === "Booking successful") {
        showAlert("Booking successful", "success");
        navigate("/events");
      } else {
        showAlert(res.data.message, "info");
      }
    } catch (err) {
      showAlert(err.response?.data?.message || "Booking failed", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--beige)", paddingTop: "70px" }}>
      <Navbar />

      <div className="book-page" style={{ paddingTop: "40px" }}>
        <div className="book-box">
          <span className="section-label">★ Secure Your Spot</span>
          <h1>Confirm Booking</h1>
          <p className="subtitle">Fill in your details to complete the booking.</p>

          <div className="info-pill">
            <span>Event ID</span>
            <span>#{form.event_id || "—"}</span>
          </div>
          <div className="info-pill">
            <span>Ticket ID</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--red)" }}>{form.ticket_id}</span>
          </div>

          <form onSubmit={handleSubmit} id="book-form" style={{ marginTop: 20 }}>
            <div className="form-group">
              <label htmlFor="book-userid">User ID</label>
              <input
                id="book-userid"
                value={form.user_id}
                disabled
                style={{ background: "var(--beige)", cursor: "not-allowed", color: "var(--charcoal)" }}
              />
            </div>

            <button id="book-submit" type="submit" className="btn-primary" style={{ marginTop: 8 }}>
              Confirm Booking →
            </button>
          </form>

          <button
            className="btn-primary"
            style={{ marginTop: 12, width: "100%", background: "transparent", color: "var(--charcoal)", borderColor: "var(--charcoal)" }}
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookEvent;