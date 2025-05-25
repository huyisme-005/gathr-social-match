/**
 * @file AuthContext.tsx
 * @description This file defines the authentication context for the application.
 * It handles user authentication, registration, session management, profile updates,
 * and provides user-related data to components throughout the application.
 * User data and authentication state are persisted in localStorage.
 * @version 1.1.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * @interface User
 * @description Defines the structure for a user object within the application.
 */
export interface User {
  /** User's unique identifier. */
  id: string;
  /** User's full name. */
  name: string;
  /** User's email address, used for login and identification. */
  email: string;
  /** 
   * User's password. 
   * @internal This is only used during registration and login checks. 
   * It should never be stored in the 'currentUser' state that's exposed or persisted in localStorage for the current user without hashing (in a real app).
   * In this mock setup, it's stored in plaintext within the 'internalUsers' list for demo purposes.
   */
  password?: string;
  /** ISO string representing the date and time the user account was created. */
  createdAt?: string;
  /** Flag indicating if the user has completed their personality test. */
  hasCompletedPersonalityTest: boolean;
  /** Array of strings representing personality tags derived from the test. */
  personalityTags?: string[];
  /** User's country of residence. */
  country?: string;
  /** Current status of the user account. */
  status: "active" | "premium" | "suspended";
  /** Flag indicating if the user has administrative privileges. */
  isAdmin?: boolean;
  /** The subscription tier of the user. */
  tier?: "free" | "premium" | "enterprise";
  /** Flag indicating if the user account is a corporate account. */
  isCorporate?: boolean;
}

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context, including state and action dispatchers.
 */
interface AuthContextType {
  /** Indicates whether a user is currently authenticated. */
  isAuthenticated: boolean;
  /** 
   * The currently authenticated user object, or null if no user is logged in.
   * This user object will NOT contain the password.
   */
  user: User | null;
  /** Indicates if the currently authenticated user is an administrator. */
  isAdmin: boolean;
  /** Indicates if the currently authenticated user has completed the personality test. */
  hasCompletedPersonalityTest: boolean;
  /**
   * Attempts to log in a user with the given credentials.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {boolean} True if login is successful, false otherwise.
   */
  login: (email: string, password: string) => boolean;
  /**
   * Attempts to register a new user.
   * @param {string} name - The user's full name.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's chosen password.
   * @param {string} [country] - The user's country (optional).
   * @returns {boolean} True if registration is successful, false otherwise (e.g., email already exists).
   */
  register: (name: string, email: string, password: string, country?: string) => boolean;
  /** Logs out the currently authenticated user. */
  logout: () => void;
  /**
   * Marks the current user's personality test as complete and stores their personality tags.
   * @param {string[]} personalityTags - An array of personality tags.
   */
  completePersonalityTest: (personalityTags: string[]) => void;
  /**
   * Retrieves a list of all users in the system (without their passwords).
   * Intended for administrative purposes.
   * @returns {Omit<User, 'password'>[]} An array of user objects, with passwords omitted.
   */
  getAllUsers: () => Omit<User, 'password'>[];
  /**
   * Updates the profile of the currently authenticated user.
   * @param {Partial<Omit<User, 'password'>>} updates - An object containing the fields to update. Passwords cannot be updated via this method.
   */
  updateUserProfile: (updates: Partial<Omit<User, 'password'>>) => void;
  /** Closes the account of the currently authenticated user, removing them from the system. */
  closeAccount: () => void;
  /**
   * Toggles an event's favorite status for the current user.
   * @param {string} eventId - The ID of the event to toggle.
   */
  toggleEventFavorite: (eventId: string) => void;
  /**
   * Retrieves a list of event IDs that the current user has marked as favorite.
   * @returns {string[]} An array of favorite event IDs.
   */
  getFavoriteEvents: () => string[];
  /**
   * Handles social login (e.g., Google, Facebook).
   * This is a mock implementation.
   * @param {string} provider - The name of the social login provider (e.g., "google").
   * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
   */
  socialLogin: (provider: string) => Promise<boolean>;
  /**
   * Handles phone number based login.
   * This is a mock implementation.
   * @param {string} phoneNumber - The user's phone number.
   * @param {string} code - The verification code sent to the phone number.
   * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
   */
  phoneLogin: (phoneNumber: string, code: string) => Promise<boolean>;
  /**
   * Upgrades the subscription tier of the currently authenticated user.
   * @param {"premium" | "enterprise"} tier - The new tier to upgrade to.
   * @returns {Promise<boolean>} A promise that resolves to true if the upgrade is successful, false otherwise.
   */
  upgradeTier: (tier: "premium" | "enterprise") => Promise<boolean>;
}

