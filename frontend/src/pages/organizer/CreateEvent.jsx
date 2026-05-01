import { useState } from "react";
import { createEvent } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAlert } from "../../context/AlertContext";

function CreateEvent() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "", seats: "", organizer_id: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      showAlert("Please fill all required fields", "info");
      return;
    }
    try {
      setLoading(true);
      const payload = { ...form, seats: Number(form.seats), organizer_id: form.organizer_id };
      const res = await createEvent(payload);
      showAlert(res.data.message || "Event created successfully", "success");
      setForm({ title: "", description: "", date: "", location: "", seats: "", organizer_id: "" });
      navigate("/organizer");
    } catch (error) {
      console.error("ERROR:", error.response || error);
      showAlert(error.response?.data?.message || "Failed to create event", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "title",        label: "Event Title *",    placeholder: "e.g. Jazz Night at The Forum",     type: "text" },
    { name: "description",  label: "Description",       placeholder: "Describe the event...",            type: "text" },
    { name: "date",         label: "Event Date *",      placeholder: "",                                 type: "date" },
    { name: "location",     label: "Location *",        placeholder: "e.g. Madison Square Garden, NY",  type: "text" },
    { name: "seats",        label: "Available Seats",   placeholder: "e.g. 500",                        type: "number" },
    { name: "organizer_id", label: "Organizer ID",      placeholder: "Your organizer ID",               type: "text" },
  ];

  return (
    <div className="create-page">
      <Navbar />
      <div className="create-inner">
        <span className="section-label">★ New Event</span>
        <h1>Create Event</h1>

        <form id="create-event-form" onSubmit={handleSubmit} className="create-form">
          {fields.map(f => (
            <div className="form-group" key={f.name}>
              <label htmlFor={`field-${f.name}`}>{f.label}</label>
              <input
                id={`field-${f.name}`}
                name={f.name}
                type={f.type}
                value={form[f.name]}
                placeholder={f.placeholder}
                onChange={handleChange}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button id="create-submit" type="submit" className="btn-primary" style={{ width: "auto" }} disabled={loading}>
              {loading ? "Creating..." : "Create Event →"}
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "auto", background: "transparent", color: "var(--charcoal)", borderColor: "var(--charcoal)" }}
              onClick={() => navigate("/organizer")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;