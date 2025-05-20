"""
Gathr Backend Application

This is the main entry point for the Gathr backend Flask API.
It provides the endpoints for authentication, event management,
personality analysis, social connections, and messaging.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta, datetime
from sqlalchemy import and_, func
import os
from flask_socketio import SocketIO, emit, join_room, leave_room
import time
import secrets

# Import modules
from database import db_session, init_db, backup_to_json, restore_from_json
from models import User, Event, Attendance, Connection, Message, Feedback
from ai import (
    analyze_personality, 
    calculate_match_score, 
    calculate_user_compatibility,
    select_message_recipients
)

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure application
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize JWT
jwt = JWTManager(app)

# Initialize Socket.IO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*")

# Room registry for active connections
active_rooms = {}

# Initialize database
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Close database session when app context ends"""
    db_session.remove()

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"Client disconnected: {request.sid}")
    # Remove user from any rooms they were in
    for room_id, users in list(active_rooms.items()):
        if request.sid in users:
            users.remove(request.sid)
            # Clean up empty rooms
            if not users:
                del active_rooms[room_id]

@socketio.on('join')
def handle_join(data):
    """Handle client joining a room"""
    room = data.get('room')
    if not room:
        return
    
    join_room(room)
    if room not in active_rooms:
        active_rooms[room] = []
    active_rooms[room].append(request.sid)
    
    print(f"Client {request.sid} joined room: {room}")
    emit('user_joined', {'user': request.sid}, room=room)

@socketio.on('leave')
def handle_leave(data):
    """Handle client leaving a room"""
    room = data.get('room')
    if not room:
        return
    
    leave_room(room)
    if room in active_rooms and request.sid in active_rooms[room]:
        active_rooms[room].remove(request.sid)
        # Clean up empty rooms
        if not active_rooms[room]:
            del active_rooms[room]
    
    print(f"Client {request.sid} left room: {room}")
    emit('user_left', {'user': request.sid}, room=room)

