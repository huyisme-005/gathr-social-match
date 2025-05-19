
/**
 * NotFound Page
 * 
 * This component is displayed when a user navigates to a route that doesn't exist.
 * It provides a simple 404 error message and a link back to the home page.
 * It also logs the attempted route to the console for debugging purposes.
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // Get current location information
  const location = useLocation();

  // Log the 404 error to the console for debugging
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
