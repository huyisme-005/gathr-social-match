
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
}

// Define context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  hasCompletedPersonalityTest: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  completePersonalityTest: (personalityTags: string[]) => void;
  getAllUsers: () => User[];
  updateUserProfile: (updates: Partial<User>) => void;
  closeAccount: () => void;
  toggleEventFavorite: (eventId: string) => void;
  getFavoriteEvents: () => string[];
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
    isAdmin: true
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
    isAdmin: false
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

  // Login function
  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Create a copy without the password for storage
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  // Register function
  const register = (name: string, email: string, password: string): boolean => {
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
      personalityTags: []
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
