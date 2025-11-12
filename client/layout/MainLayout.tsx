import React from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;