@socketio.on('message')
def handle_message(data):
    """Handle real-time messaging"""
    room = data.get('room')
    if not room or room not in active_rooms:
        return
    
    # Add server timestamp
    data['timestamp'] = time.time()
    
    # Broadcast message to the room
    emit('message', data, room=room)

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
    
    try:
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
        
        # Backup to JSON as fallback
        user_data = {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "password_hash": new_user.password_hash,
            "created_at": datetime.now().isoformat()
        }
        backup_to_json("users", user_data)
        
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
    
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

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
    
    try:
        # Try to find the user in the database
        user = User.query.filter_by(email=data['email']).first()
        
        # If not found, check the JSON backup
        if not user:
            users = restore_from_json("users")
            user_data = next((u for u in users if u["email"] == data['email']), None)
            
            if user_data and check_password_hash(user_data["password_hash"], data['password']):
                # Create access token
                access_token = create_access_token(identity=user_data["id"])
                
                return jsonify({
                    "token": access_token,
                    "user": {
                        "id": user_data["id"],
                        "name": user_data["name"],
                        "email": user_data["email"],
                        "hasCompletedPersonalityTest": False,
                        "personalityTags": []
                    }
                }), 200
        
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
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed", "details": str(e)}), 500

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
    
    try:
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
            
            # Backup to JSON
            user_data = {
                "id": user.id,
                "personality_tags": personality_traits,
                "has_completed_personality_test": True
            }
            backup_to_json("personality_test", user_data)
        
        # Send real-time update to relevant rooms
        if str(current_user_id) in active_rooms:
            socketio.emit('personality_updated', {
                "userId": current_user_id,
                "personalityTags": personality_traits
            }, room=str(current_user_id))
        
        return jsonify({
            "personalityTags": personality_traits
        }), 200
    
    except Exception as e:
        print(f"Personality test error: {str(e)}")
        return jsonify({"error": "Failed to process personality test", "details": str(e)}), 500

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
    
    try:
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
    
    except Exception as e:
        print(f"Get events error: {str(e)}")
        return jsonify({"error": "Failed to retrieve events", "details": str(e)}), 500

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
    - Past events for feedback
    """
    current_user_id = get_jwt_identity()
    current_date = datetime.now()
    
    # Get events user is attending
    attended_events = (
        Event.query
        .join(Attendance)
        .filter(
            Attendance.user_id == current_user_id,
            Event.date >= current_date
        )
        .all()
    )
    
    # Get events user has created
    created_events = Event.query.filter(
        Event.creator_id == current_user_id,
        Event.date >= current_date
    ).all()
    
    # Get past events that need feedback
    feedback_needed_events = (
        Event.query
        .join(Attendance)
        .outerjoin(Feedback, and_(
            Feedback.event_id == Event.id,
            Feedback.user_id == current_user_id
        ))
        .filter(
            Attendance.user_id == current_user_id,
            Event.date < current_date,
            Feedback.id == None  # No feedback given yet
        )
        .all()
    )
    
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
    feedback_events_data = [format_event(event, False) for event in feedback_needed_events]
    
    return jsonify({
        "attendingEvents": attended_events_data,
        "createdEvents": created_events_data,
        "feedbackEvents": feedback_events_data
    }), 200

@app.route('/api/events/<event_id>/attendees', methods=['GET'])
@jwt_required()
def get_event_attendees(event_id):
    """
    Get attendees for an event
    Only available within 24 hours of the event and if the user is attending
    
    URL parameters:
    - event_id: ID of the event
    
    Returns:
    - List of attendees with personality match scores
    """
    current_user_id = get_jwt_identity()
    
    # Get current user
    user = User.query.get(current_user_id)
    
    # Check if user completed personality test
    if not user.has_completed_personality_test:
        return jsonify({"error": "Complete personality test to view attendees"}), 400
    
    # Check if event exists
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    # Check if user is attending the event
    is_attending = Attendance.query.filter_by(
        user_id=current_user_id, event_id=event_id
    ).first() is not None
    
    if not is_attending:
        return jsonify({"error": "Only attendees can view other attendees"}), 403
    
    # Check if the event is within 24 hours
    time_to_event = event.date - datetime.now()
    if time_to_event.total_seconds() > 24 * 60 * 60:
        return jsonify({"error": "Attendee list available only within 24 hours of event"}), 403
    
    # Get all attendees except current user
    attendees = (
        User.query
        .join(Attendance)
        .filter(
            Attendance.event_id == event_id,
            User.id != current_user_id
        )
        .all()
    )
    
    # Calculate compatible users that can be messaged
    messageable_ids = select_message_recipients(attendees)
    
    # Format attendees data with compatibility scores
    attendees_data = []
    for attendee in attendees:
        compatibility_score = 50  # Default score
        
        # Calculate compatibility if both users have personality data
        if user.personality_tags and attendee.personality_tags:
            compatibility_score = calculate_user_compatibility(
                user.personality_tags, 
                attendee.personality_tags
            )
        
        # Add to attendees list
        attendees_data.append({
            "id": attendee.id,
            "name": attendee.name,
            "personalityMatch": compatibility_score,
            "personalityTags": attendee.personality_tags or [],
            "canMessage": attendee.id in messageable_ids
        })
    
    # Sort by compatibility score (descending)
    attendees_data.sort(key=lambda x: x["personalityMatch"], reverse=True)
    
    return jsonify({
        "attendees": attendees_data
    }), 200

@app.route('/api/events/<event_id>/feedback', methods=['POST'])
@jwt_required()
def submit_event_feedback(event_id):
    """
    Submit feedback for an event
    
    URL parameters:
    - event_id: ID of the event
    
    Request body:
    - rating: Numeric rating (1-5)
    - enjoyedMost: Array of what user enjoyed most
    - comment: Text feedback
    
    Returns:
    - Confirmation of feedback submission
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Check if event exists
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    # Check if user attended the event
    attendance = Attendance.query.filter_by(
        user_id=current_user_id, event_id=event_id
    ).first()
    
    if not attendance:
        return jsonify({"error": "Can only submit feedback for attended events"}), 403
    
    # Check if feedback already submitted
    existing_feedback = Feedback.query.filter_by(
        user_id=current_user_id, event_id=event_id
    ).first()
    
    if existing_feedback:
        return jsonify({"error": "Feedback already submitted for this event"}), 400
    
    # Create feedback record
    feedback = Feedback(
        event_id=event_id,
        user_id=current_user_id,
        rating=data.get('rating', 0),
        enjoyed_most=data.get('enjoyedMost', []),
        comment=data.get('comment', '')
    )
    
    db_session.add(feedback)
    db_session.commit()
    
    return jsonify({
        "message": "Feedback submitted successfully",
        "eventId": event_id
    }), 201

