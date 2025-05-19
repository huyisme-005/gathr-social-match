
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import AuthHeader from "../components/AuthHeader";

const AuthLayout = () => {
  const { isAuthenticated, hasCompletedPersonalityTest } = useAuth();
  const location = useLocation();
  
  // Redirect logic
  if (isAuthenticated && location.pathname !== "/personality-test") {
    return <Navigate to="/find-events" />;
  }
  
  if (isAuthenticated && !hasCompletedPersonalityTest && location.pathname !== "/personality-test") {
    return <Navigate to="/personality-test" />;
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
