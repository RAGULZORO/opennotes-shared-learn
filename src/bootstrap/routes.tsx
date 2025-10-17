import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/pages/Home";
import BrowseNotes from "../features/notes/pages/BrowseNotes";
import Login from "../features/auth/pages/Login";
import UploadNote from "../features/notes/pages/UploadNote";
import AdminPanel from "../features/admin/pages/AdminPanel";
import Dashboard from "../features/notes/pages/Dashboard";
import NotFound from "../pages/not-found";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<BrowseNotes />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/upload" element={<UploadNote />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
