
/**
 * Header Component
 * 
 * This component displays the main application header with the Gathr logo and logout button.
 * It's used in the main layout for authenticated users.
 */
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GathrLogo from "./GathrLogo";

const Header = () => {
  // Get authentication functions from AuthContext
  const { logout } = useAuth();
  
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  /**
   * Handles user logout by calling the logout function and redirecting to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-10 border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 justify-between">
        <GathrLogo />
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
