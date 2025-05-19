
"""
Run Script for Gathr Backend

This script initializes and runs the Gathr Flask application
with proper environment settings.

Usage:
    python run.py
"""
import os
from app import app, init_db

if __name__ == '__main__':
    # Initialize the database
    init_db()
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the Flask application
    app.run(host='0.0.0.0', port=port, debug=True)
    
    print(f"Gathr backend running on port {port}")
