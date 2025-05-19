
"""
Gathr Backend Application

This is the main entry point for the Gathr backend Flask API.
It provides the endpoints for authentication, event management,
and personality analysis using AI algorithms.

Dependencies: See requirements.txt
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

# Import modules
from database import db_session, init_db
from models import User, Event, Attendance
from ai import analyze_personality, calculate_match_score

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure application
app.config['JWT_SECRET_KEY'] = 'your-secret-key-replace-in-production'  # Replace with env variable in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize JWT
jwt = JWTManager(app)

# Initialize database
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Close database session when app context ends"""
    db_session.remove()

# Routes
@app.route('/api/healthcheck', methods=['GET'])
def healthcheck():
    """Simple healthcheck endpoint to verify API is running"""
    return jsonify({"status": "ok", "message": "Gathr API is running"})

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request body:
    - name: User's full name
    - email: User's email address
    - password: User's password (will be hashed)
    
    Returns:
    - JWT token for authentication
    - User data (id, name, email)
    """
    data = request.json
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409
    
    # Create new user
    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    # Save to database
    db_session.add(new_user)
    db_session.commit()
    
    # Create access token
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        "token": access_token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "hasCompletedPersonalityTest": False,
            "personalityTags": []
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    """
    User login endpoint
    
    Request body:
    - email: User's email
    - password: User's password
    
    Returns:
    - JWT token for authentication
    - User data including personality test status
    """
    data = request.json
    
    # Find the user
    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "hasCompletedPersonalityTest": user.has_completed_personality_test,
            "personalityTags": user.personality_tags or []
        }
    }), 200

# Personality Test route
@app.route('/api/personality-test', methods=['POST'])
@jwt_required()
def submit_personality_test():
    """
    Submit and process personality test answers
    
    Request body:
    - answers: Dictionary of question IDs and selected trait answers
    
    Returns:
    - Analyzed personality traits
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Get answers from request
    answers = data.get('answers', {})
    
    # Use AI module to analyze personality
    personality_traits = analyze_personality(answers)
    
    # Update user in database
    user = User.query.get(current_user_id)
    if user:
        user.personality_tags = personality_traits
        user.has_completed_personality_test = True
        db_session.commit()
    
    return jsonify({
        "personalityTags": personality_traits
    }), 200

# Event routes
@app.route('/api/events', methods=['GET'])
@jwt_required()
def get_events():
    """
    Get events with pagination and optional filtering
    Matches events to user personality profile
    
    Query parameters:
    - page: Page number for pagination
    - limit: Number of events per page
    - category: Filter by category
    
    Returns:
    - List of events with match scores
    - Pagination metadata
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Get pagination parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    category = request.args.get('category', None)
    
    # Base query
    query = Event.query
    
    # Apply category filter if provided
    if category:
        query = query.filter(Event.categories.contains([category]))
    
    # Paginate results
    events_page = query.paginate(page=page, per_page=limit, error_out=False)
    
    # Format and add match scores
    events_data = []
    for event in events_page.items:
        # Calculate match score if user has completed personality test
        match_score = 0
        if user and user.has_completed_personality_test and user.personality_tags:
            match_score = calculate_match_score(user.personality_tags, event.categories)
            
        # Format event data
        events_data.append({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date.strftime("%Y-%m-%d"),
            "time": event.time.strftime("%H:%M"),
            "location": event.location,
            "imageUrl": event.image_url,
            "capacity": event.capacity,
            "attendees": event.attendees.count(),
            "categories": event.categories,
            "creator": {
                "id": event.creator.id,
                "name": event.creator.name
            },
            "matchScore": match_score
        })
    
    return jsonify({
        "events": events_data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": events_page.total,
            "pages": events_page.pages,
            "hasNext": events_page.has_next,
            "hasPrev": events_page.has_prev
        }
    }), 200

@app.route('/api/events', methods=['POST'])
@jwt_required()
def create_event():
    """
    Create a new event
    
    Request body:
    - title: Event title
    - description: Event description
    - date: Event date
    - time: Event time
    - location: Event location
    - imageUrl: URL to event image
    - capacity: Maximum attendees
    - categories: Array of category tags
    
    Returns:
    - Created event data
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Create new event
    new_event = Event(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        time=data['time'],
        location=data['location'],
        image_url=data.get('imageUrl', ''),
        capacity=data['capacity'],
        categories=data['categories'],
        creator_id=current_user_id
    )
    
    # Save to database
    db_session.add(new_event)
    db_session.commit()
    
    return jsonify({
        "id": new_event.id,
        "title": new_event.title,
        "description": new_event.description,
        "date": new_event.date.strftime("%Y-%m-%d"),
        "time": new_event.time.strftime("%H:%M"),
        "location": new_event.location,
        "imageUrl": new_event.image_url,
        "capacity": new_event.capacity,
        "attendees": 0,
        "categories": new_event.categories,
        "creator": {
            "id": current_user_id,
            "name": User.query.get(current_user_id).name
        }
    }), 201

@app.route('/api/events/<event_id>/book', methods=['POST'])
@jwt_required()
def book_event(event_id):
    """
    Book attendance for an event
    
    URL parameters:
    - event_id: ID of the event to book
    
    Returns:
    - Booking confirmation
    """
    current_user_id = get_jwt_identity()
    
    # Check if event exists
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    # Check if event is full
    if event.attendees.count() >= event.capacity:
        return jsonify({"error": "Event is at full capacity"}), 400
    
    # Check if user is already attending
    existing_attendance = Attendance.query.filter_by(
        user_id=current_user_id, event_id=event_id
    ).first()
    
    if existing_attendance:
        return jsonify({"error": "Already booked for this event"}), 400
    
    # Create attendance record
    attendance = Attendance(user_id=current_user_id, event_id=event_id)
    db_session.add(attendance)
    db_session.commit()
    
    return jsonify({
        "message": "Event successfully booked",
        "eventId": event_id
    }), 201

@app.route('/api/events/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_events():
    """
    Get upcoming events for the logged-in user
    
    Returns:
    - Events the user has booked
    - Events the user has created
    """
    current_user_id = get_jwt_identity()
    
    # Get events user is attending
    attended_events = (
        Event.query
        .join(Attendance)
        .filter(Attendance.user_id == current_user_id)
        .all()
    )
    
    # Get events user has created
    created_events = Event.query.filter_by(creator_id=current_user_id).all()
    
    # Format events
    def format_event(event, is_creator):
        return {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date.strftime("%Y-%m-%d"),
            "time": event.time.strftime("%H:%M"),
            "location": event.location,
            "imageUrl": event.image_url,
            "capacity": event.capacity,
            "attendees": event.attendees.count(),
            "categories": event.categories,
            "isCreator": is_creator,
            "creator": {
                "id": event.creator.id,
                "name": event.creator.name
            }
        }
    
    attended_events_data = [format_event(event, False) for event in attended_events]
    created_events_data = [format_event(event, True) for event in created_events]
    
    return jsonify({
        "attendingEvents": attended_events_data,
        "createdEvents": created_events_data
    }), 200

# Main entry point
if __name__ == '__main__':
    init_db()  # Initialize database
    app.run(debug=True)
