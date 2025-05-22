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

## Pages
- **Home**: Personalized feed showing booked events, nearby events, and recommended events
- **Explore**: Discover new events by category, location, or popularity with advanced filtering
- **Favorites**: View all events you've marked as favorites with the heart icon
- **Tickets**: Access all your booked events
- **Profile**: Manage your account settings, preferences, and personal information
- **Event Details**: View comprehensive information about a specific event
- **Admin Dashboard**: Platform management tools for administrators

## Technology Stack
- React
- TypeScript
- TailwindCSS
- shadcn/ui components
- React Router
- React Hook Form
- Lucide icons

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

## Troubleshooting & Potential Issues
- **CORS errors**: Make sure the backend is running before the frontend. The frontend expects the backend at `http://localhost:5000`.
- **Port conflicts**: If port 5000 (backend) or 8080 (frontend) is in use, stop other services or change the port in the config.
- **Database connection**: Ensure PostgreSQL is running and the connection string in `backend/database.py` is correct.
- **Missing dependencies**: Run `pip install -r requirements.txt` (backend) and `npm install` (frontend) if you see import/module errors.
- **Image loading**: Some demo images use Unsplash links. If images do not load, check your internet connection.
- **Demo credentials**: Use the credentials in the Authentication section for demo login.
- **Windows path issues**: Use `venv\Scripts\activate` for Windows, not the Unix-style path.
- Events haven't been shown in More Events yet

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Design inspiration from modern mobile-first applications
- shadcn/ui for the beautiful component library
- The React team and community for the amazing tools and libraries
