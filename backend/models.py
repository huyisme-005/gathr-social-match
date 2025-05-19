
"""
Database Models for Gathr Application

This module defines the SQLAlchemy ORM models for the Gathr application.
Models include User, Event, and Attendance for the core functionality.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base

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
        user: Relationship to user
        event: Relationship to event
    """
    __tablename__ = 'attendances'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="events_attending")
    event = relationship("Event", back_populates="attendees")
    
    def __repr__(self):
        return f"<Attendance user_id={self.user_id} event_id={self.event_id}>"
