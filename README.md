
# Gathr - Social Event Platform

Gathr is an AI-driven event platform that connects young professionals through curated events and personality-based matching.

## Overview

Gathr helps users find events that match their personality and interests, connect with compatible attendees, and create their own events. The platform uses a personality quiz to understand user preferences and suggest relevant events.

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

### Backend (Planned)
- Python backend API (to be implemented)
- AI algorithm for personality matching
- Recommendation engine

## How to Run the App

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

## Component Structure

- `src/`
  - `components/` - Reusable UI components
  - `contexts/` - React contexts for state management
  - `data/` - Mock data for development
  - `layouts/` - Page layout components
  - `pages/` - Main application pages
  - `types/` - TypeScript type definitions

## Key Components

### Authentication
- `AuthContext.tsx` - Manages user authentication state
- `Login.tsx` & `Register.tsx` - Authentication pages
- `PersonalityTest.tsx` - User onboarding personality quiz

### Event Management
- `FindEvents.tsx` - Main event discovery page
- `CreateEvent.tsx` - Event creation form
- `UpcomingEvents.tsx` - User's booked and created events
- `EventCard.tsx` - Reusable event card component
- `EventFilterDialog.tsx` - Event filtering interface

### User Profile
- `Profile.tsx` - User profile management

## Layouts
- `MainLayout.tsx` - Layout for authenticated pages with bottom navigation
- `AuthLayout.tsx` - Layout for authentication pages

## Mobile & Desktop Compatibility
The application is fully responsive and works well on both iPhone and desktop devices. It utilizes:
- Responsive design principles with Tailwind CSS
- Mobile-first approach
- Bottom navigation for mobile
- Adaptive layouts for different screen sizes

## Current Limitations and Future Improvements
- Authentication is currently simulated (no real backend)
- Personality test results are stored locally
- Events are using mock data
- Backend integration with Python needs to be implemented
- Social media integration for enhanced personality analysis
- Real-time notifications for event updates
- In-app messaging between event attendees
- Event ratings and feedback system

## User Flow
1. User signs up or logs in
2. New users complete a personality test
3. Users are directed to the event discovery page
4. Users can browse, search, and filter events
5. Users can book events or create their own
6. Users can manage their bookings and created events
7. Users can view and edit their profile

## Backend Requirements (To Be Implemented)
- Python-based API for handling user data and events
- AI/Machine learning for personality analysis
- Algorithm for matching users with events and other attendees
- Database for storing user profiles, events, and interactions

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
