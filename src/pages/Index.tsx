
/**
 * Index Page
 * 
 * This is the landing page of the application, shown to users who are not logged in.
 * It contains the Gathr logo, a brief description of the app, and buttons to login or register.
 * If the user is already authenticated, they are redirected to the appropriate page.
 * 
 * @author Huy Le (huyisme-005)
 * @organization Gathr
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import GathrLogo from "../components/GathrLogo";

const Index = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Get authentication state from context
  const { isAuthenticated, hasCompletedPersonalityTest } = useAuth();

  /**
   * Redirect authenticated users to the appropriate page
   * - New users who haven't completed the personality test: to the test page
   * - Returning users who have completed the test: to the find events page
   */
  useEffect(() => {
    if (isAuthenticated) {
      if (!hasCompletedPersonalityTest) {
        navigate("/personality-test");
      } else {
        navigate("/find-events");
      }
    }
  }, [isAuthenticated, hasCompletedPersonalityTest, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gathr-light p-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <GathrLogo />
        </div>
        <h1 className="text-4xl font-bold text-gathr-coral mb-2">Welcome to Gathr</h1>
        <p className="text-xl text-gray-600">Real events. Real connections.</p>
        <p className="mt-4 text-gray-600 max-w-md mx-auto">
          An AI-driven event platform that connects young professionals through curated events and personality-based matching.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={() => navigate("/login")}
          className="bg-gathr-coral hover:bg-gathr-coral/90 text-white"
        >
          Login
        </Button>
        <Button 
          onClick={() => navigate("/register")}
          variant="outline"
          className="border-gathr-coral text-gathr-coral hover:bg-gathr-coral/10"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Index;
