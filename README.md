
# Gathr - Social Event Matchmaking App

Gathr is an AI-driven event platform that connects young professionals through curated events and personality-based matching.

## Features

### User Experience
- **Personalized Event Discovery**: Browse events based on your personality profile and preferences
- **Event Booking**: Seamlessly book tickets to events with confirmation and refund options
- **Favorites**: Save events you're interested in with the heart icon for later viewing across all sections
- **Tickets Management**: View all your booked events in one place
- **User Profiles**: Customize your profile and preferences
- **Account Management**: Update personal information, change password, or close account
- **Interactive Event Cards**: Consistent heart functionality across all event displays with real-time feedback

### Event Features
- **Event Details**: View comprehensive information about each event with full-screen detail views
- **Attendee Matching**: See personality match scores with other event attendees
- **Location Information**: Find events near you with detailed location data
- **Social Sharing**: Share events with friends easily
- **Favorites System**: Mark and unmark events as favorites with the heart icon on all event cards
- **Consistent UI**: Uniform event card design across all sections of the app
- **Clickable Event Navigation**: Direct navigation to event details from all sections including More Events
- **Time Display**: Shows start and end times for all events in More Events section

### Navigation & Exploration
- **Bottom Navigation**: Easy access to Home, Explore, Favorites, Tickets, and Profile sections
- **Advanced Filtering**: Filter events by categories, date, and distance in the Explore section with a dedicated "Apply Filters" button
- **Personalized Recommendations**: See events tailored to your preferences on the Home page
- **Event Categories**: Browse events by specific categories with the quick-select badges
- **Improved Home Layout**: Consistent card sizes in "Your Ticket Events" and "Explore Nearby" sections
- **Event Collections**: Browse your booked events, nearby events, and expanded More Events collection
- **Enhanced More Events**: Expanded collection with 15+ diverse events, all with images, heart functionality, and proper navigation

### Admin Dashboard
- **User Management**: View and manage all platform users
- **Analytics**: See platform usage statistics and growth metrics
- **Security Monitoring**: Monitor and respond to security threats

## Components & Architecture

### Core Components

#### **EventCard** 
- **Role**: Reusable component for displaying events in grid and list views
- **Features**: Heart icon for favorites, consistent styling, price display, match scores
- **Views**: Supports both grid (square) and list (rectangular) layouts
- **Integration**: Used across Home, Explore, Favorites, and Tickets pages

#### **MoreEventsSection** 
- **Role**: Specialized component for displaying the "More Events" section on the home page
- **Features**: List format display, heart functionality, time details, proper navigation
- **Integration**: Extracted from FindEvents for better maintainability and separation of concerns

#### **BottomNavbar** 
- **Role**: Main navigation component providing access to all major app sections
- **Features**: 5 main sections (Home, Explore, Favorites, Tickets, Profile)
- **Styling**: Fixed bottom navigation with active state indicators

#### **EventFilterDialog** 
- **Role**: Advanced filtering system for the Explore page
- **Features**: Category filters, date filters, distance filters with "Apply Filters" functionality
- **Integration**: Seamlessly integrated with ExplorePage event discovery

#### **EventDetailDialog**
- **Role**: Comprehensive event information display in modal format
- **Features**: Full event details, booking capabilities, attendee information
- **Integration**: Triggered from EventCard clicks across the application

#### **AuthHeader** 
- **Role**: Authentication header for login/register pages
- **Features**: Brand consistency, navigation between auth states

#### **Header** 
- **Role**: Main header component with theme toggle and notifications
- **Features**: Dark/light mode toggle, notification bell, user context

#### **GathrLogo** 
- **Role**: Brand logo component used across the application
- **Features**: Consistent branding, scalable vector design

### Page Components

