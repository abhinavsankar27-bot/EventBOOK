# Event Booking App

A modern event booking application built with a high-contrast, editorial brutalist design system inspired by 1970s aesthetics. The platform allows users to browse and book events, and organizers to manage their events and track bookings securely.

## Features

- **Brutalist Retro UI**: A responsive, high-contrast, and dynamic visual design that stands out.
- **Role-Based Access Control**: Differentiated experiences and permissions for regular users and event organizers.
- **Event Discovery & Booking**: Users can explore available events and seamlessly book them.
- **Organizer Dashboard**: Dedicated views for organizers to track bookings related strictly to their own events.
- **Secure Authentication**: Robust authentication flow protecting sensitive actions like event booking and organizer dashboards.

## Technology Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Routing**: React Router v7
- **Styling**: Custom CSS enforcing a Brutalist design system

### Backend
- **Framework**: Python / Flask
- **Database**: MongoDB (via PyMongo)
- **Architecture**: RESTful API serving the frontend application

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- MongoDB (running locally on default port `27017` or an Atlas cluster)

### Database Setup

1. Ensure MongoDB is running.
2. The project includes sample data and setup scripts in `backend/insert_scripts.js`.
3. You can use `mongosh` to populate your database with initial users and events:
   ```bash
   mongosh
   use event_booking
   # Paste contents of backend/insert_scripts.js here
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python app.py
   ```
   *The Flask API will run by default (usually on `http://localhost:5000` or `http://127.0.0.1:5000`).*

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically be available at `http://localhost:5173`.*

---

## Project Structure

```
event-booking/
├── backend/            # Python Flask API and MongoDB integration
│   ├── app.py          # Main Flask application file
│   ├── models.js       # Reference for Mongoose models
│   ├── insert_scripts.js # MongoDB initialization scripts
│   └── requirements.txt
├── frontend/           # React frontend application
│   ├── package.json    # React dependencies and scripts
│   ├── src/            # Components, Views, and Styling
│   └── public/         # Static assets including branding
└── README.md           # This documentation file
```
