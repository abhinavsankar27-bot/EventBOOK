import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/eventApi";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";

const TICKER_ITEMS = ["Live Music", "Art Exhibitions", "Tech Conferences", "Food Festivals", "Sports Events", "Workshops", "Comedy Shows", "Film Screenings"];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");

    getEvents(role, user_id)
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this event?", async () => {
      try {
        const organizer_id = localStorage.getItem("user_id");
        const res = await deleteEvent(id, organizer_id);
        showAlert(res.data.message, "success");
        setEvents(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error(error);
        showAlert(error.response?.data?.message || "Delete failed", "error");
      }
    });
  };

  const filteredEvents = events.filter(e => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (e.title || "").toLowerCase().includes(query);
    const locMatch = (e.location || "").toLowerCase().includes(query);
    return titleMatch || locMatch;
  });

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="events-page">
      <Navbar />

      {/* Ticker */}
      <div className="ticker" style={{ marginTop: "70px" }}>
        <div className="ticker-track">
          {tickerContent.map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
        </div>
      </div>

      {/* Header */}
      <div className="events-header" style={{ paddingBottom: "30px" }}>
        <div className="events-header-wm">EVENTS</div>
        <h1>All <span>Events</span></h1>
        <p>Discover experiences worth leaving your house for.</p>

        {/* Search Bar */}
        <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", width: "100%", maxWidth: "600px", margin: "40px auto 0" }}>
          <input 
            type="text" 
            placeholder="Search by event name or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 24px",
              fontSize: "1.1rem",
              fontFamily: "var(--font-body)",
              border: "4px solid var(--charcoal)",
              boxShadow: "6px 6px 0 var(--red)",
              background: "var(--white)",
              color: "var(--charcoal)",
              outline: "none",
              fontWeight: "700"
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="events-body">
        {loading && <div className="state-box">Loading events...</div>}
        {!loading && filteredEvents.length === 0 && <div className="state-box">No events found matching your search.</div>}
        <div className="event-grid">
          {filteredEvents.map(e => (
            <EventCard key={e.id} event={e} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;