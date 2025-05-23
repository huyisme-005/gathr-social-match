
"""
@file models.py
@author Huy Le (huyisme-005)
@organization Gathr

Database Models for Gathr Application

This module defines the SQLAlchemy ORM models for the Gathr application.
Models include User, Event, Attendance, Connection, Message, and Feedback.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base
from datetime import datetime

class User(Base):
    """
    User model representing application users
    
    Attributes:
        id: Unique identifier
        name: User's full name
        email: User's email address (unique)
        password_hash: Hashed password
        has_completed_personality_test: Whether personality test is completed
        personality_tags: List of personality traits from test
        events_created: Events created by this user
        events_attending: Events this user is attending
        connections: Users in this user's Gathr circle
        messages_sent: Messages sent by this user
        messages_received: Messages received by this user
        feedback_given: Feedback submitted by this user
    """
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    has_completed_personality_test = Column(Boolean, default=False)
    personality_tags = Column(ARRAY(String), default=[])
    
    # Relationships
    events_created = relationship("Event", back_populates="creator")
    events_attending = relationship("Attendance", back_populates="user")
    connections = relationship("Connection", foreign_keys="Connection.user_id")
    messages_sent = relationship("Message", foreign_keys="Message.sender_id")
    messages_received = relationship("Message", foreign_keys="Message.recipient_id")
    feedback_given = relationship("Feedback", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.name}>"

class Event(Base):
    """
    Event model representing events in the application
    
    Attributes:
        id: Unique identifier
        title: Event title
        description: Detailed event description
        date: Date of the event
        time: Time of the event
        location: Physical location
        image_url: URL to event image
        capacity: Maximum number of attendees
        categories: List of category tags
        creator_id: ID of user who created the event
        creator: Relationship to creator user
        attendees: Users attending this event
        feedback: Feedback submitted for this event
        messages: Messages related to this event
    """
    __tablename__ = 'events'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(DateTime, nullable=False)
    location = Column(String(200), nullable=False)
    image_url = Column(String(500))
    capacity = Column(Integer, default=0)
    categories = Column(ARRAY(String), default=[])
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    creator = relationship("User", back_populates="events_created")
    attendees = relationship("Attendance", back_populates="event")
    feedback = relationship("Feedback", back_populates="event")
    messages = relationship("Message", back_populates="event")
    
    def __repr__(self):
        return f"<Event {self.title}>"

class Attendance(Base):
    """
    Attendance model representing user attendance at events
    
    This is a many-to-many relationship between users and events.
    
    Attributes:
        id: Unique identifier
        user_id: ID of attending user
        event_id: ID of attended event
        registered_at: When the user registered for the event
        user: Relationship to user
        event: Relationship to event
    """
    __tablename__ = 'attendances'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    registered_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    user = relationship("User", back_populates="events_attending")
    event = relationship("Event", back_populates="attendees")
    
    def __repr__(self):
        return f"<Attendance user_id={self.user_id} event_id={self.event_id}>"

class Connection(Base):
    """
    Connection model representing the Gathr circle relationships
    
    Attributes:
        id: Unique identifier
        user_id: ID of the user who owns the connection
        connected_user_id: ID of the user being connected to
        created_at: When the connection was created
        user: Relationship to the user
        connected_user: Relationship to the connected user
    """
    __tablename__ = 'connections'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    connected_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    connected_user = relationship("User", foreign_keys=[connected_user_id])
    
    def __repr__(self):
        return f"<Connection user_id={self.user_id} connected_user_id={self.connected_user_id}>"

class Message(Base):
    """
    Message model for storing messages between users
    
    Attributes:
        id: Unique identifier
        sender_id: ID of the user sending the message
        recipient_id: ID of the user receiving the message
        content: Text content of the message
        event_id: Optional ID of the related event
        sent_at: When the message was sent
        read_at: When the message was read (null if unread)
        sender: Relationship to the sender user
        recipient: Relationship to the recipient user
        event: Relationship to the related event
    """
    __tablename__ = 'messages'
    
    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=True)
    sent_at = Column(DateTime, default=datetime.now)
    read_at = Column(DateTime, nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id])
    recipient = relationship("User", foreign_keys=[recipient_id])
    event = relationship("Event", back_populates="messages")
    
    def __repr__(self):
        return f"<Message sender_id={self.sender_id} recipient_id={self.recipient_id}>"

class Feedback(Base):
    """
    Feedback model for storing event feedback
    
    Attributes:
        id: Unique identifier
        event_id: ID of the event being rated
        user_id: ID of the user giving feedback
        rating: Numeric rating (1-5)
        enjoyed_most: List of aspects the user enjoyed most
        comment: Text feedback
        submitted_at: When the feedback was submitted
        event: Relationship to the event
        user: Relationship to the user
    """
    __tablename__ = 'feedback'
    
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 rating
    enjoyed_most = Column(ARRAY(String), default=[])  # Aspects enjoyed most
    comment = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    event = relationship("Event", back_populates="feedback")
    user = relationship("User", back_populates="feedback_given")
    
    def __repr__(self):
        return f"<Feedback event_id={self.event_id} user_id={self.user_id} rating={self.rating}>"
