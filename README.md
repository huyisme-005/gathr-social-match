
# Gathr Event Platform

Gathr is a social event platform that connects people through shared interests and events. The app matches users based on personality types and interests, helping them discover events and make meaningful connections.

## Features

- **Event Discovery**: Find events based on your personality traits and location
- **Event Booking & Payment**: Book events with integrated payment functionality and refund policy
- **Personality Matching**: Get matched with events and people based on your personality test
- **Social Circle**: Connect with like-minded individuals
- **Event Creation**: Create and manage your own events
- **Admin Dashboard**: Platform management for administrators
- **Customizable Theme**: Change background colors to suit your preferences

## Event Features
- **Price Display**: Clear pricing for all events
- **Time Details**: View start and end times for better planning
- **Carousel Navigation**: Browse events with convenient left/right navigation
- **Expandable Sections**: Show more events with "View all" / "Collapse" functionality
- **Refund Policy**: Full refunds within 24 hours of booking

## Tech Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui for UI components
- date-fns for date formatting
- lucide-react for icons
- React Query for data fetching
- Sonner for toast notifications

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
  - `EventDetailDialog.tsx`: Detailed event information and booking
  - `BottomNavbar.tsx`: Mobile navigation bar
  - `Header.tsx`: Top application header
  - `ThemeToggle.tsx`: Background color customization

## Known Issues

- **Admin Navigation**: Use the "Back to App" button in the header to return to the main app from admin page.
- **Event Booking**: Currently implemented as a client-side state only. In a production app, this would connect to an API.
- **Payments**: Payment simulation is included, but it would require a real payment processor integration in production.
- Users couldn't do the same thing for events on the 'More Events' section, something to be fixed later on.
- Events' boxes accidentally got turned into rectangles, instead of squares.
- Background color change is still not good enough.

## Theme Customization

The app supports custom background colors with several preset options including black, white, dark gray, navy, and dark purple. Access the theme toggle from the top-right corner of the main pages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
