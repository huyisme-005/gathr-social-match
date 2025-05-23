
"""
@author Huy Le (huyisme-005)
@organization Gathr
Run Script for Gathr Backend

This script initializes and runs the Gathr Flask application
with proper environment settings and Socket.IO support.

Usage:
    python run.py
"""
import os
import secrets
from app import app, socketio, init_db

if __name__ == '__main__':
    # Generate a secret key if not set
    if not os.environ.get('JWT_SECRET_KEY'):
        secret_key = secrets.token_hex(32)
        os.environ['JWT_SECRET_KEY'] = secret_key
        print(f"Generated JWT secret key: {secret_key}")
    
    # Initialize the database
    init_db()
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the Flask application with Socket.IO
    print(f"Gathr backend running on port {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
