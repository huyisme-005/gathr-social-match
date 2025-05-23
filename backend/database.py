
"""
@file database.py
@author Huy Le (huyisme-005)
@organization Gathr
Database Configuration Module

This module configures the SQLAlchemy database connection and session
management for the Gathr application. It uses PostgreSQL as the database.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import os
from datetime import datetime
import json

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

# JSON backup file path for fallback storage
BACKUP_FILE = os.path.join(os.path.dirname(__file__), 'data_backup.json')

def init_db():
    """
    Initialize the database by creating all tables
    
    This function imports all models and creates the tables
    based on their definitions.
    """
    # Import models here to ensure they are registered with Base
    import models
    
    try:
        # Try to create tables in the database
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        print("Will use JSON fallback for data storage.")

def backup_to_json(data_type, data):
    """
    Backup data to JSON file as fallback if database is unavailable
    
    Args:
        data_type: Type of data (users, events, etc.)
        data: Data to backup
    """
    try:
        # Create the data structure
        backup_data = {
            'timestamp': datetime.now().isoformat(),
            'type': data_type,
            'data': data
        }
        
        # Read existing backup if it exists
        existing_data = []
        if os.path.exists(BACKUP_FILE):
            with open(BACKUP_FILE, 'r') as f:
                existing_data = json.load(f)
        
        # Append new data
        existing_data.append(backup_data)
        
        # Write back to file
        with open(BACKUP_FILE, 'w') as f:
            json.dump(existing_data, f, indent=2)
            
        return True
    except Exception as e:
        print(f"Error backing up data to JSON: {e}")
        return False

def restore_from_json(data_type):
    """
    Restore data from JSON file if database is unavailable
    
    Args:
        data_type: Type of data to restore (users, events, etc.)
    
    Returns:
        List of data objects or empty list if not found
    """
    try:
        if not os.path.exists(BACKUP_FILE):
            return []
            
        with open(BACKUP_FILE, 'r') as f:
            backup_data = json.load(f)
        
        # Filter data by type and sort by timestamp (newest first)
        filtered_data = [item['data'] for item in backup_data 
                         if item['type'] == data_type]
        
        if filtered_data:
            return filtered_data[-1]  # Return the most recent backup
        return []
    except Exception as e:
        print(f"Error restoring data from JSON: {e}")
        return []
