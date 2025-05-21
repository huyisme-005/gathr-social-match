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


// User type definition
interface User {
  id: string;                          // Unique identifier for the user
  name: string;                        // User's display name
  email: string;                       // User's email address
  hasCompletedPersonalityTest?: boolean; // Whether the user has completed the personality test
  personalityTags?: string[];           // User's personality traits from the test
  phoneNumber?: string;                // User's phone number (optional)
  country?: string;                    // User's selected country (optional)
  authProvider?: string;               // Authentication provider used (email, google, facebook, phone)
  tier?: "free" | "premium" | "enterprise"; // User subscription tier
  isCorporate?: boolean;               // Whether this is a corporate account
  isAdmin?: boolean;                   // Whether this user is a platform admin
}

// User credentials for sign up and login
interface UserCredentials {
  name?: string; // Optional for login
  email: string;
  password: string;
}

// AuthContext type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedPersonalityTest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, country?: string) => Promise<void>;
  socialLogin: (provider: "google" | "facebook" | "twitter") => Promise<void>;
  phoneLogin: (phoneNumber: string, verificationCode: string) => Promise<void>;
  logout: () => void;
  completePersonalityTest: (personalityTags: string[]) => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  upgradeTier: (tier: "premium" | "enterprise") => Promise<void>;
  isAdmin: boolean;
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
  // Admin status
  const [isAdmin, setIsAdmin] = useState(false);
  
  /**
   * Check for existing user session on load
   * In a real app, this would verify a JWT token with the backend
   */
  useEffect(() => {
    // First check local storage for saved user data
    const storedUser = localStorage.getItem("gathr_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Check if this is an admin account
        if (parsedUser.isAdmin) {
          setIsAdmin(true);
        }
        
        // In a real app, we would verify the token with the backend here
        // and refresh the user data from the database
      } catch (e) {
        localStorage.removeItem("gathr_user");
      }
    }
    setIsLoading(false);
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
  const login = async (email: string, password: string) => {
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
      throw error;
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
  
  /**
   * Logout function - clears the current user session
   */
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
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
        hasCompletedPersonalityTest: personalityTags.length > 0,
        personalityTags,
      };
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
  const upgradeTier = async (tier: "premium" | "enterprise") => {
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

  // Register function - creates a new user account
  const register = async (name: string, email: string, password: string, country?: string) => {
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
        name,
        email,
        hasCompletedPersonalityTest: false,
        personalityTags: [],
        country: country || "United States",
        authProvider: "email",
        tier: "free"
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
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create the context value object
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    hasCompletedPersonalityTest: user?.hasCompletedPersonalityTest || false,
    login,
    register,
    socialLogin,
    phoneLogin,
    logout,
    completePersonalityTest,
    updateUserProfile,
    upgradeTier,
    isAdmin
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

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
