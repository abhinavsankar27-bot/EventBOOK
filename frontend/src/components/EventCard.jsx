import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

function EventCard({ event, onDelete }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const role = localStorage.getItem("role") || "";

  if (!event) return null;

  // Generate initials for placeholder
  const initials = (event.title || "EV").split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <div className="event-card">
      {event.image_url ? (
        <img src={event.image_url} alt={event.title} className="event-card-img" />
      ) : (
        <div className="event-card-img-placeholder">{initials}</div>
      )}

      <div className="event-card-body">
        <span className="event-card-tag">✦ {event.location || "Venue TBA"}</span>
        <h3>{event.title}</h3>
        {event.date && (
          <p>❖ {new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        )}
        {event.seats != null && (
          <p style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.8rem", marginBottom: 16 }}>
            {event.seats} SEATS AVAILABLE
          </p>
        )}

        <div className="event-card-actions">
          <button className="btn-sm" onClick={() => navigate(`/events/${event?.id}`)}>
            View Details
          </button>
          <button
            className="btn-sm outline"
            onClick={() => {
              if (!localStorage.getItem("user_id")) {
                showAlert("Please login to book an event", "error");
                navigate("/");
              } else {
                navigate("/book", { state: { eventId: event.id } });
              }
            }}
          >
            Book Now
          </button>
          {role === "organizer" && onDelete && (
            <button className="btn-sm danger" onClick={() => onDelete(event.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;