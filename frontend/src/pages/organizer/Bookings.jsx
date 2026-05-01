import { useEffect, useState } from "react";
import { getBookings } from "../../api/bookingApi";
import Navbar from "../../components/Navbar";

function Bookings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    let organizer_id = null;
    if (role === "organizer") {
      organizer_id = localStorage.getItem("user_id");
    }

    getBookings(organizer_id)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bookings-page">
      <Navbar />

      <div style={{ background: "var(--charcoal)", padding: "50px 6vw", borderBottom: "4px solid var(--charcoal)" }}>
        <span className="section-label" style={{ color: "var(--yellow)" }}>★ Booking Records</span>
        <h1 style={{ color: "var(--white)", fontSize: "clamp(2rem,5vw,4rem)" }}>
          All <span style={{ color: "var(--yellow)" }}>Bookings</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
          {data.length} booking{data.length !== 1 ? "s" : ""} found.
        </p>
      </div>

      <div className="bookings-inner">
        {loading && <div className="state-box">Loading bookings...</div>}
        {!loading && data.length === 0 && <div className="state-box">No bookings yet.</div>}

        {data.map(b => (
          <div className="booking-row" key={b.id}>
            <div>
              <strong>{b.user_name || "Unknown User"}</strong>
              <div style={{ fontSize: "0.82rem", color: "#666", marginTop: 2 }}>
                booked <em style={{ fontStyle: "normal", fontWeight: 600, color: "var(--red)" }}>{b.event_name}</em>
              </div>
            </div>
            <span style={{ background: "var(--yellow)", border: "2px solid var(--charcoal)", padding: "4px 12px", fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>
              #{b.ticket_id || b.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;