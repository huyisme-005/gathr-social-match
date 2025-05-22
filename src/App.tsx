
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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import React from 'react'; // Add explicit React import

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
import Subscription from "./pages/Subscription";
import AdminDashboard from "./pages/AdminDashboard";
import ExplorePage from "./pages/ExplorePage";
import FavoritesPage from "./pages/FavoritesPage";
import TicketsPage from "./pages/TicketsPage";
import EventDetail from "./pages/EventDetail";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

// Create a client for React Query
const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

/**
 * App component - the main entry point of the application
 */
const App: React.FC = () => (
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
                <Route 
                  path="/personality-test" 
                  element={
                    <ProtectedRoute>
                      <PersonalityTest />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* Main App Routes - wrapped in MainLayout with bottom nav */}
              <Route element={<MainLayout />}>
                <Route 
                  path="/find-events" 
                  element={
                    <ProtectedRoute>
                      <FindEvents />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/explore" 
                  element={
                    <ProtectedRoute>
                      <ExplorePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tickets" 
                  element={
                    <ProtectedRoute>
                      <TicketsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/event/:id" 
                  element={
                    <ProtectedRoute>
                      <EventDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-event" 
                  element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/upcoming-events" 
                  element={
                    <ProtectedRoute>
                      <UpcomingEvents />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gathr-circle" 
                  element={
                    <ProtectedRoute>
                      <GathrCircle />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/subscription" 
                  element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* Admin Dashboard - only accessible to admin users */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
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
