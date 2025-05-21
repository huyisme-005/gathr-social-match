
# Gathr Event Platform

Gathr is a social event platform that connects people through shared interests and events. The app matches users based on personality types and interests, helping them discover events and make meaningful connections.

## Features

- **Event Discovery**: Find events based on your personality traits and location
- **Event Booking**: Book events and manage your upcoming schedule
- **Personality Matching**: Get matched with events and people based on your personality test
- **Social Circle**: Connect with like-minded individuals
- **Event Creation**: Create and manage your own events
- **Admin Dashboard**: Platform management for administrators

## Tech Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui for UI components
- date-fns for date formatting
- lucide-react for icons
- React Query for data fetching

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Component Structure

- **Layouts**: Main layout structure components
  - `MainLayout.tsx`: Layout for authenticated pages with bottom navigation
  - `AuthLayout.tsx`: Layout for authentication pages

- **Pages**: Main application views
  - `FindEvents.tsx`: Event discovery page
  - `UpcomingEvents.tsx`: User's booked events
  - `CreateEvent.tsx`: Event creation form
  - `GathrCircle.tsx`: Social connections
  - `Profile.tsx`: User profile settings
  - `AdminDashboard.tsx`: Admin controls

- **Components**: Reusable UI components
  - `EventCard.tsx`: Card display for events
  - `BottomNavbar.tsx`: Mobile navigation bar
  - `Header.tsx`: Top application header

## Known Issues

- **Admin Navigation**: When on the admin page, use the "Back to App" button in the header to return to the main app.
- **Event Booking**: Currently implemented as a client-side state only. In a production app, this would connect to an API.

## Theme Customization

The app supports dark mode by default with a theme toggle in the top-right corner of the main pages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