# Social routes
@app.route('/api/circle', methods=['GET'])
@jwt_required()
def get_circle():
    """
    Get the user's Gathr circle connections
    
    Returns:
    - List of connections with personality match scores
    """
    current_user_id = get_jwt_identity()
    
    # Get current user
    user = User.query.get(current_user_id)
    
    # Get all connections
    connections = (
        User.query
        .join(Connection, Connection.connected_user_id == User.id)
        .filter(Connection.user_id == current_user_id)
        .all()
    )
    
    # Format connections data with compatibility scores
    connections_data = []
    for connection in connections:
        compatibility_score = 50  # Default score
        
        # Calculate compatibility if both users have personality data
        if user.personality_tags and connection.personality_tags:
            compatibility_score = calculate_user_compatibility(
                user.personality_tags, 
                connection.personality_tags
            )
        
        # Get number of shared events
        shared_events_count = db_session.query(func.count(Attendance.event_id)).filter(
            Attendance.user_id == current_user_id,
            Attendance.event_id.in_(
                db_session.query(Attendance.event_id).filter(
                    Attendance.user_id == connection.id
                )
            )
        ).scalar()
        
        # Add to connections list
        connections_data.append({
            "id": connection.id,
            "name": connection.name,
            "personalityMatch": compatibility_score,
            "personalityTags": connection.personality_tags or [],
            "eventsAttended": shared_events_count
        })
    
    # Sort by compatibility score (descending)
    connections_data.sort(key=lambda x: x["personalityMatch"], reverse=True)
    
    return jsonify({
        "connections": connections_data
    }), 200

@app.route('/api/circle/add', methods=['POST'])
@jwt_required()
def add_to_circle():
    """
    Add a user to the Gathr circle
    
    Request body:
    - userId: ID of the user to add to circle
    
    Returns:
    - Confirmation of the connection
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Get user ID to connect with
    connected_user_id = data.get('userId')
    
    # Check if the user exists
    connected_user = User.query.get(connected_user_id)
    if not connected_user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if connection already exists
    existing_connection = Connection.query.filter_by(
        user_id=current_user_id, connected_user_id=connected_user_id
    ).first()
    
    if existing_connection:
        return jsonify({"error": "Already in your Gathr circle"}), 400
    
    # Create connection
    connection = Connection(
        user_id=current_user_id,
        connected_user_id=connected_user_id
    )
    
    db_session.add(connection)
    db_session.commit()
    
    return jsonify({
        "message": "Added to your Gathr circle",
        "userId": connected_user_id
    }), 201

@app.route('/api/circle/remove', methods=['POST'])
@jwt_required()
def remove_from_circle():
    """
    Remove a user from the Gathr circle
    
    Request body:
    - userId: ID of the user to remove from circle
    
    Returns:
    - Confirmation of the removal
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Get user ID to disconnect from
    connected_user_id = data.get('userId')
    
    # Delete connection
    connection = Connection.query.filter_by(
        user_id=current_user_id, connected_user_id=connected_user_id
    ).first()
    
    if not connection:
        return jsonify({"error": "User not in your Gathr circle"}), 404
    
    db_session.delete(connection)
    db_session.commit()
    
    return jsonify({
        "message": "Removed from your Gathr circle",
        "userId": connected_user_id
    }), 200

@app.route('/api/messages', methods=['POST'])
@jwt_required()
def send_message():
    """
    Send a message to another user
    
    Request body:
    - recipientId: ID of the message recipient
    - content: Message content
    - eventId: Optional ID of the related event
    
    Returns:
    - Confirmation of the message sending
    """
    current_user_id = get_jwt_identity()
    data = request.json
    
    recipient_id = data.get('recipientId')
    content = data.get('content')
    event_id = data.get('eventId')
    
    # Check if recipient exists
    recipient = User.query.get(recipient_id)
    if not recipient:
        return jsonify({"error": "Recipient not found"}), 404
    
    # If event is provided, check messaging permissions
    if event_id:
        # Check if event exists
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        # Check if both users are attending the event
        user_attending = Attendance.query.filter_by(
            user_id=current_user_id, event_id=event_id
        ).first() is not None
        
        recipient_attending = Attendance.query.filter_by(
            user_id=recipient_id, event_id=event_id
        ).first() is not None
        
        if not (user_attending and recipient_attending):
            return jsonify({"error": "Both users must be attending the event"}), 403
        
        # Check if the event is within 24 hours
        time_to_event = event.date - datetime.now()
        if time_to_event.total_seconds() > 24 * 60 * 60:
            return jsonify({"error": "Messaging available only within 24 hours of event"}), 403
        
        # Check if recipient is in messageable users list
        attendees = (
            User.query
            .join(Attendance)
            .filter(
                Attendance.event_id == event_id,
                User.id != current_user_id
            )
            .all()
        )
        
        messageable_ids = select_message_recipients(attendees)
        if recipient_id not in messageable_ids:
            return jsonify({"error": "Cannot message this user for this event"}), 403
    
    # Create message
    message = Message(
        sender_id=current_user_id,
        recipient_id=recipient_id,
        content=content,
        event_id=event_id,
        sent_at=datetime.now()
    )
    
    db_session.add(message)
    db_session.commit()
    
    return jsonify({
        "message": "Message sent successfully",
        "recipientId": recipient_id,
        "sentAt": message.sent_at.isoformat()
    }), 201

