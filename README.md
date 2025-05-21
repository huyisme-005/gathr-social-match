
# Gathr - Social Event Platform

Gathr is an AI-driven event platform that connects young professionals through curated events and personality-based matching.

## Overview

Gathr helps users find events that match their personality and interests, connect with compatible attendees, and create their own events. The platform uses a personality quiz to understand user preferences and suggest relevant events.
Link:
https://gathr-social-match.lovable.app/

## Features

### Core Features
- User authentication (email/password, social login, phone verification)
- Persistent user accounts
- Personality test for personalized recommendations
- Event discovery with infinite scrolling
- Event filtering and search
- Event creation and management
- Booking system for events
- User profile management with country selection
- "Retake Personality Test" functionality

### Social Features
- Gathr Circle for managing connections
- Event attendee viewing (24 hours before event)
- Messaging system for attendees (up to 10% of attendees)
- Voice and video calling with attendees
- Post-event feedback collection
- Personality-based matching algorithm

### Premium Features
- Subscription tiers (Free, Premium, Enterprise)
- Enhanced visibility in event discovery
- Access to exclusive events
- Advanced matching algorithm
- Increased messaging limits (up to 15% for Premium, unlimited for Enterprise)
- Premium profile badge

### Business Features
- Event sponsorship opportunities based on expected participation
- Corporate accounts for large teams
- Interdepartmental connection targeting
- Platform owner admin dashboard with:
  - User analytics and demographics
  - Security monitoring
  - Platform configuration
  - Mobile app distribution management

## Mobile Application
- iOS App Store and Google Play distribution
- Native mobile experience
- All features accessible on mobile

## Technologies Used

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Shadcn UI component library
- React Router for navigation
- React Query for data fetching
- Recharts for analytics visualization

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

### Mobile App Testing

For building and testing the mobile app:

1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

2. Initialize Capacitor
```bash
npx cap init
```

3. Build the web app
```bash
npm run build
```

4. Add iOS/Android platforms
```bash
npx cap add ios
npx cap add android
```

5. Sync the web build with the native projects
```bash
npx cap sync
```

6. Open the native projects in their respective IDEs
```bash
npx cap open ios     # Requires macOS and Xcode
npx cap open android # Requires Android Studio
```

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
- Multiple authentication methods (email, social media, phone)
- Persistent user accounts
- User profiles with country selection
- Admin accounts for platform management

### Event Management
- Event discovery with matching algorithm
- Event creation and booking
- Upcoming events tracking
- Event feedback system

### Social Features
- Attendee viewing with compatibility scores
- Messaging system with recipient limits
- Voice/video calling capability
- Gathr Circle for managing connections

### Premium Features
- Multi-tier subscription model
- Enhanced features for paying users
- Corporate account management
- Sponsorship opportunities

### Admin Dashboard
- User analytics and demographics
- Security monitoring
- Platform configuration
- Mobile app distribution

<<<<<<< HEAD
## User Flow
1. User signs up or logs in (email, social media, or phone)
2. New users complete a personality test
3. Users are directed to the event discovery page
4. Users can browse, search, and filter events
5. Users can view event details and book events
6. Users can see attendees 24 hours before the event
7. Users can message or call up to 10-15% of attendees (depending on tier)
8. Users can add connections to their Gathr Circle
9. After events, users can provide feedback
10. Premium users get enhanced visibility and exclusive features

## Mobile & Desktop Compatibility
The application is fully responsive and works well on both iPhone and desktop devices. It utilizes:
- Responsive design principles with Tailwind CSS
- Mobile-first approach
- Bottom navigation for mobile
- Adaptive layouts for different screen sizes
- Native mobile apps for iOS and Android

## Current Implementation Status

✅ Frontend user interface  
✅ Responsive design for mobile and desktop  
✅ User authentication (email, social, phone)  
✅ Personality test with trait analysis  
✅ Event discovery with infinite scrolling  
✅ Event detail view  
✅ Retake personality test functionality  
✅ User connection management (Gathr Circle)  
✅ Voice and video calling capability  
✅ Subscription tiers (Free, Premium, Enterprise)  
✅ Admin dashboard for platform management  
✅ Mobile app distribution setup  
✅ Country selection for users  
✅ Corporate account options  
✅ Sponsorship opportunities  

## Limitations and Future Improvements

- **Database Integration**: Connect to a real backend database
- **Real-time Messaging**: Implement WebSockets for real-time chat
- **Payment Processing**: Integrate real payment system for subscriptions
- **Push Notifications**: Add notification system for event reminders and messages
- **Enhanced Analytics**: Expand analytics capabilities for event creators
- **Recommendation Refinement**: Further train the personality matching algorithm with real user data
- **Backend yet to be deployed**

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
=======
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
>>>>>>> parent of 548a6da (feat: Enhance More Events section and user accounts)
