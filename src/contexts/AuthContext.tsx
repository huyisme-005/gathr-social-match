
/**
 * AuthContext
 * 
 * This context provides authentication state and functions throughout the application.
 * It handles user login, registration, logout, and personality test completion.
 * In a real app, this would interact with a backend API rather than using localStorage.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// User type definition
interface User {
  id: string;                          // Unique identifier for the user
  name: string;                        // User's display name
  email: string;                       // User's email address
  hasCompletedPersonalityTest: boolean; // Whether the user has completed the personality test
  personalityTags: string[];           // User's personality traits from the test
}

// AuthContext type definition
interface AuthContextType {
  user: User | null;                   // Current user data or null if not logged in
  isAuthenticated: boolean;            // Whether the user is authenticated
  hasCompletedPersonalityTest: boolean; // Whether the user has completed the personality test
  login: (email: string, password: string) => Promise<void>; // Function to log in
  register: (name: string, email: string, password: string) => Promise<void>; // Function to register
  logout: () => void;                  // Function to log out
  completePersonalityTest: (personalityTags: string[]) => void; // Function to save personality test results
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component to wrap the application and provide auth state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for the current user
  const [user, setUser] = useState<User | null>(null);
  // Loading state for initial auth check
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * Check for existing user session on load
   * In a real app, this would verify a JWT token with the backend
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("gathr_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("gathr_user");
      }
    }
    setIsLoading(false);
  }, []);
  
  /**
   * Login function - authenticates user credentials
   * In a real app, this would call a backend API endpoint
   */
  const login = async (email: string, password: string) => {
    try {
      // Simulating API call
      // In a real app, this would call your backend authentication service
      if (email === "demo@gathr.com" && password === "password") {
        const demoUser: User = {
          id: "1",
          name: "Demo User",
          email: "demo@gathr.com",
          hasCompletedPersonalityTest: false,
          personalityTags: [],
        };
        setUser(demoUser);
        localStorage.setItem("gathr_user", JSON.stringify(demoUser));
        toast({
          title: "Login successful",
          description: "Welcome to Gathr!",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  /**
   * Register function - creates a new user account
   * In a real app, this would call a backend API endpoint
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulating API call
      // In a real app, this would register the user with your backend
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        hasCompletedPersonalityTest: false,
        personalityTags: [],
      };
      setUser(newUser);
      localStorage.setItem("gathr_user", JSON.stringify(newUser));
      toast({
        title: "Registration successful",
        description: "Welcome to Gathr!",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  /**
   * Logout function - clears the current user session
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("gathr_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  /**
   * Complete personality test function - updates user profile with personality tags
   * In a real app, this would save the results to a backend API
   */
  const completePersonalityTest = (personalityTags: string[]) => {
    if (user) {
      const updatedUser = {
        ...user,
        hasCompletedPersonalityTest: true,
        personalityTags,
      };
      setUser(updatedUser);
      localStorage.setItem("gathr_user", JSON.stringify(updatedUser));
      
      toast({
        title: "Personality test completed",
        description: "Your profile has been updated with your personality traits",
      });
    }
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    hasCompletedPersonalityTest: user?.hasCompletedPersonalityTest || false,
    login,
    register,
    logout,
    completePersonalityTest,
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  // Provide the auth context to the entire app
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * This simplifies consuming the context in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
