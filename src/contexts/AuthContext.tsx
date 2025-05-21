
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// User data structure
interface User {
  id: string;
  name: string;
  email: string;
  personalityTags?: string[];
  isAdmin?: boolean;
}

// User credentials for sign up and login
interface UserCredentials {
  name?: string; // Optional for login
  email: string;
  password: string;
}

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (credentials: UserCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  // User database in localStorage
  const getUsersFromStorage = (): Record<string, UserCredentials & { id: string }> => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : {};
  };

  const saveUsersToStorage = (users: Record<string, UserCredentials & { id: string }>) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Login function
  const login = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const users = getUsersFromStorage();
      const userRecord = Object.values(users).find(u => u.email === credentials.email);
      
      if (userRecord && userRecord.password === credentials.password) {
        // Create user object, but don't include password
        const { password, ...userWithoutPassword } = userRecord;
        
        // Set user state
        const loggedInUser = {
          // Ensure name is always present (fallback to empty string if missing)
          name: userWithoutPassword.name ?? "",
          email: userWithoutPassword.email,
          id: userWithoutPassword.id,
          personalityTags: ["Tech", "Education", "Development", "Design"],
          isAdmin: credentials.email === ADMIN_EMAIL
        };
        
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setIsAdmin(credentials.email === ADMIN_EMAIL);
        
        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register function
  const register = async (credentials: UserCredentials): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const users = getUsersFromStorage();
      
      // Check if email already exists
      if (Object.values(users).some(user => user.email === credentials.email)) {
        return false;
      }
      
      // Generate unique ID
      const userId = `user_${Date.now()}`;
      
      // Add user to "database"
      users[userId] = {
        ...credentials,
        id: userId,
      };
      
      // Save updated users
      saveUsersToStorage(users);
      
      // Auto login after registration
      return login(credentials);
    } catch (error) {
      console.error("Registration error:", error);
      return false;
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
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update users database if necessary
      const users = getUsersFromStorage();
      if (users[user.id]) {
        users[user.id] = { ...users[user.id], ...userData };
        saveUsersToStorage(users);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