#### **FindEvents (Home)** 
- **Role**: Main dashboard showing personalized event collections
- **Sections**: 
  - Your Ticket Events (user's booked events)
  - Explore Nearby (location-based recommendations)
  - More Events (expanded collection with 15+ diverse events using MoreEventsSection component)
- **Features**: Infinite scrolling, heart functionality, consistent card sizes, proper event navigation
- **Navigation**: Direct links to event details and section-specific pages
- **Refactoring**: Extracted MoreEventsSection component for better maintainability

#### **ExplorePage** 
- **Role**: Event discovery with comprehensive filtering and search
- **Features**: Advanced filtering, category badges, search functionality
- **Integration**: "Apply Filters" button for refined event discovery

#### **FavoritesPage** 
- **Role**: Collection of user's favorited events
- **Features**: Heart toggle functionality, consistent event display

#### **TicketsPage** 
- **Role**: User's booked events management and access
- **Features**: Booking history, event access, refund information

#### **EventDetail** 
- **Role**: Full-page detailed event information view
- **Features**: Comprehensive event data, booking capabilities, social sharing
- **Updates**: Now supports both mock events and custom more events with proper navigation

#### **Profile** 
- **Role**: User account management and preferences
- **Features**: Personal information, preferences, account settings

### Data Management

#### **customMoreEvents.ts**
- **Role**: Contains additional events specifically for the "More Events" section
- **Features**: Complete event details, proper time information, diverse categories
- **Integration**: Used alongside mock events to provide expanded event collection

### Layout Components

#### **AuthLayout** 
- **Role**: Layout wrapper for authentication pages
- **Usage**: Login, register, personality test pages
- **Features**: Consistent auth flow design

#### **MainLayout** 
- **Role**: Main app layout with bottom navigation for authenticated users
- **Features**: Bottom navigation integration, consistent app structure

### Context & State Management

#### **AuthContext** 
- **Role**: Manages user authentication state, login/logout, and user preferences
- **Features**: User session management, favorites management, preference storage
- **Integration**: Used across all authenticated components

#### **React Query** 
- **Role**: Handles API calls and state management for data fetching
- **Features**: Caching, background updates, error handling

### UI Components (shadcn/ui)
- Complete set of reusable UI components including buttons, cards, dialogs, forms, and navigation elements
- Consistent theming with dark/light mode support
- Responsive design patterns
- Accessibility features built-in

## Recent Improvements

### Bug Fixes
- **Favorites Functionality**: Fixed heart icon functionality in More Events section to properly sync with favorites
- **Event Navigation**: Ensured all More Events are clickable and navigate to detailed event pages
- **Time Display**: Added start and end time information to all events in More Events section

### Code Refactoring
- **Component Separation**: Extracted MoreEventsSection from FindEvents.tsx for better maintainability
- **Data Organization**: Created customMoreEvents.ts for better data management
- **Event Detail Support**: Enhanced EventDetail page to support both mock and custom events

### UI Enhancements
- **Consistent Heart Icons**: All events now have properly functioning heart icons with toast feedback
- **Time Information**: Added Clock icon and time details to More Events section
- **Better Navigation**: Improved click handling and event routing across all sections

## Pages
- **Home (FindEvents)**: Personalized feed showing booked events, nearby events, and expanded recommended events collection
- **Explore**: Discover new events by category, location, or popularity with advanced filtering and "Apply Filters" functionality
- **Favorites**: View all events you've marked as favorites with the heart icon across all sections
- **Tickets**: Access all your booked events with booking management
- **Profile**: Manage your account settings, preferences, and personal information
- **Event Details**: View comprehensive information about a specific event with booking capabilities
- **Admin Dashboard**: Platform management tools for administrators

## Technology Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **Routing**: React Router v6.26.2
- **State Management**: React Query v5.56.2 + React Context
- **Forms**: React Hook Form v7.53.0 with Zod validation
- **Icons**: Lucide React v0.462.0
- **Build Tool**: Vite
- **Charts**: Recharts v2.12.7
- **Date Handling**: date-fns v3.6.0

## Backend Integration

### Current Setup - Flask API
The application currently includes a Flask backend in the `backend/` directory with the following structure:
- **Flask Framework**: Python-based API server
- **Database**: PostgreSQL integration
- **Models**: User, Event, and Booking models
- **Authentication**: JWT-based authentication system
- **AI Integration**: Personality matching algorithms

### Recommended - Supabase Integration
For production deployment, we strongly recommend migrating to Supabase for the following benefits:
- **Authentication**: Built-in email/password and OAuth authentication
- **Database**: Managed PostgreSQL with real-time subscriptions
- **Storage**: File storage for event images and user avatars
- **Edge Functions**: Serverless functions for custom backend logic
- **Real-time**: Live updates for event bookings and chat features

## Getting Started

### Prerequisites
- Node.js 14.0 or later
- npm or yarn
- Python 3.8+ (for Flask backend)
- PostgreSQL (for Flask backend)

### Installation
1. Clone the repository
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `cd backend && pip install -r requirements.txt`
4. Set up environment variables (see Backend Setup section)
5. Start the development servers (see Running the Project section)

## Running the Project (Frontend + Backend)

### 1. Start the Backend (Flask API)
- Open a terminal and navigate to the `backend` directory:
  ```sh
  cd backend
  ```
- (Optional) Create and activate a Python virtual environment:
  ```sh
  python -m venv venv
  venv\Scripts\activate  # On Windows
  # or
  source venv/bin/activate  # On macOS/Linux
  ```
- Install dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- Set up environment variables:
  ```sh
  cp .env.example .env
  # Edit .env with your database credentials and API keys
  ```
- Initialize the database:
  ```sh
  python database.py
  ```
- Start the backend server:
  ```sh
  python run.py
  ```
- The backend API will be available at `http://localhost:5000`

### 2. Start the Frontend (React App)
- Open a new terminal and navigate to the project root:
  ```sh
  cd ..
  npm install
  npm run dev
  ```
- The frontend will be available at `http://localhost:8080`

## Backend API Deployment

### Option 1: Heroku Deployment (Flask)
1. **Install Heroku CLI**:
   ```sh
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Prepare for deployment**:
   ```sh
   cd backend
   pip freeze > requirements.txt
   echo "web: python run.py" > Procfile
   ```

3. **Deploy to Heroku**:
   ```sh
   heroku login
   heroku create your-app-name
   heroku config:set FLASK_ENV=production
   heroku config:set DATABASE_URL=your_postgres_url
   heroku addons:create heroku-postgresql:hobby-dev
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name
   git push heroku main
   ```

### Option 2: Railway Deployment (Flask)
1. **Connect GitHub repository** to Railway
2. **Configure environment variables** in Railway dashboard
3. **Deploy automatically** on git push

### Option 3: DigitalOcean App Platform (Flask)
1. **Create new app** in DigitalOcean dashboard
2. **Connect GitHub repository**
3. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `python run.py`
4. **Set environment variables** in app settings

### Option 4: AWS Elastic Beanstalk (Flask)
1. **Install EB CLI**:
   ```sh
   pip install awsebcli
   ```
2. **Initialize and deploy**:
   ```sh
   cd backend
   eb init
   eb create production
   eb deploy
   ```

## Frontend Deployment

### Lovable Platform (Recommended)
1. Click the "Publish" button in the top right of the Lovable editor
2. Your app will be deployed to a Lovable subdomain (e.g., yourapp.lovable.app)
3. For custom domains, upgrade to a paid Lovable plan and configure in Project Settings > Domains

### Alternative Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag-and-drop build folder or connect GitHub
- **GitHub Pages**: For static deployment (limited backend integration)

## Environment Variables

### Backend (.env file)
```env
FLASK_ENV=development
DATABASE_URL=postgresql://username:password@localhost/gathr_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
OPENAI_API_KEY=your-openai-key-for-ai-features
```

### Frontend (for API endpoints)
Update `src/api/gathrApi.ts` with your deployed backend URL:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:5000';
```

## Known Issues & Solutions

### Common Development Issues
- **CORS errors**: Ensure backend is running before frontend
- **Port conflicts**: Change ports in configuration if 5000 or 8080 are in use
- **Database connection**: Verify PostgreSQL is running and connection string is correct
- **Missing dependencies**: Run `pip install -r requirements.txt` and `npm install`
- **Image loading**: Some demo images use Unsplash links requiring internet connection
- **Favorites sync**: Ensure proper event ID matching between different event sources

### Performance Considerations
- **Event Loading**: Implement pagination for large event collections
- **Image Optimization**: Consider using CDN for event images
- **State Management**: Optimize React Query cache configuration for better performance
- **Component Splitting**: Continue refactoring large components for better maintainability

### Scaling Recommendations
- **Database**: Implement connection pooling and query optimization
- **Caching**: Add Redis for session management and API response caching
- **CDN**: Use CloudFront or similar for static asset delivery
- **Monitoring**: Implement logging and error tracking (Sentry, LogRocket)

## Troubleshooting & Potential Issues
- **CORS errors**: Make sure the backend is running before the frontend. The frontend expects the backend at `http://localhost:5000`.
- **Port conflicts**: If port 5000 (backend) or 8080 (frontend) is in use, stop other services or change the port in the config.
- **Database connection**: Ensure PostgreSQL is running and the connection string in `backend/database.py` is correct.
- **Missing dependencies**: Run `pip install -r requirements.txt` (backend) and `npm install` (frontend) if you see import/module errors.
- **Image loading**: Some demo images use Unsplash links. If images do not load, check your internet connection.
- **Authentication Issues**: Check AuthContext state and ensure login credentials are correct
- **Event Display Issues**: Verify event data structure matches Event type definition
- **Heart Icon Issues**: Ensure getFavoriteEvents and toggleEventFavorite functions are properly imported from AuthContext
- **Navigation Issues**: Verify event IDs match between different data sources (mockEvents vs customMoreEvents)

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Design inspiration from modern mobile-first applications
- shadcn/ui for the beautiful component library
- The React team and community for the amazing tools and libraries
- Lovable platform for the development environment
- Flask community for the robust backend framework
- Unsplash for providing demo event images
