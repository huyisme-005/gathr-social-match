
/**
 * BottomNavbar Component
 * 
 * This component creates the mobile-friendly navigation bar at the bottom of the app.
 * It contains links to the main sections of the application with icons and labels.
 * The current route is highlighted with the app's primary coral color.
 */
import { useNavigate, useLocation } from "react-router-dom";
import { Search, CalendarPlus, CalendarCheck, UserRound, Users } from "lucide-react";

const BottomNavbar = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Hook for getting current location/route information
  const location = useLocation();
  
  // Navigation items with their labels, routes and icons
  const navItems = [
    {
      name: "Find Events",
      path: "/find-events",
      icon: <Search className="h-6 w-6" />,
    },
    {
      name: "Create Event",
      path: "/create-event",
      icon: <CalendarPlus className="h-6 w-6" />,
    },
    {
      name: "Upcoming",
      path: "/upcoming-events",
      icon: <CalendarCheck className="h-6 w-6" />,
    },
    {
      name: "Circle",
      path: "/gathr-circle",
      icon: <Users className="h-6 w-6" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserRound className="h-6 w-6" />,
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center py-3 px-2 w-1/5 ${
              location.pathname === item.path 
                ? "text-gathr-coral" // Active route gets coral color
                : "text-gray-500 hover:text-gathr-coral" // Inactive routes are gray
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
