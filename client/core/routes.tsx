import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../modules/home/pages/Home";
import BrowseNotes from "../modules/notes/pages/BrowseNotes";
import Login from "../modules/auth/pages/Login";
import UploadNote from "../modules/notes/pages/UploadNote";
import AdminPanel from "../modules/admin/pages/AdminPanel";
import Dashboard from "../modules/notes/pages/Dashboard";
import NotFound from "./NotFound";

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

