import API from "./axios";

// ===============================
// GET ALL EVENTS
// ===============================
export const getEvents = async (role = null, user_id = null) => {
  try {
    let url = "/events";
    if (role && user_id) {
      url += `?role=${role}&user_id=${user_id}`;
    }
    const res = await API.get(url);
    return res;
  } catch (error) {
    console.error("Get Events Error:", error);
    throw error;
  }
};

// ===============================
// GET SINGLE EVENT (optional - if backend supports)
// ===============================
export const getEvent = async (id) => {
  try {
    const res = await API.get(`/events/${id}`);
    return res;
  } catch (error) {
    console.error("Get Event Error:", error);
    throw error;
  }
};

// ===============================
// CREATE EVENT (Organizer)
// ===============================
export const createEvent = async (data) => {
  try {
    const res = await API.post("/events", data);
    return res;
  } catch (error) {
    console.error("Create Event Error:", error);
    throw error;
  }
};

// ===============================
// UPDATE EVENT (if backend exists)
// ===============================
export const updateEvent = async (id, data) => {
  try {
    const res = await API.put(`/events/${id}`, data);
    return res;
  } catch (error) {
    console.error("Update Event Error:", error);
    throw error;
  }
};

// ===============================
// DELETE EVENT (Organizer only)
// ===============================
export const deleteEvent = async (id, organizer_id) => {
  try {
    const res = await API.delete(`/events/${id}`, {
      data: { organizer_id }   // ✅ REQUIRED for your backend
    });
    return res;
  } catch (error) {
    console.error("Delete Event Error:", error);
    throw error;
  }
};