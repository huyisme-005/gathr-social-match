
"""
Database Configuration Module

This module configures the SQLAlchemy database connection and session
management for the Gathr application. It uses PostgreSQL as the database.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import os

# Database URL - in production, get from environment variable
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost/gathr_db')

# Create database engine
engine = create_engine(DATABASE_URL)

# Create session factory bound to the engine
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# Base class for all models
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    """
    Initialize the database by creating all tables
    
    This function imports all models and creates the tables
    based on their definitions.
    """
    # Import models here to ensure they are registered with Base
    import models
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
