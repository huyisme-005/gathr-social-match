
# Gathr - Social Event Matchmaking App

Gathr is an AI-driven event platform that connects young professionals through curated events and personality-based matching.

## Features

### User Experience
- **Personalized Event Discovery**: Browse events based on your personality profile and preferences
- **Event Booking**: Seamlessly book tickets to events with confirmation and refund options
- **Favorites**: Save events you're interested in with the heart icon for later viewing
- **Tickets Management**: View all your booked events in one place
- **User Profiles**: Customize your profile and preferences
- **Account Management**: Update personal information, change password, or close account

### Event Features
- **Event Details**: View comprehensive information about each event
- **Attendee Matching**: See personality match scores with other event attendees
- **Location Information**: Find events near you with detailed location data
- **Social Sharing**: Share events with friends easily
- **Favorites System**: Mark and unmark events as favorites with the heart icon on all event cards
- **Consistent UI**: Uniform event card design across all sections of the app

### Navigation & Exploration
- **Bottom Navigation**: Easy access to Home, Explore, Favorites, Tickets, and Profile sections
- **Advanced Filtering**: Filter events by categories, date, and distance in the Explore section with a dedicated "Apply Filters" button
- **Personalized Recommendations**: See events tailored to your preferences on the Home page
- **Event Categories**: Browse events by specific categories with the quick-select badges
- **Improved Home Layout**: Consistent card sizes in "Your Ticket Events" and "Explore Nearby" sections
- **Event Collections**: Browse your booked events, nearby events, and more events with consistent UI

### Admin Dashboard
- **User Management**: View and manage all platform users
- **Analytics**: See platform usage statistics and growth metrics
- **Security Monitoring**: Monitor and respond to security threats

## Components & Architecture

### Core Components
- **EventCard**: Reusable component for displaying events in grid and list views with heart icon for favorites
- **BottomNavbar**: Main navigation component with 5 sections (Home, Explore, Favorites, Tickets, Profile)
- **EventFilterDialog**: Advanced filtering system for the Explore page with "Apply Filters" functionality
- **AuthHeader**: Authentication header for login/register pages
- **Header**: Main header component with theme toggle and notifications
- **GathrLogo**: Brand logo component used across the application

### Page Components
- **FindEvents (Home)**: Main dashboard showing Your Ticket Events, Explore Nearby, and More Events sections
- **ExplorePage**: Event discovery with filtering, categories, and search functionality
- **FavoritesPage**: Collection of user's favorited events
- **TicketsPage**: User's booked events management
- **EventDetail**: Detailed event information with booking capabilities
- **Profile**: User account management and preferences

### Layout Components
- **AuthLayout**: Layout wrapper for authentication pages (login, register, personality test)
- **MainLayout**: Main app layout with bottom navigation for authenticated users

### Context & State Management
- **AuthContext**: Manages user authentication state, login/logout, and user preferences
- **React Query**: Handles API calls and state management for data fetching

### UI Components (shadcn/ui)
- Complete set of reusable UI components including buttons, cards, dialogs, forms, and navigation elements
- Consistent theming with dark/light mode support
- Responsive design patterns

## Pages
- **Home**: Personalized feed showing booked events, nearby events, and recommended events
- **Explore**: Discover new events by category, location, or popularity with advanced filtering
- **Favorites**: View all events you've marked as favorites with the heart icon
- **Tickets**: Access all your booked events
- **Profile**: Manage your account settings, preferences, and personal information
- **Event Details**: View comprehensive information about a specific event
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

## Backend Integration
- **Current Setup**: Flask API (backend directory) - Note: For production, consider migrating to Supabase
- **Recommended**: Supabase integration for scalable backend services including:
  - Authentication (email/password, OAuth)
  - PostgreSQL database
  - Real-time subscriptions
  - File storage
  - Edge functions

## Getting Started

### Prerequisites
- Node.js 14.0 or later
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

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

## Deployment

### Frontend Deployment (Lovable Platform)
1. Click the "Publish" button in the top right of the Lovable editor
2. Your app will be deployed to a Lovable subdomain (e.g., yourapp.lovable.app)
3. For custom domains, upgrade to a paid Lovable plan and configure in Project Settings > Domains

### Backend Deployment Options
1. **Recommended: Supabase Integration**
   - Click the green Supabase button in Lovable's top right
   - Set up authentication, database, and edge functions
   - No separate deployment needed

2. **Traditional Deployment (Flask)**
   - **Heroku**: `git push heroku main` (requires Heroku CLI)
   - **Railway**: Connect GitHub repo and deploy
   - **DigitalOcean App Platform**: Connect repo and configure build settings
   - **AWS Elastic Beanstalk**: Upload application zip or use CLI
   - **Google Cloud Run**: Containerize and deploy

### Environment Variables
- Configure environment variables in your deployment platform
- For Supabase: Use Supabase secrets management
- For traditional deployment: Set environment variables in your hosting platform

## Known Issues & Limitations
- **Backend Framework**: Currently uses Flask; Supabase integration recommended for production
- **Image Loading**: Some demo images use Unsplash links requiring internet connection
- **Mobile Responsiveness**: Optimized for mobile-first design but may need adjustments for larger screens
- **Real-time Features**: Limited without WebSocket implementation (Supabase provides real-time out of the box)

## Troubleshooting & Potential Issues
- **CORS errors**: Make sure the backend is running before the frontend. The frontend expects the backend at `http://localhost:5000`.
- **Port conflicts**: If port 5000 (backend) or 8080 (frontend) is in use, stop other services or change the port in the config.
- **Database connection**: Ensure PostgreSQL is running and the connection string in `backend/database.py` is correct.
- **Missing dependencies**: Run `pip install -r requirements.txt` (backend) and `npm install` (frontend) if you see import/module errors.
- **Image loading**: Some demo images use Unsplash links. If images do not load, check your internet connection.
- **Demo credentials**: Use the credentials in the Authentication section for demo login.
- **Windows path issues**: Use `venv\Scripts\activate` for Windows, not the Unix-style path.
- **Authentication Issues**: Check AuthContext state and ensure login credentials are correct
- **Event Display Issues**: Verify event data structure matches Event type definition

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
