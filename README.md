
# Gathr - Event Discovery & Social Platform

**Author: Huy Le (huyisme-005)**


A modern React-based event discovery platform that helps users find and attend events based on their personality and preferences. Built with React, TypeScript, Tailwind CSS, and Shadcn UI components.

Link: https://gathr-social-match.lovable.app/

## Recent Updates

### Latest Improvements
- ✅ **Fixed Favorites Bug**: Resolved issue where More Events section favorites were showing incorrect notifications
- ✅ **Enhanced View All Functionality**: Added expandable/collapsible view for all event sections
- ✅ **Improved User Experience**: Better visual feedback for favorite toggles and section expansions
- ✅ **Code Documentation**: Added author comments to all major components
- ✅ **Better Navigation**: Seamless event detail navigation from all sections

## Features

### Core Functionality
- **Personality-Based Recommendations**: Events matched to user personality traits
- **Advanced Favorites System**: Add/remove events with proper state management
- **Expandable Event Sections**: View all or collapse event lists dynamically  
- **Real-time Notifications**: Toast notifications for user actions
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Event Management**: Book, cancel, and manage event attendance

### User Experience
- **Interactive UI**: Smooth transitions and hover effects
- **Visual Feedback**: Heart animations and color changes for favorites
- **Seamless Navigation**: Direct routing to event details from any section
- **Smart Loading**: Skeleton loaders during data fetching

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom themes
- **UI Components**: Shadcn UI component library
- **Icons**: Lucide React icon set
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Notifications**: Sonner toast library
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns library

## Component Architecture

### Core Components

#### Pages
- **FindEvents** (`src/pages/FindEvents.tsx`): Main event discovery page with expandable sections
- **EventDetail** (`src/pages/EventDetail.tsx`): Detailed event view with booking functionality
- **Profile** (`src/pages/Profile.tsx`): User profile management
- **FavoritesPage** (`src/pages/FavoritesPage.tsx`): User's favorited events
- **ExplorePage** (`src/pages/ExplorePage.tsx`): Advanced event browsing
- **TicketsPage** (`src/pages/TicketsPage.tsx`): User's booked events

#### Key Components
- **MoreEventsSection** (`src/components/MoreEventsSection.tsx`): Expandable event list with favorites
- **EventCard** (`src/components/EventCard.tsx`): Reusable event display component
- **EventDetailDialog** (`src/components/EventDetailDialog.tsx`): Modal event details
- **AuthContext** (`src/contexts/AuthContext.tsx`): User authentication and favorites management

#### Authentication
- **Login** (`src/pages/auth/Login.tsx`): User authentication
- **Register** (`src/pages/auth/Register.tsx`): User registration
- **PersonalityTest** (`src/pages/auth/PersonalityTest.tsx`): Personality assessment

#### Admin Features
- **AdminDashboard** (`src/pages/AdminDashboard.tsx`): Administrative interface
- **UsersTab** (`src/components/admin/UsersTab.tsx`): User management
- **AnalyticsTab** (`src/components/admin/AnalyticsTab.tsx`): Platform analytics

### Data Layer
- **Mock Events** (`src/data/mockEvents.ts`): Sample event data
- **Custom Events** (`src/data/customMoreEvents.ts`): Additional event entries
- **Event Categories** (`src/data/eventCategories.ts`): Event classification system

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd gathr

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Backend Integration

### Python Flask API (Optional)
The project includes a Python Flask backend in the `backend/` directory for advanced features:

#### Setup Python Backend
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the Flask application
python run.py
```

#### Backend Features
- **AI-Powered Recommendations**: Event matching algorithms
- **Database Management**: User and event data storage
- **Advanced Analytics**: User behavior tracking
- **API Endpoints**: RESTful API for frontend integration

#### Deployment Options
- **Heroku**: Deploy Flask app with Procfile
- **Railway**: Modern deployment platform
- **DigitalOcean**: App platform deployment
- **AWS**: EC2 or Elastic Beanstalk

### Recommended: Supabase Integration
For production applications, we recommend using Lovable's native Supabase integration:

1. Click the **Supabase** button in the top right of the Lovable interface
2. Connect to your Supabase project
3. Enable authentication, database, and file storage features
4. Use built-in Supabase hooks and components

Benefits:
- **Managed Database**: PostgreSQL with real-time features
- **Authentication**: Email, OAuth, and phone authentication
- **File Storage**: Image and document management
- **Edge Functions**: Serverless backend logic
- **Real-time Subscriptions**: Live data updates

## Issues

- Events in More Events haven't been added to the list of Favorites after clicking their hearts yet.
- Payment is still demo.
- Certain button hasn't worked as required.


## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components, providing a standardized design system.
│   ├── admin/          # Admin-specific components
│   └── MoreEventsSection.tsx  # Event list component
├── contexts/          # React context providers, facilitating global state management across the app.
├── data/              # Mock data and configurations, useful for local development and testing
├── hooks/             # Custom React hooks that encapsulate reusable logic, for code maintainability
├── layouts/           # Page layout components in various operations.
├── lib/               # Utility functions for operations like formatting data, handling API requests, or managing user input
├── pages/             # Route components
│   ├── auth/          # Authentication pages (e.g., login, sign-up).
│   └── FindEvents.tsx # Main discovery page 
└── types/             # TypeScript type definitions, ensuring type safety across components and hooks.

backend/
├── app.py             # Main Flask application, responsible for routing requests and serving responses.
├── models.py          # Database models
├── ai.py              # AI recommendation engine to suggest events based on user preferences, past interactions, or trending activities.
├── database.py        # Database configuration, ensuring connections are properly managed and optimized for performance.
└── requirements.txt   # Python dependencies for backend
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

