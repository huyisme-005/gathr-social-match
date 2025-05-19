
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto pb-16 px-4 pt-4">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default MainLayout;
