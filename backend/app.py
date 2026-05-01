from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pymongo.errors
from bson.objectid import ObjectId
import os
import mongomock
import string
import random

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/event_booking")

# Try to connect to real MongoDB with a short timeout
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client.admin.command('ping')
    db = client.event_booking
    print("Connected to real MongoDB")
except pymongo.errors.ServerSelectionTimeoutError:
    print("MongoDB not running locally. Falling back to in-memory mongomock for testing!")
    client = mongomock.MongoClient()
    db = client.event_booking

    # Seed initial data if using mock
    if db.users.count_documents({}) == 0:
        from datetime import datetime, timedelta

        db.users.insert_many([
            {"_id": "ZIO1", "name": "Zio", "email": "zio@test.com", "password": "123456", "role": "user"},
            {"_id": "ORG1", "name": "Organizer One", "email": "org1@test.com", "password": "123456", "role": "organizer"},
            {"_id": "ORG2", "name": "Organizer Two", "email": "org2@test.com", "password": "123456", "role": "organizer"},
            {"_id": "ADM1", "name": "Admin", "email": "admin@test.com", "password": "admin123", "role": "admin"}
        ])

        base_date = datetime.now()
        
        # 21 unique event concepts mapped to our 6 generated images
        event_concepts = [
            {"title": "Neon Sounds Midnight", "desc": "Immerse yourself in a raw, unadulterated underground synthwave experience. Pulsing beats, heavy bass, and blinding neon lights await you in this all-night sonic journey.", "loc": "Chennai", "price": 499, "cat": "Music", "img": "/images/music_festival.png"},
            {"title": "Cyberpunk Tech Summit", "desc": "Dive deep into the gritty future of artificial intelligence, neural networks, and cybernetics. A symposium for hackers, creators, and visionaries shaping tomorrow.", "loc": "Bangalore", "price": 999, "cat": "Tech", "img": "/images/tech_conference.png"},
            {"title": "70s Cinema Marathon", "desc": "A brutalist curation of classic retro cinema. Experience gritty storytelling, analog grain, and raw emotional power over 12 uninterrupted hours of film.", "loc": "Mumbai", "price": 299, "cat": "Film", "img": "/images/film_screening.png"},
            {"title": "Concrete Brutalism Tour", "desc": "A guided exploration through the imposing, unyielding structures of the city's concrete giants. Understand the philosophy and striking aesthetics of brutalist architecture.", "loc": "Delhi", "price": 199, "cat": "Art", "img": "/images/art_exhibition.png"},
            {"title": "Spicy Urban Food Fest", "desc": "An uncompromising celebration of intense flavors. Challenge your palate with bold, aggressively spiced street food from the city's most daring culinary pop-ups.", "loc": "Hyderabad", "price": 350, "cat": "Food", "img": "/images/food_festival.png"},
            {"title": "Alternative Comedy Riot", "desc": "No censorship, no boundaries. An underground stand-up comedy showcase featuring the sharpest, most unapologetic voices in the contemporary comedy scene.", "loc": "Pune", "price": 450, "cat": "Comedy", "img": "/images/comedy_show.png"},
            {"title": "Vinyl Record Swap", "desc": "Trade, buy, and discover analog sounds. A raw, tactile gathering for audiophiles to exchange vintage vinyl records, cassettes, and musical knowledge.", "loc": "Chennai", "price": 100, "cat": "Music", "img": "/images/music_festival.png"},
            {"title": "Analog Coding Bootcamp", "desc": "Strip away the IDEs and modern comforts. Learn the brutal fundamentals of coding logic using only paper, punch cards, and sheer intellectual force.", "loc": "Bangalore", "price": 1500, "cat": "Tech", "img": "/images/tech_conference.png"},
            {"title": "B-Movie Horror Night", "desc": "A celebration of practical effects and low-budget terror. Witness a double-feature of campy, visceral horror films from the darkest corners of the 80s.", "loc": "Mumbai", "price": 250, "cat": "Film", "img": "/images/film_screening.png"},
            {"title": "Abstract Paint Workshop", "desc": "Embrace chaos on canvas. A high-energy, physically demanding workshop focused on aggressive, expressive abstract painting techniques.", "loc": "Delhi", "price": 600, "cat": "Art", "img": "/images/art_exhibition.png"},
            {"title": "Midnight Taco Stand", "desc": "Authentic, stripped-down Mexican street food. Served late, loud, and unapologetic. Experience the raw flavors of midnight urban dining.", "loc": "Hyderabad", "price": 200, "cat": "Food", "img": "/images/food_festival.png"},
            {"title": "Improv Theatre Jam", "desc": "Unscripted, unpredictable, and chaotic. Watch performers build entire worlds from scratch or join the fray in this interactive, high-stakes comedy theatre.", "loc": "Pune", "price": 300, "cat": "Comedy", "img": "/images/comedy_show.png"},
            {"title": "Underground Punk Gig", "desc": "Distortion, feedback, and raw energy. Three local punk bands tear down the house in a cramped, sweaty venue where the music hits you physically.", "loc": "Chennai", "price": 400, "cat": "Music", "img": "/images/music_festival.png"},
            {"title": "Retro Hardware Expo", "desc": "A mechanical museum of obsolete power. Interact with bulky vintage computers, heavy mechanical keyboards, and the foundational hardware of the digital age.", "loc": "Bangalore", "price": 500, "cat": "Tech", "img": "/images/tech_conference.png"},
            {"title": "Indie Film Showcase", "desc": "Raw narratives from independent voices. A curated selection of fiercely original short films shot without studio backing or creative compromises.", "loc": "Mumbai", "price": 300, "cat": "Film", "img": "/images/film_screening.png"},
            {"title": "Sculpture Garden Tour", "desc": "Monolithic forms in natural spaces. An austere outdoor exhibition showcasing massive, imposing sculptures crafted from industrial steel and poured concrete.", "loc": "Delhi", "price": 150, "cat": "Art", "img": "/images/art_exhibition.png"},
            {"title": "Vegan Dessert Fest", "desc": "Plant-based indulgence without compromise. A heavy-hitting showcase of rich, dark, and complex desserts engineered entirely from vegan ingredients.", "loc": "Hyderabad", "price": 250, "cat": "Food", "img": "/images/food_festival.png"},
            {"title": "Stand-up Roast Battle", "desc": "Verbal warfare on stage. Comedians trade vicious, unfiltered insults in a brutal tournament where only the thickest skin survives.", "loc": "Pune", "price": 500, "cat": "Comedy", "img": "/images/comedy_show.png"},
            {"title": "Jazz & Blues Lounge", "desc": "Smoke, shadows, and syncopation. A raw acoustic set featuring intense instrumental solos and gritty vocal performances in an intimate, dark setting.", "loc": "Chennai", "price": 600, "cat": "Music", "img": "/images/music_festival.png"},
            {"title": "Startup Pitch Night", "desc": "High pressure, high stakes. Local founders face a panel of aggressive investors in a rapid-fire pitch competition where ideas are torn apart and rebuilt.", "loc": "Bangalore", "price": 0, "cat": "Tech", "img": "/images/tech_conference.png"},
            {"title": "Noir Film Festival", "desc": "Shadows, cynics, and stark contrasts. A weekend dedicated to the bleakest, most stylistically striking black-and-white crime thrillers ever filmed.", "loc": "Mumbai", "price": 350, "cat": "Film", "img": "/images/film_screening.png"}
        ]

        events = []
        for i, concept in enumerate(event_concepts):
            org_id = "ORG1" if i % 2 == 0 else "ORG2"
            events.append({
                "title": concept["title"], 
                "description": concept["desc"], 
                "date": base_date + timedelta(days=i), 
                "location": concept["loc"], 
                "price": concept["price"], 
                "category": concept["cat"], 
                "image_url": concept["img"], 
                "seats": 100 + (i * 10), 
                "organizer_id": org_id
            })
        
        db.events.insert_many(events)

