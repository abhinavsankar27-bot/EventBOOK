import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getSystemStats, getAllUsers, deleteUser } from "../../api/adminApi";
import { useAlert } from "../../context/AlertContext";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, events: 0, bookings: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert, showConfirm } = useAlert();

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        getSystemStats(),
        getAllUsers()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      showAlert("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteUser = (userId) => {
    showConfirm("Are you sure you want to delete this user? All their bookings will also be deleted.", async () => {
      try {
        await deleteUser(userId);
        showAlert("User deleted successfully", "success");
        // Optimistic UI update
        setUsers(users.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, users: prev.users - 1 }));
      } catch (error) {
        showAlert(error.response?.data?.message || "Failed to delete user", "error");
      }
    });
  };

  if (loading) return <div className="state-box" style={{ paddingTop: 100 }}>Loading system data...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--charcoal)", paddingBottom: 60 }}>
      <Navbar />
      <div className="admin-page" style={{ paddingTop: "70px", alignItems: "flex-start" }}>
        <div className="admin-inner" style={{ width: "100%", maxWidth: 1000, margin: "0 auto", textAlign: "left" }}>
          <div className="admin-badge">⚙ System Control</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>Admin <span>Dashboard</span></h1>
          <p style={{ margin: "0", maxWidth: "600px" }}>Full system oversight. Manage users, events, and platform configuration.</p>

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            <div style={{
              background: "var(--red)", border: "4px solid var(--yellow)",
              boxShadow: "6px 6px 0 var(--yellow)", padding: "28px 32px"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>👥</div>
              <h3 style={{ color: "var(--white)", fontSize: "1.2rem", marginBottom: 8 }}>{stats.users} Users</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.4 }}>Total registered accounts across all roles.</p>
            </div>

            <div style={{
              background: "var(--blue)", border: "4px solid var(--charcoal)",
              boxShadow: "6px 6px 0 rgba(0,0,0,0.4)", padding: "28px 32px"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>🎟</div>
              <h3 style={{ color: "var(--white)", fontSize: "1.2rem", marginBottom: 8 }}>{stats.events} Events</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", lineHeight: 1.4 }}>Active events created by organizers.</p>
            </div>

            <div style={{
              background: "var(--yellow)", border: "4px solid var(--charcoal)",
              boxShadow: "6px 6px 0 rgba(0,0,0,0.4)", padding: "28px 32px"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>✅</div>
              <h3 style={{ color: "var(--charcoal)", fontSize: "1.2rem", marginBottom: 8 }}>{stats.bookings} Bookings</h3>
              <p style={{ color: "var(--charcoal)", opacity: 0.8, fontSize: "0.85rem", lineHeight: 1.4 }}>Total tickets secured by users.</p>
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.8rem", color: "var(--white)", marginBottom: 20 }}>User Directory</h2>
            <div style={{ background: "var(--beige)", border: "4px solid var(--charcoal)", boxShadow: "8px 8px 0 var(--charcoal)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "16px 24px", background: "var(--charcoal)", color: "var(--white)", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <span>ID</span>
                <span>Name / Email</span>
                <span>Role</span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>
              {users.map(u => (
                <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "16px 24px", borderBottom: "2px solid rgba(0,0,0,0.1)", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--red)" }}>{u.id}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--charcoal)" }}>{u.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, padding: "4px 8px", background: "rgba(0,0,0,0.05)", display: "inline-block", width: "max-content" }}>{u.role}</span>
                  <div style={{ textAlign: "right" }}>
                    <button 
                      className="btn-sm danger" 
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.role === "admin"}
                      style={{ opacity: u.role === "admin" ? 0.3 : 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;