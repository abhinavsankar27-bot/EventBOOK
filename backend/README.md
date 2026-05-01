# Event Booking - MongoDB Setup

The backend has been successfully migrated to use MongoDB via PyMongo, preserving all API routes without modifying the frontend.

## 1. Setup MongoDB Database
If using local MongoDB, ensure it's running on `127.0.0.1:27017`.
If using MongoDB Atlas, set the environment variable before running the Flask app:
```bash
# Windows (PowerShell)
$env:MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/event_booking?retryWrites=true&w=majority"
```

## 2. Insert Sample Data
Open `mongosh` (MongoDB Shell) or MongoDB Compass and run the scripts provided in `insert_scripts.js`:
```bash
mongosh
use event_booking
```
Copy and paste the insert commands from `insert_scripts.js` into the shell to pre-populate users and events.

## 3. Install Python Dependencies
The backend dependencies have changed to include `pymongo`. To reinstall in your virtual environment:

```bash
cd backend
python -m venv venv
# Activate venv
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
```

## 4. Run the Backend
```bash
python app.py
```
The server will start and connect to MongoDB securely.

## 5. Mongoose Models Reference
As requested, the equivalent Mongoose models have been written to `models.js` for reference or future migration to a Node.js backend.
