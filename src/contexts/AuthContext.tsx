/**
 * AuthContext
 * 
 * This context provides authentication state and functions throughout the application.
 * It handles user login, registration, logout, and personality test completion.
 * Supports email/password, social media, and phone authentication methods.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import gathrApi from "../api/gathrApi";

// User data structure
interface User {
  id: string;                          // Unique identifier for the user
  name: string;                        // User's display name
  email: string;                       // User's email address
  personalityTags?: string[];           // User's personality traits from the test
  isAdmin?: boolean;                   // Whether this user is a platform admin
  tier?: string;                       // User subscription tier
  isCorporate?: boolean;               // Whether this is a corporate account
  hasCompletedPersonalityTest?: boolean; // Whether the user has completed the personality test
  country?: string;                   // User's country
  authProvider?: string;              // Authentication provider (e.g., email, google, facebook)
  phoneNumber?: string;                // User's phone number
}

// User credentials for sign up and login
interface UserCredentials {
  name?: string; // Optional for login
  email: string;
  password: string;
}

// Context type definition
interface AuthContextType {
  user: User | null;                   // Current user data or null if not logged in
  isAuthenticated: boolean;            // Whether the user is authenticated
  isAdmin: boolean;                    // Whether the current user is a platform admin
  hasCompletedPersonalityTest: boolean; // Whether the user has completed the personality test
  completePersonalityTest: (traits: string[]) => void; // Function to save personality test results
  upgradeTier: (tier: string) => void; // Function to upgrade subscription tier
  socialLogin: (provider: string) => void; // Function for social login
  phoneLogin: (phoneNumber: string, code?: string) => Promise<void>; // Function for phone login
  login: (credentials: UserCredentials) => Promise<boolean>; // Function to log in
  register: (credentials: UserCredentials) => Promise<boolean>; // Function to register
  logout: () => void;                  // Function to log out
  updateUser: (userData: Partial<User>) => void; // Function to update user profile
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: () => {},
});

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

// Hardcoded admin user for testing
const ADMIN_EMAIL = "admin@gathrapplication.com";

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.email === ADMIN_EMAIL);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);
  
  /**
   * Save user data to local storage whenever it changes
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem("gathr_user", JSON.stringify(user));
    }
  }, [user]);
  
  /**
   * Login function - authenticates user credentials
   * In a real app, this would call a backend API endpoint
   */
  const login = async ({ email, password }: UserCredentials): Promise<boolean> => {
    try {
      // Simulating API call - in a real app, this would call the gathrApi.auth.login
      // Wait for backend to be implemented
      if (email === "demo@gathr.com" && password === "password") {
        const demoUser: User = {
          id: "1",
          name: "Demo User",
          email: "demo@gathr.com",
          hasCompletedPersonalityTest: false,
          personalityTags: [],
          country: "United States",
          authProvider: "email",
          tier: "free"
        };
        setUser(demoUser);
        
        toast({
          title: "Login successful",
          description: "Welcome to Gathr!",
        });
        return true;
      } else if (email === "admin@gathr.com" && password === "adminpass") {
        // Demo platform owner/admin account
        const adminUser: User = {
          id: "admin1",
          name: "Admin User",
          email: "admin@gathr.com",
          hasCompletedPersonalityTest: true,
          personalityTags: ["analytical", "organized"],
          country: "United States",
          authProvider: "email",
          tier: "enterprise",
          isAdmin: true
        };
        setUser(adminUser);
        setIsAdmin(true);
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the Gathr admin platform!",
        });
        return true;
      } else {
        // Check if this is a stored account
        const storedAccounts = localStorage.getItem("gathr_accounts") || "[]";
        const accounts = JSON.parse(storedAccounts);
        
        const foundAccount = accounts.find((acc: any) => 
          acc.email === email && acc.password === password
        );
        
        if (foundAccount) {
          // Clone the account without the password field for security
          const { password, ...userWithoutPassword } = foundAccount;
          setUser(userWithoutPassword);
          
          toast({
            title: "Login successful",
            description: "Welcome back to Gathr!",
          });
          return true;
        } else {
          throw new Error("Invalid credentials");
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  /**
   * Register function - creates a new user account
   * In a real app, this would call a backend API endpoint
   */
  const register = async ({ name, email, password }: UserCredentials): Promise<boolean> => {
    try {
      // Check if account already exists
      const storedAccounts = localStorage.getItem("gathr_accounts") || "[]";
      const accounts = JSON.parse(storedAccounts);
      
      if (accounts.some((acc: any) => acc.email === email)) {
        throw new Error("Email already registered");
      }
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name || "New User",
        email,
        hasCompletedPersonalityTest: false,
        personalityTags: [],
        country: "United States", // Default country if not specified
        authProvider: "email",
        tier: "free" // Default to free tier
      };
      // Store in accounts list (with password) for future logins
      const accountToStore = { ...newUser, password };
      localStorage.setItem("gathr_accounts", JSON.stringify([...accounts, accountToStore]));
      // Set as current user (without password)
      setUser(newUser);
      toast({
        title: "Registration successful",
        description: "Welcome to Gathr!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };
  
  /**
   * Social login function - authenticates with social media providers
   * In a real app, this would use OAuth with the provider
   */
  const socialLogin = async (provider: string) => {
    try {
      // Simulate social login
      const socialUser: User = {
        id: `${provider}_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.example.com`,
        hasCompletedPersonalityTest: false,
        personalityTags: [],
        authProvider: provider,
        tier: "free"
      };
      
      setUser(socialUser);
      
      toast({
        title: "Social login successful",
        description: `You've logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`,
      });
    } catch (error) {
      toast({
        title: "Social login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  /**
   * Phone login function - authenticates with phone number and verification code
   * In a real app, this would send a verification code via SMS
   */
  const phoneLogin = async (phoneNumber: string, verificationCode?: string) => {
    try {
      // In a real app, verify the code with a backend service
      if (verificationCode !== "123456") {
        throw new Error("Invalid verification code");
      }
      
      const phoneUser: User = {
        id: `phone_${Date.now()}`,
        name: "Phone User",
        email: `${phoneNumber.replace(/\D/g, '')}@phone.gathr.com`, // Generate email from phone
        phoneNumber,
        hasCompletedPersonalityTest: false,
        personalityTags: [],
        authProvider: "phone",
        tier: "free"
      };
      
      setUser(phoneUser);
      
      toast({
        title: "Phone login successful",
        description: "You've logged in with your phone number!",
      });
    } catch (error) {
      toast({
        title: "Phone login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      toast({
        title: "Personality test completed",
        description: "Your profile has been updated with your personality traits",
      });
    }
  };
  
  /**
   * Update user profile function - updates user data
   * In a real app, this would save to a backend API
   */
  const updateUserProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...data
      };
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }
  };
  
  /**
   * Upgrade subscription tier function
   * In a real app, this would process payment and update subscription in database
   */
  const upgradeTier = async (tier: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        tier
      };
      setUser(updatedUser);
      
      toast({
        title: "Subscription upgraded",
        description: `You've successfully upgraded to the ${tier} tier!`,
      });
    }
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    hasCompletedPersonalityTest: user?.hasCompletedPersonalityTest || false,
    completePersonalityTest,
    upgradeTier,
    socialLogin,
    phoneLogin,
    login,
    register,
    logout,
    updateUser: updateUserProfile,
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
