
import { useNavigate, useLocation } from "react-router-dom";
import { Search, CalendarPlus, CalendarCheck, UserRound } from "lucide-react";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
            className={`flex flex-col items-center justify-center py-3 px-2 w-1/4 ${
              location.pathname === item.path 
                ? "text-gathr-coral" 
                : "text-gray-500 hover:text-gathr-coral"
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