@app.route('/api/messages/<user_id>', methods=['GET'])
@jwt_required()
def get_messages(user_id):
    """
    Get messages between current user and another user
    
    URL parameters:
    - user_id: ID of the other user
    
    Returns:
    - List of messages between the two users
    """
    current_user_id = get_jwt_identity()
    
    # Get all messages between the two users
    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.recipient_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.recipient_id == current_user_id))
    ).order_by(Message.sent_at).all()
    
    # Format messages
    messages_data = []
    for message in messages:
        messages_data.append({
            "id": message.id,
            "senderId": message.sender_id,
            "recipientId": message.recipient_id,
            "content": message.content,
            "eventId": message.event_id,
            "sentAt": message.sent_at.isoformat(),
            "readAt": message.read_at.isoformat() if message.read_at else None
        })
    
    # Mark received messages as read
    unread_messages = Message.query.filter(
        Message.recipient_id == current_user_id,
        Message.sender_id == user_id,
        Message.read_at == None
    ).all()
    
    for message in unread_messages:
        message.read_at = datetime.now()
    
    db_session.commit()
    
    return jsonify({
        "messages": messages_data
    }), 200

# Admin routes
@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def admin_stats():
    """
    Get admin dashboard statistics
    
    Returns:
    - User statistics
    - Event statistics
    - Security metrics
    """
    current_user_id = get_jwt_identity()
    
    # Check if user is an admin
    user = User.query.get(current_user_id)
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        # Get user statistics
        total_users = User.query.count()
        active_users = User.query.filter(User.last_active > (datetime.now() - timedelta(days=30))).count()
        premium_users = User.query.filter(User.tier.in_(["premium", "enterprise"])).count()
        
        # Get event statistics
        total_events = Event.query.count()
        upcoming_events = Event.query.filter(Event.date > datetime.now()).count()
        past_events = Event.query.filter(Event.date <= datetime.now()).count()
        
        # Calculate user growth by month
        user_growth = []
        for i in range(6, -1, -1):
            month_start = datetime.now().replace(day=1) - timedelta(days=30*i)
            month_end = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
            
            count = User.query.filter(
                User.created_at >= month_start,
                User.created_at < month_end
            ).count()
            
            user_growth.append({
                "month": month_start.strftime("%b"),
                "users": count
            })
        
        return jsonify({
            "userStats": {
                "totalUsers": total_users,
                "activeUsers": active_users,
                "premiumUsers": premium_users,
                "conversionRate": (premium_users / total_users * 100) if total_users > 0 else 0
            },
            "eventStats": {
                "totalEvents": total_events,
                "upcomingEvents": upcoming_events,
                "pastEvents": past_events
            },
            "userGrowth": user_growth,
            "securityAlerts": 3  # Placeholder for security alerts count
        }), 200
    
    except Exception as e:
        print(f"Admin stats error: {str(e)}")
        return jsonify({"error": "Failed to retrieve admin statistics", "details": str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_get_users():
    """
    Get users with pagination and search for admin panel
    
    Query parameters:
    - page: Page number for pagination
    - limit: Number of users per page
    - search: Search term for filtering
    
    Returns:
    - List of users
    - Pagination metadata
    """
    current_user_id = get_jwt_identity()
    
    # Check if user is an admin
    user = User.query.get(current_user_id)
    if not user or not getattr(user, 'is_admin', False):
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        search = request.args.get('search', '')
        
        # Base query
        query = User.query
        
        # Apply search filter if provided
        if search:
            query = query.filter(
                (User.name.ilike(f'%{search}%')) |
                (User.email.ilike(f'%{search}%'))
            )
        
        # Paginate results
        users_page = query.paginate(page=page, per_page=limit, error_out=False)
        
        # Format user data
        users_data = []
        for user in users_page.items:
            users_data.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "hasCompletedPersonalityTest": user.has_completed_personality_test,
                "personalityTags": user.personality_tags or [],
                "tier": getattr(user, 'tier', 'free'),
                "status": "active",  # Placeholder for user status
                "country": getattr(user, 'country', 'Unknown')
            })
        
        return jsonify({
            "users": users_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": users_page.total,
                "pages": users_page.pages,
                "hasNext": users_page.has_next,
                "hasPrev": users_page.has_prev
            }
        }), 200
    
    except Exception as e:
        print(f"Admin get users error: {str(e)}")
        return jsonify({"error": "Failed to retrieve users", "details": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    init_db()
    # Run with Socket.IO
    socketio.run(app, debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
