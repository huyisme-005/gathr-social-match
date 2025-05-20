
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
python app.py
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
- `backend/`
  - `app.py` - Main Flask application entry point
  - `models.py` - SQLAlchemy database models
  - `database.py` - Database configuration and initialization
  - `ai.py` - AI algorithms for personality analysis and matching

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
- `EventCard.tsx` - Reusable event card component
- `EventFilterDialog.tsx` - Event filtering interface
- RESTful API endpoints for event operations

### User Profile
- `Profile.tsx` - User profile management
- Personality trait storage and analysis

### AI Components
- Personality analysis algorithm
- Event-user matching algorithm
- Recommendation engine

## Layouts
- `MainLayout.tsx` - Layout for authenticated pages with bottom navigation
- `AuthLayout.tsx` - Layout for authentication pages

## Mobile & Desktop Compatibility
The application is fully responsive and works well on both iPhone and desktop devices. It utilizes:
- Responsive design principles with Tailwind CSS
- Mobile-first approach
- Bottom navigation for mobile
- Adaptive layouts for different screen sizes

## Current Implementation Status

✅ Frontend user interface  
✅ Responsive design for mobile and desktop  
✅ User authentication (frontend interface)  
✅ Personality test with trait analysis  
✅ Event discovery with infinite scrolling  
✅ User profiles with personality traits  
✅ Backend API structure with Flask  
✅ Database models for users, events, and attendance  
✅ API endpoints for core functionality  
✅ Basic AI matching algorithm  

## Limitations and Planned Improvements

- **Current Backend**: The backend is implemented but needs to be integrated with the frontend
- **Database Connection**: Frontend needs to be connected to the backend API instead of mock data
- **AI Model Training**: The personality matching algorithm needs training with real user data
- **Real-time Features**: Add WebSockets for real-time notifications and updates
- **Social Media Integration**: Add OAuth for social media login and personality analysis
- **In-app Messaging**: Implement chat functionality between event attendees
- **Event Ratings**: Add a feedback system for events to improve recommendations
- **Mobile App**: Develop native mobile applications for iOS and Android

## API Endpoints

### Authentication
- POST `/api/register` - Register a new user
- POST `/api/login` - User login

### Personality
- POST `/api/personality-test` - Submit personality test results

### Events
- GET `/api/events` - Get events with filtering and pagination
- POST `/api/events` - Create a new event
- POST `/api/events/<event_id>/book` - Book attendance for an event
- GET `/api/events/upcoming` - Get user's upcoming events

## User Flow
1. User signs up or logs in
2. New users complete a personality test
3. Users are directed to the event discovery page
4. Users can browse, search, and filter events
5. Users can book events or create their own
6. Users can manage their bookings and created events
7. Users can view and edit their profile

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
