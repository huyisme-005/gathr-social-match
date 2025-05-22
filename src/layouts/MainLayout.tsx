
/**
 * MainLayout Component
 * 
 * This component provides the common layout for all main application pages.
 * It includes:
 * - Header component at the top
 * - Main content area with proper padding
 * - BottomNavbar component for mobile navigation
 * - Automatic padding to accommodate the bottom navbar
 */
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";

const MainLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="flex-1 p-4 pb-24">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default MainLayout;
