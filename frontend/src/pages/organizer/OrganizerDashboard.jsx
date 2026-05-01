import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function OrganizerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("role") || "Organizer";

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-header">
        <span className="section-label">★ Control Center</span>
        <h1>Organizer <span>Dashboard</span></h1>
        <p>Manage your events and track bookings from one place.</p>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-cards">
          <div
            id="dash-create-event"
            className="dash-card accent-red"
            onClick={() => navigate("/create-event")}
          >
            <div className="dash-card-icon">🎪</div>
            <h3>Create Event</h3>
            <p>Launch a new event — set the stage, define the date, and open bookings to the world.</p>
          </div>

          <div
            id="dash-view-bookings"
            className="dash-card accent-blue"
            onClick={() => navigate("/bookings")}
          >
            <div className="dash-card-icon">🎟</div>
            <h3>View Bookings</h3>
            <p>See who booked your events. Monitor attendees and ticket counts in real time.</p>
          </div>

          <div
            id="dash-browse-events"
            className="dash-card"
            onClick={() => navigate("/events")}
          >
            <div className="dash-card-icon">📋</div>
            <h3>All Events</h3>
            <p>Browse the full events catalogue and manage or delete your published events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;