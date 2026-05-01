import { Routes, Route } from "react-router-dom";

// Landing & Auth
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

// User
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import BookEvent from "../pages/BookEvent";

// Organizer
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import CreateEvent from "../pages/organizer/CreateEvent";
import Bookings from "../pages/organizer/Bookings";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Landing (Login) — Navbar is embedded inside Landing */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User */}
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/book" element={<BookEvent />} />

      {/* Organizer */}
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/bookings" element={<Bookings />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default AppRoutes;