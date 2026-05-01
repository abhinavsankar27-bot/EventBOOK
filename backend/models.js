import mongoose from "mongoose";

// =======================
// User Model
// =======================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["admin", "organizer", "user"] },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// =======================
// Event Model
// =======================
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  seats: { type: Number },
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number },
  category: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", eventSchema);

// =======================
// Booking Model
// =======================
const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  ticket_id: { type: String, required: true, unique: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: "confirmed" }
});

const Booking = mongoose.model("Booking", bookingSchema);

export { User, Event, Booking };
