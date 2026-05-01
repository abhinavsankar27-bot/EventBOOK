import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") || "";
  const isLoggedIn = !!localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  // Don't show nav links on the landing login page
  const isLanding = location.pathname === "/";

  return (
    <nav className="navbar">
      <span className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        Event<span>BOOK</span>
      </span>

      <div className="navbar-links">
        {!isLanding && !isLoggedIn && (
          <>
            <a onClick={() => navigate("/")}>Login</a>
            <a onClick={() => navigate("/register")}>Register</a>
          </>
        )}

        {isLoggedIn && role === "user" && (
          <a onClick={() => navigate("/events")}>Events</a>
        )}
        {isLoggedIn && role === "organizer" && (
          <>
            <a onClick={() => navigate("/organizer")}>Dashboard</a>
            <a onClick={() => navigate("/create-event")}>Create</a>
            <a onClick={() => navigate("/bookings")}>Bookings</a>
          </>
        )}
        {isLoggedIn && role === "admin" && (
          <a onClick={() => navigate("/admin")}>Admin</a>
        )}
        {isLoggedIn && (
          <button className="btn-outline" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;