/**
 * @const initialUsers
 * @description An array of predefined user objects for initializing the application.
 * Passwords are in plaintext for demonstration purposes only. In a real application,
 * passwords should be securely hashed.
 * @type {User[]}
 */
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
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
    password: "password123",
    createdAt: "2024-02-20",
    hasCompletedPersonalityTest: true,
    personalityTags: ["food", "sports", "art"],
    country: "Canada",
    status: "active",
    isAdmin: false,
    tier: "free"
  }
];

/**
 * Helper function to remove the password property from a user object.
 * This is used before storing user data in contexts or localStorage where the password is not needed.
 * @param {User} userObj - The user object, potentially containing a password.
 * @returns {Omit<User, 'password'>} The user object without the password property.
 */
const stripPassword = (userObj: User): Omit<User, 'password'> => {
  const { password, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

/**
 * Helper function to remove the password property from an array of user objects.
 * @param {User[]} usersArray - An array of user objects.
 * @returns {Omit<User, 'password'>[]} An array of user objects, each without the password property.
 */
const stripPasswordsFromUsers = (usersArray: User[]): Omit<User, 'password'>[] => {
    return usersArray.map(user => stripPassword(user));
}

/**
 * @const AuthContext
 * @description React context for authentication. Provides default values for the context type.
 * @type {React.Context<AuthContextType>}
 */
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

/**
 * @component AuthProvider
 * @description Provides authentication context to its children components.
 * Manages user state, authentication logic, and persistence to localStorage.
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Retrieves the list of all users (including their passwords for internal authentication) from localStorage.
   * If no users are found in localStorage, initializes with `initialUsers` and saves them.
   * @returns {User[]} An array of all user objects.
   */
  const getSavedInternalUsers = (): User[] => {
    const usersJson = localStorage.getItem("app_internal_users");
    if (usersJson) {
      try {
        return JSON.parse(usersJson);
      } catch (e) {
        console.error("Error parsing internal users from localStorage", e);
      }
    }
    // Fallback: save initial users if parsing fails or item doesn't exist
    localStorage.setItem("app_internal_users", JSON.stringify(initialUsers));
    return initialUsers;
  };

  /**
   * Retrieves the currently authenticated user's data (without password) from localStorage.
   * @returns {User | null} The current user object if found and parsed correctly, otherwise null.
   */
  const getSavedCurrentUser = (): User | null => { 
    const userJson = localStorage.getItem("app_current_user");
    if (userJson) {
      try {
        return JSON.parse(userJson); // This user object should already be password-stripped
      } catch (e) {
        console.error("Error parsing current user from localStorage", e);
        localStorage.removeItem("app_current_user"); // Clear potentially corrupted item
      }
    }
    return null;
  };

  /** 
   * State for all registered users, including their passwords. 
   * This is used for internal authentication checks (e.g., login).
   * Persisted in localStorage under "app_internal_users".
   * @type {[User[], React.Dispatch<React.SetStateAction<User[]>>]}
   */
  const [internalUsers, setInternalUsers] = useState<User[]>(getSavedInternalUsers());
  
  /** 
   * State for the currently logged-in user's data.
   * This object, when exposed via context or persisted, will NOT contain the password.
   * Persisted in localStorage under "app_current_user" (without password).
   * @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]}
   */
  const [currentUserData, setCurrentUserData] = useState<User | null>(getSavedCurrentUser());
  
  /** 
   * State indicating if a user is currently authenticated.
   * Derived from the presence of `currentUserData`.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentUserData);
  
  /** 
   * State for storing the IDs of events marked as favorite by the current user.
   * Persisted in localStorage under "app_favorite_events".
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
   */
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("app_favorite_events");
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Effect hook to persist the `internalUsers` list (which may contain passwords) to localStorage
   * whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem("app_internal_users", JSON.stringify(internalUsers));
  }, [internalUsers]);

  /**
   * Effect hook to persist `currentUserData` (always without password) to localStorage
   * whenever it changes. Also updates `isAuthenticated` state.
   */
  useEffect(() => {
    if (currentUserData) {
      localStorage.setItem("app_current_user", JSON.stringify(stripPassword(currentUserData)));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("app_current_user");
      setIsAuthenticated(false);
    }
  }, [currentUserData]);
  
  /**
   * Effect hook to persist the `favorites` list to localStorage whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem("app_favorite_events", JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Logs in a user by verifying their email and password against the `internalUsers` list.
   * Sets the `currentUserData` and `isAuthenticated` state upon successful login.
   * @param {string} email - The email of the user attempting to log in.
   * @param {string} passwordInput - The password provided by the user.
   * @returns {boolean} True if login is successful, false otherwise.
   */
  const login = (email: string, passwordInput: string): boolean => {
    const foundUserInInternalList = internalUsers.find(u => u.email === email && u.password === passwordInput);
    if (foundUserInInternalList) {
      setCurrentUserData(foundUserInInternalList); 
      // setIsAuthenticated(true); // Handled by useEffect on currentUserData
      return true;
    }
    return false;
  };

  /**
   * Registers a new user in the system.
   * Adds the new user to `internalUsers` and automatically logs them in by setting `currentUserData`.
   * @param {string} name - The full name of the new user.
   * @param {string} email - The email address for the new user (must be unique).
   * @param {string} passwordInput - The password for the new user.
   * @param {string} [country] - The country of the new user (optional).
   * @returns {boolean} True if registration is successful, false if the email already exists.
   */
  const register = (name: string, email: string, passwordInput: string, country?: string): boolean => {
    if (internalUsers.some(u => u.email === email)) {
      return false; // User already exists
    }
    
    const newUser: User = {
      id: (internalUsers.length > 0 ? Math.max(...internalUsers.map(u => parseInt(u.id))) + 1 : 1).toString(),
      name,
      email,
      password: passwordInput, 
      createdAt: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      hasCompletedPersonalityTest: false,
      status: "active",
      personalityTags: [],
      country: country || "",
      tier: "free",
      isAdmin: false,
      isCorporate: false
    };
    
    setInternalUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUserData(newUser); // Auto login
    // setIsAuthenticated(true); // Handled by useEffect on currentUserData
    return true;
  };

  /**
   * Simulates a social login process.
   * If a user with the mock social email exists, logs them in. Otherwise, creates a new mock user.
   * @param {string} provider - The name of the social media provider (e.g., "google", "facebook").
   * @returns {Promise<boolean>} A promise resolving to true on successful login/creation, false on error.
   */
  const socialLogin = async (provider: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockEmail = `${provider.toLowerCase()}user@example.com`;
      let userToLogin = internalUsers.find(u => u.email === mockEmail);

      if (!userToLogin) {
        userToLogin = {
          id: (internalUsers.length > 0 ? Math.max(...internalUsers.map(u => parseInt(u.id))) + 1 : 1).toString(),
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email: mockEmail,
          // No password for social logins in this mock setup
          hasCompletedPersonalityTest: false,
          status: "active",
          createdAt: new Date().toISOString().split('T')[0],
          tier: "free",
          isAdmin: false,
          isCorporate: false
        };
        setInternalUsers(prevUsers => [...prevUsers, userToLogin!]);
      }
      setCurrentUserData(userToLogin);
      // setIsAuthenticated(true); // Handled by useEffect
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return false;
    }
  };
  
  /**
   * Simulates a phone number based login process.
   * Validates a mock OTP. If a user with the mock phone-based email exists, logs them in.
   * Otherwise, creates a new mock user.
   * @param {string} phoneNumber - The user's phone number.
   * @param {string} code - The 6-digit verification code.
   * @returns {Promise<boolean>} A promise resolving to true on successful login/creation, false otherwise.
   */
  const phoneLogin = async (phoneNumber: string, code: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      if (code.length !== 6) return false; // Mock OTP validation
      
      const emailFromPhone = `phone_${phoneNumber.replace(/\D/g, '')}@example.com`;
      let userToLogin = internalUsers.find(u => u.email === emailFromPhone);

      if (!userToLogin) {
        userToLogin = {
          id: (internalUsers.length > 0 ? Math.max(...internalUsers.map(u => parseInt(u.id))) + 1 : 1).toString(),
          name: `Phone User (${phoneNumber})`,
          email: emailFromPhone,
          // No password for phone logins in this mock setup
          hasCompletedPersonalityTest: false,
          status: "active",
          createdAt: new Date().toISOString().split('T')[0],
          tier: "free",
          isAdmin: false,
          isCorporate: false
        };
        setInternalUsers(prevUsers => [...prevUsers, userToLogin!]);
      }
      setCurrentUserData(userToLogin);
      // setIsAuthenticated(true); // Handled by useEffect
      return true;
    } catch (error) {
      console.error(`Phone login error:`, error);
      return false;
    }
  };
  
  /**
   * Upgrades the subscription tier of the currently authenticated user.
   * Updates both `currentUserData` and the user's record in `internalUsers`.
   * @param {"premium" | "enterprise"} tier - The target subscription tier.
   * @returns {Promise<boolean>} A promise resolving to true on success, false if no user is logged in or on error.
   */
  const upgradeTier = async (tier: "premium" | "enterprise"): Promise<boolean> => {
    if (!currentUserData) return false;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create the fully updated user object first
      const fullyUpdatedUser = { ...currentUserData, tier };

      // Update the current user state
      setCurrentUserData(fullyUpdatedUser);
      
      // Update the user in the internalUsers list
      setInternalUsers(prevInternalUsers => 
        prevInternalUsers.map(u => 
          u.id === currentUserData.id ? fullyUpdatedUser : u
        )
      );
      return true;
    } catch (error) {
      console.error(`Upgrade tier error:`, error);
      return false;
    }
  };

  /**
   * Logs out the current user by clearing `currentUserData` and setting `isAuthenticated` to false.
   * The `useEffect` hook for `currentUserData` handles removal from localStorage.
   */
  const logout = () => {
    // setIsAuthenticated(false); // Handled by useEffect on currentUserData
    setCurrentUserData(null);
  };

  /**
   * Updates the current user's profile to indicate completion of the personality test
   * and stores the associated tags.
   * @param {string[]} personalityTags - An array of personality tags.
   */
  const completePersonalityTest = (personalityTags: string[]) => {
    if (!currentUserData) return;
    const updatedData = { hasCompletedPersonalityTest: true, personalityTags };
    const updatedUser = { ...currentUserData, ...updatedData };
    setCurrentUserData(updatedUser);
    setInternalUsers(prevUsers => prevUsers.map(u => u.id === currentUserData.id ? { ...u, ...updatedData } : u));
  };

  /**
   * Retrieves all registered users, with their passwords stripped.
   * This function is typically used for admin dashboards or user management sections.
   * @returns {Omit<User, 'password'>[]} An array of user objects, safe for display.
   */
  const getAllUsers = (): Omit<User, 'password'>[] => {
    return stripPasswordsFromUsers(internalUsers);
  };

  /**
   * Updates the profile of the currently authenticated user with the provided data.
   * Ensures that the password cannot be updated through this method.
   * @param {Partial<Omit<User, 'password'>>} updates - An object containing the user fields to update.
   */
  const updateUserProfile = (updates: Partial<Omit<User, 'password'>>) => {
    if (!currentUserData) return;
    // Explicitly exclude password from updates, even if Omit<User, 'password'> is used for type safety.
    const { password, ...safeUpdates } = updates as any; // Cast to any to allow destructuring password if it was mistakenly passed
    
    const updatedUser = { ...currentUserData, ...safeUpdates };
    setCurrentUserData(updatedUser);
    setInternalUsers(prevUsers => prevUsers.map(u => u.id === currentUserData.id ? { ...u, ...safeUpdates } : u));
  };

  /**
   * Closes the account of the currently authenticated user.
   * This removes the user from the `internalUsers` list and logs them out.
   */
  const closeAccount = () => {
    if (!currentUserData) return;
    setInternalUsers(prevUsers => prevUsers.filter(u => u.id !== currentUserData.id));
    logout(); 
  };

  /**
   * Toggles the favorite status of a given event ID for the current user.
   * Updates the `favorites` state, which is persisted to localStorage.
   * @param {string} eventId - The ID of the event to toggle.
   */
  const toggleEventFavorite = (eventId: string) => {
    setFavorites(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  /**
   * Retrieves the list of favorite event IDs for the current user.
   * @returns {string[]} An array of event IDs.
   */
  const getFavoriteEvents = () => favorites;

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user: currentUserData ? stripPassword(currentUserData) : null, // Always expose password-stripped user
      isAdmin: currentUserData?.isAdmin || false,
      hasCompletedPersonalityTest: currentUserData?.hasCompletedPersonalityTest || false,
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

/**
 * @function useAuth
 * @description Custom React hook to easily access the authentication context.
 * @returns {AuthContextType} The authentication context object.
 * @example
 * const { user, login, isAuthenticated } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);