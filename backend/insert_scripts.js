// Run this in MongoDB Shell (mongosh) or MongoDB Compass:
// use event_booking

db.users.insertMany([
  {
    name: "Zio",
    email: "zio@test.com",
    password: "123456", // Stored as plain text per prompt instructions
    role: "user"
  },
  {
    name: "Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Organizer",
    email: "organizer@test.com",
    password: "org123",
    role: "organizer"
  }
]);

// Wait to get the ObjectIDs from the inserted users before inserting events and bookings
// Note: In real life, replace organizer_id with the actual ObjectId of the created user

db.events.insertMany([
  {
    title: "Music Festival",
    description: "Live concert",
    date: new Date(),
    location: "Chennai",
    price: 499,
    category: "Music",
    image: "https://via.placeholder.com/300",
    seats: 500,
    organizer_id: "replace_with_organizer_object_id"
  },
  {
    title: "Tech Conference",
    description: "Tech talks",
    date: new Date(),
    location: "Bangalore",
    price: 999,
    category: "Tech",
    image: "https://via.placeholder.com/300",
    seats: 200,
    organizer_id: "replace_with_organizer_object_id"
  }
]);