# Helper to convert MongoDB document to dict with string id
def serialize_doc(doc):
    if not doc:
        return None
    doc['id'] = str(doc.pop('_id'))
    return doc

# HOME ROUTE
@app.route('/')
def home():
    return "Flask is running"

# TEST DATABASE CONNECTION
@app.route('/test-db')
def test_db():
    try:
        client.admin.command('ping')
        return "Database connected"
    except Exception as e:
        return str(e), 500

#register
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    name = data['name']
    email = data['email']
    password = data['password']
    role = data.get('role', 'user')  # default role

    # Check if email already exists
    existing_user = db.users.find_one({"email": email})

    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Generate 4-char unique ID
    while True:
        user_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        if not db.users.find_one({"_id": user_id}):
            break

    # Insert new user
    db.users.insert_one({
        "_id": user_id,
        "name": name,
        "email": email,
        "password": password,  # Storing as plain text per rules: "If plain text: Store as-is"
        "role": role
    })

    return jsonify({"message": "User registered successfully"})

# LOGIN API
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data['email'].strip()
    password = data['password'].strip()

    # Step 1: check email only
    user = db.users.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Step 2: check password manually
    if user.get("password") != password:
        return jsonify({"message": "Wrong password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "role": user.get("role", "user")
    })

# FORGOT PASSWORD API
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email', '').strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = db.users.find_one({"email": email})
    if not user:
        # To prevent email enumeration, usually we still say "link sent" or similar, 
        # but since this is a test app, we can just say not found or return a generic message.
        return jsonify({"message": "User not found"}), 404

    reset_token = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    return jsonify({
        "message": "Reset link generated successfully",
        "reset_link": reset_link
    })


