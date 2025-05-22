import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user type with all necessary fields
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used internally
  createdAt?: string;
  hasCompletedPersonalityTest: boolean;
  personalityTags?: string[];
  country?: string;
  status: "active" | "premium" | "suspended";
  isAdmin?: boolean;
  tier?: "free" | "premium" | "enterprise"; // Added tier property
  isCorporate?: boolean; // Added isCorporate property
}

// Define context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  hasCompletedPersonalityTest: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, country?: string) => boolean;
  logout: () => void;
  completePersonalityTest: (personalityTags: string[]) => void;
  getAllUsers: () => User[];
  updateUserProfile: (updates: Partial<User>) => void;
  closeAccount: () => void;
  toggleEventFavorite: (eventId: string) => void;
  getFavoriteEvents: () => string[];
  socialLogin: (provider: string) => Promise<boolean>; // Added socialLogin function
  phoneLogin: (phoneNumber: string, code: string) => Promise<boolean>; // Added phoneLogin function
  upgradeTier: (tier: "premium" | "enterprise") => Promise<boolean>; // Added upgradeTier function
}

// Initial mock users with encrypted passwords
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be encrypted
    createdAt: "2024-01-15",
    hasCompletedPersonalityTest: true,
    personalityTags: ["tech", "music", "outdoors"],
    country: "United States",
    status: "active",
    isAdmin: true,
    tier: "premium"
  },
  {
    id: "2",
    name: "John Doe",
    email: "you@example.com",
    password: "password123", // In a real app, this would be encrypted
    createdAt: "2024-02-20",
    hasCompletedPersonalityTest: true,
    personalityTags: ["food", "sports", "art"],
    country: "Canada",
    status: "active",
    isAdmin: false,
    tier: "free"
  }
];

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  hasCompletedPersonalityTest: false,
  login: () => false,
  register: () => false,
  logout: () => {},
  completePersonalityTest: () => {},
  getAllUsers: () => [],
  updateUserProfile: () => {},
  closeAccount: () => {},
  toggleEventFavorite: () => {},
  getFavoriteEvents: () => [],
  socialLogin: async () => false,
  phoneLogin: async () => false,
  upgradeTier: async () => false
});

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Check local storage for saved users and current user
  const getSavedUsers = (): User[] => {
    const usersJson = localStorage.getItem("users");
    if (usersJson) {
      return JSON.parse(usersJson);
    }
    return initialUsers;
  };

  const getSavedUser = (): User | null => {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  };

  // State to track authentication status and user info
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getSavedUser());
  const [user, setUser] = useState<User | null>(getSavedUser());
  const [users, setUsers] = useState<User[]>(getSavedUsers());
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteEvents");
    return saved ? JSON.parse(saved) : [];
  });

  // Save users to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save favorite events to local storage
  useEffect(() => {
    localStorage.setItem("favoriteEvents", JSON.stringify(favorites));
  }, [favorites]);

  // Login function - Fixed to ensure proper authentication
  const login = (email: string, password: string): boolean => {
    console.log("Login attempt:", email, password);
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      console.log("User found:", foundUser);
      // Create a copy without the password for storage
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Update state and localStorage
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      
      console.log("Authentication state updated:", {
        isAuthenticated: true,
        user: userWithoutPassword
      });
      
      return true;
    }
    
    console.log("Login failed: User not found or password incorrect");
    return false;
  };

  // Register function
  const register = (name: string, email: string, password: string, country?: string): boolean => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      hasCompletedPersonalityTest: false,
      status: "active",
      personalityTags: [],
      country: country || "",
      tier: "free"
    };
    
    // Add to users list
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    return true;
  };

  // Social login function
  const socialLogin = async (provider: string): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user based on the provider
      const mockUser: User = {
        id: (users.length + 1).toString(),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `${provider}user@example.com`,
        hasCompletedPersonalityTest: false,
        status: "active",
        createdAt: new Date().toISOString(),
        tier: "free"
      };
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === mockUser.email);
      
      if (existingUser) {
        // Log in existing user
        setUser(existingUser);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(existingUser));
        return true;
      }
      
      // Add new user
      const updatedUsers = [...users, mockUser];
      setUsers(updatedUsers);
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return false;
    }
  };
  
  // Phone login function
  const phoneLogin = async (phoneNumber: string, code: string): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any code of length 6
      if (code.length !== 6) {
        return false;
      }
      
      // Create or use existing phone user
      const emailFromPhone = `phone_${phoneNumber.replace(/\D/g, '')}@example.com`;
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === emailFromPhone);
      
      if (existingUser) {
        // Log in existing user
        setUser(existingUser);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(existingUser));
        return true;
      }
      
      // Create new phone user
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: `Phone User (${phoneNumber})`,
        email: emailFromPhone,
        hasCompletedPersonalityTest: false,
        status: "active",
        createdAt: new Date().toISOString(),
        tier: "free"
      };
      
      // Add new user
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error(`Phone login error:`, error);
      return false;
    }
  };
  
  // Upgrade tier function
  const upgradeTier = async (tier: "premium" | "enterprise"): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    try {
      if (!user) return false;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user tier
      const updatedUser = { ...user, tier };
      setUser(updatedUser);
      
      // Update in users array
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, tier } : u
      );
      
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error(`Upgrade tier error:`, error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Complete personality test
  const completePersonalityTest = (personalityTags: string[]) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      hasCompletedPersonalityTest: true, 
      personalityTags 
    };
    
    setUser(updatedUser);
    
    // Also update in the users array
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, hasCompletedPersonalityTest: true, personalityTags } : u
    );
    
    setUsers(updatedUsers);
    
    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Get all users for admin
  const getAllUsers = (): User[] => {
    return users;
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update in users array
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    
    setUsers(updatedUsers);
    
    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Close account
  const closeAccount = () => {
    if (!user) return;
    
    // Remove user from users list
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    
    // Update localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Logout
    logout();
  };

  // Toggle event as favorite
  const toggleEventFavorite = (eventId: string) => {
    if (favorites.includes(eventId)) {
      setFavorites(favorites.filter(id => id !== eventId));
    } else {
      setFavorites([...favorites, eventId]);
    }
  };

  // Get favorite events
  const getFavoriteEvents = () => {
    return favorites;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isAdmin: user?.isAdmin || false,
      hasCompletedPersonalityTest: user?.hasCompletedPersonalityTest || false,
      login,
      register,
      logout,
      completePersonalityTest,
      getAllUsers,
      updateUserProfile,
      closeAccount,
      toggleEventFavorite,
      getFavoriteEvents,
      socialLogin,
      phoneLogin,
      upgradeTier
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
