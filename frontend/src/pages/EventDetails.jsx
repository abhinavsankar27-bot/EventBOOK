import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvents } from "../api/eventApi";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvents().then(res => {
      const found = res.data.find(e => e.id == id);
      setEvent(found);
    });
  }, [id]);

  if (!event) return (
    <div className="detail-page">
      <Navbar />
      <div className="state-box" style={{ paddingTop: "120px" }}>Loading event...</div>
    </div>
  );

  const initials = (event.title || "EV").split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <div className="detail-page">
      <Navbar />

      <div className="detail-hero">
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="detail-badge">Event Details</div>
          <h1>{event.title}</h1>
          <div className="detail-meta" style={{ marginTop: 24 }}>
            {event.location && (
              <div className="detail-meta-item">
                <span className="detail-meta-icon">✦</span>
                <span>{event.location}</span>
              </div>
            )}
            {event.date && (
              <div className="detail-meta-item">
                <span className="detail-meta-icon">❖</span>
                <span>{new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            )}
            {event.seats != null && (
              <div className="detail-meta-item">
                <span className="detail-meta-icon">✱</span>
                <span>{event.seats} seats available</span>
              </div>
            )}
          </div>
        </div>

        {/* Offset visual */}
        <div style={{ position: "relative", flexShrink: 0, width: 220, height: 220, alignSelf: "center" }}>
          <div style={{ position: "absolute", top: 12, left: 12, width: "100%", height: "100%", background: "var(--yellow)", border: "4px solid var(--charcoal)" }} />
          <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--red)", border: "4px solid var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {event.image_url ? (
              <img src={event.image_url} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
            ) : (
              <span style={{ fontFamily: "var(--font-head)", fontSize: "5rem", fontWeight: 900, color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>{initials}</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">
        {event.description && <p>{event.description}</p>}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            id="book-event-btn"
            className="btn-primary"
            style={{ width: "auto" }}
            onClick={() => {
              if (!localStorage.getItem("user_id")) {
                showAlert("Please login to book an event", "error");
                navigate("/");
              } else {
                navigate("/book", { state: event });
              }
            }}
          >
            Book This Event →
          </button>
          <button
            className="btn-primary"
            style={{ width: "auto", background: "transparent", color: "var(--charcoal)", borderColor: "var(--charcoal)" }}
            onClick={() => navigate("/events")}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;