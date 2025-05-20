
/**
 * App Component
 * 
 * This is the root component of the application. It sets up:
 * - Global providers (QueryClient, Auth, Tooltips, Toasts)
 * - Routing configuration
 * - Layouts for different sections of the app
 */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PersonalityTest from "./pages/auth/PersonalityTest";
import FindEvents from "./pages/FindEvents";
import CreateEvent from "./pages/CreateEvent";
import UpcomingEvents from "./pages/UpcomingEvents";
import Profile from "./pages/Profile";
import GathrCircle from "./pages/GathrCircle";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Create a client for React Query
const queryClient = new QueryClient();

/**
 * App component - the main entry point of the application
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              {/* Landing page route */}
              <Route path="/" element={<Index />} />
              
              {/* Auth Routes - wrapped in AuthLayout */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/personality-test" element={<PersonalityTest />} />
              </Route>
              
              {/* Main App Routes - wrapped in MainLayout with bottom nav */}
              <Route element={<MainLayout />}>
                <Route path="/find-events" element={<FindEvents />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/upcoming-events" element={<UpcomingEvents />} />
                <Route path="/gathr-circle" element={<GathrCircle />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Catch all - 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
