
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedPersonalityTest: boolean;
  personalityTags: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedPersonalityTest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completePersonalityTest: (personalityTags: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on load
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
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("gathr_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
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

  const value = {
    user,
    isAuthenticated: !!user,
    hasCompletedPersonalityTest: user?.hasCompletedPersonalityTest || false,
    login,
    register,
    logout,
    completePersonalityTest,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
