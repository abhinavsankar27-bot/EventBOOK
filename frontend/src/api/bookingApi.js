import API from "./axios";

// Get all bookings
export const getBookings = async (organizer_id = null) => {
  try {
    let url = "/bookings";
    if (organizer_id) {
      url += `?organizer_id=${organizer_id}`;
    }
    const res = await API.get(url);
    return res;
  } catch (error) {
    console.error("Get Bookings Error:", error);
    throw error;
  }
};

// Book event
export const bookEvent = async (data) => {
  try {
    const res = await API.post("/book", data);
    return res;
  } catch (error) {
    console.error("Booking Error:", error);
    throw error;
  }
};