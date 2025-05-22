
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import AuthHeader from "../components/AuthHeader";

const AuthLayout = () => {
  const { isAuthenticated, hasCompletedPersonalityTest } = useAuth();
  const location = useLocation();
  
  // Debug auth state
  useEffect(() => {
    console.log("AuthLayout auth state:", { 
      isAuthenticated, 
      hasCompletedPersonalityTest,
      currentPath: location.pathname 
    });
  }, [isAuthenticated, hasCompletedPersonalityTest, location.pathname]);
  
  // Redirect logic - Ensure this works correctly
  if (isAuthenticated) {
    if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register") {
      if (!hasCompletedPersonalityTest) {
        console.log("Redirecting to personality test");
        return <Navigate to="/personality-test" replace />;
      } else {
        console.log("Redirecting to find events");
        return <Navigate to="/find-events" replace />;
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AuthHeader />
      <main className="flex-1 container mx-auto flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
