
/**
 * Header Component
 * 
 * This component creates the header bar used across main pages of the application.
 * It contains the Gathr logo, account balance display, and logout button.
 */
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, CreditCard, Shield, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GathrLogo from "./GathrLogo";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.includes("/admin");
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const toggleAdminView = () => {
    if (isAdminPage) {
      navigate("/find-events");
    } else {
      navigate("/admin");
    }
  };
  
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {isAdminPage && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/find-events")}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to App</span>
            </Button>
          )}
          <GathrLogo />
        </div>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage alt={user.name} />
                  <AvatarFallback className="bg-gathr-coral text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate("/subscription")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Subscription</span>
                {user.tier && user.tier !== "free" && (
                  <span className="ml-auto text-xs bg-gathr-coral text-white rounded-full px-2 py-0.5">
                    {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                  </span>
                )}
              </DropdownMenuItem>
              
              {isAdmin && (
                <DropdownMenuItem onClick={toggleAdminView}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>{isAdminPage ? "Back to App" : "Admin Dashboard"}</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => {
                logout();
                navigate("/");
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