#roles
@app.route('/<role>', methods=['GET'])
def get_users_by_role(role):
    # validate role (important)
    if role not in ['admin', 'organizer', 'user']:
        return jsonify({"message": "Invalid role"}), 400

    users = db.users.find({"role": role})
    data = []
    for u in users:
        u = serialize_doc(u)
        # return same shape as mysql (id, name, email, role)
        data.append({
            "id": u["id"],
            "name": u.get("name"),
            "email": u.get("email"),
            "role": u.get("role")
        })

    return jsonify(data)

# GET EVENTS API
@app.route('/events', methods=['GET'])
def get_events():
    role = request.args.get('role')
    user_id = request.args.get('user_id')
    
    if role == 'organizer' and user_id:
        events = db.events.find({"organizer_id": user_id})
    else:
        events = db.events.find()
        
    data = [serialize_doc(e) for e in events]
    return jsonify(data)

# GET ORGANIZER EVENTS
@app.route('/my-events/<organizer_id>', methods=['GET'])
def get_my_events(organizer_id):
    events = db.events.find({"organizer_id": organizer_id})
    data = [serialize_doc(e) for e in events]
    return jsonify(data)

# POST EVENT
@app.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    date = data.get('date')
    location = data.get('location')
    seats = data.get('seats')
    organizer_id = str(data.get('organizer_id'))

    # Validate organizer exists
    organizer = db.users.find_one({"_id": organizer_id, "role": "organizer"})
    if not organizer:
        return jsonify({"message": "Invalid organizer"}), 403

    db.events.insert_one({
        "title": title,
        "description": description,
        "date": date,
        "location": location,
        "seats": seats,
        "organizer_id": organizer_id
    })

    return jsonify({"message": "Event created successfully"})

#delete event
@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    data = request.get_json()
    organizer_id = str(data['organizer_id'])

    try:
        event = db.events.find_one({"_id": ObjectId(event_id)})
    except Exception:
        return jsonify({"message": "Invalid Event ID format"}), 400

    if not event:
        return jsonify({"message": "Event not found"}), 404

    if str(event.get("organizer_id", "")) != organizer_id:
        return jsonify({"message": "Unauthorized"}), 403

    db.events.delete_one({"_id": ObjectId(event_id)})

    return jsonify({"message": "Event deleted successfully"})

# BOOKING API
@app.route('/bookings', methods=['GET'])
def get_bookings():
    organizer_id = request.args.get('organizer_id')
    
    if organizer_id:
        organizer_events = db.events.find({"organizer_id": organizer_id})
        event_ids = [str(e['_id']) for e in organizer_events]
        bookings = db.bookings.find({"event_id": {"$in": event_ids}})
    else:
        bookings = db.bookings.find()

    data = []
    for b in bookings:
        try:
            user = db.users.find_one({"_id": b.get("user_id")})
        except:
            user = None
            
        try:
            event = db.events.find_one({"_id": ObjectId(b.get("event_id"))})
        except:
            event = None

        data.append({
            "id": str(b["_id"]),
            "user_name": user["name"] if user else "Unknown User",
            "event_name": event["title"] if event else "Unknown Event",
            "ticket_id": b.get("ticket_id")
        })

    return jsonify(data)

#book
@app.route('/book', methods=['POST'])
def book():
    data = request.get_json()

    user_id = data['user_id']
    event_id = data['event_id']
    ticket_id = data['ticket_id']

    try:
            user = db.users.find_one({"_id": user_id})
    except:
        user = None

    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        event = db.events.find_one({"_id": ObjectId(event_id)})
    except:
        event = None

    if not event:
        return jsonify({"message": "Event not found"}), 404

    existing = db.bookings.find_one({"ticket_id": ticket_id})
    if existing:
        return jsonify({"message": "Ticket already exists"}), 400

    db.bookings.insert_one({
        "user_id": str(user_id),
        "event_id": str(event_id),
        "ticket_id": ticket_id
    })

    return jsonify({"message": "Booking successful"})

# RUN SERVER
# ==========================================
# ADMIN ROUTES
# ==========================================

@app.route('/admin/stats', methods=['GET'])
def admin_stats():
    try:
        users_count = db.users.count_documents({})
        events_count = db.events.count_documents({})
        bookings_count = db.bookings.count_documents({})
        return jsonify({
            "users": users_count,
            "events": events_count,
            "bookings": bookings_count
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/admin/users', methods=['GET'])
def admin_get_users():
    try:
        users = list(db.users.find({}))
        # Don't send passwords
        for user in users:
            if 'password' in user:
                del user['password']
        return jsonify([serialize_doc(u) for u in users]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/admin/users/<user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    try:
        result = db.users.delete_one({"_id": user_id})
        if result.deleted_count == 1:
            db.bookings.delete_many({"user_id": user_id})
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            try:
                result = db.users.delete_one({"_id": ObjectId(user_id)})
                if result.deleted_count == 1:
                    db.bookings.delete_many({"user_id": user_id})
                    return jsonify({"message": "User deleted successfully"}), 200
            except:
                pass
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)