
# Gathr - Social Event Platform

Gathr is an AI-driven event platform that connects young professionals through curated events and personality-based matching.

## Overview

Gathr helps users find events that match their personality and interests, connect with compatible attendees, and create their own events. The platform uses a personality quiz to understand user preferences and suggest relevant events.
Link:
https://gathr-social-match.lovable.app/

## Features

- User authentication (login/registration)
- Personality test for personalized recommendations
- Event discovery with infinite scrolling
- Event filtering and search
- Event creation and management
- Booking system for events
- User profile management
- Gathr Circle for managing connections
- Event attendee viewing (24 hours before event)
- Messaging system for attendees
- Post-event feedback collection
- Personality-based matching algorithm

## Technologies Used

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Shadcn UI component library
- React Router for navigation
- React Query for data fetching

### Backend
- Python Flask REST API
- SQLAlchemy ORM for database operations
- PostgreSQL database
- JWT authentication
- Scikit-learn for AI personality matching
- TensorFlow for recommendation engine

## How to Run the App

### Frontend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd gathr-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Backend Setup

1. Navigate to the backend directory
```bash
cd backend
```

2. Create and activate a Python virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r ../requirements.txt
```

4. Set up PostgreSQL database
```bash
# Create a PostgreSQL database named 'gathr_db'
# You may need to update DATABASE_URL in database.py
```

5. Start the Flask server
```bash
python run.py
```

The backend API will be available at `http://localhost:5000`

## Component Structure

- `src/`
  - `components/` - Reusable UI components
  - `contexts/` - React contexts for state management
  - `data/` - Mock data for development
  - `layouts/` - Page layout components
  - `pages/` - Main application pages
  - `types/` - TypeScript type definitions
  - `api/` - API client for backend communication
- `backend/`
  - `app.py` - Main Flask application entry point
  - `models.py` - SQLAlchemy database models
  - `database.py` - Database configuration and initialization
  - `ai.py` - AI algorithms for personality analysis and matching
  - `run.py` - Script to start the Flask server

## Key Components

### Authentication
- `AuthContext.tsx` - Manages user authentication state
- `Login.tsx` & `Register.tsx` - Authentication pages
- `PersonalityTest.tsx` - User onboarding personality quiz
- Backend JWT authentication with Flask-JWT-Extended

### Event Management
- `FindEvents.tsx` - Main event discovery page
- `CreateEvent.tsx` - Event creation form
- `UpcomingEvents.tsx` - User's booked and created events
- `EventDetailDialog.tsx` - Detailed event information
- `EventFilterDialog.tsx` - Event filtering interface
- RESTful API endpoints for event operations

### User Profile & Social
- `Profile.tsx` - User profile management
- `GathrCircle.tsx` - User's connections and messaging
- `FeedbackDialog.tsx` - Post-event feedback collection
- Personality trait storage and analysis

### AI Components
- Personality analysis algorithm
- Event-user matching algorithm
- Recommendation engine

## Layouts
- `MainLayout.tsx` - Layout for authenticated pages with bottom navigation
- `AuthLayout.tsx` - Layout for authentication pages

## User Flow
1. User signs up or logs in
2. New users complete a personality test
3. Users are directed to the event discovery page
4. Users can browse, search, and filter events
5. Users can view event details and book events
6. Users can see attendees 24 hours before the event
7. Users can message up to 10% of attendees
8. Users can add connections to their Gathr Circle
9. After events, users can provide feedback
10. The system uses feedback to improve recommendations

## Mobile & Desktop Compatibility
The application is fully responsive and works well on both iPhone and desktop devices. It utilizes:
- Responsive design principles with Tailwind CSS
- Mobile-first approach
- Bottom navigation for mobile
- Adaptive layouts for different screen sizes

## Current Implementation Status

✅ Frontend user interface  
✅ Responsive design for mobile and desktop  
✅ User authentication (frontend interface and backend)  
✅ Personality test with trait analysis  
✅ Event discovery with infinite scrolling  
✅ Event detail view  
✅ Backend API structure with Flask  
✅ Database models for users, events, and attendance  
✅ API endpoints for core functionality  
✅ User connection management (Gathr Circle)  
✅ Post-event feedback system  
✅ Attendee viewing (24 hours before event)  

## Limitations and Future Improvements

- **Database Population**: Add sample data to demonstrate functionality
- **Real-time Messaging**: Implement WebSockets for real-time chat
- **Social Media Integration**: Add OAuth for social media login and personality analysis
- **Advanced AI Models**: Further train the personality matching algorithm with real user data
- **Push Notifications**: Add notification system for event reminders and messages
- **Mobile Apps**: Develop native mobile applications for iOS and Android
- **Payment Processing**: Integrate payment system for paid events

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
