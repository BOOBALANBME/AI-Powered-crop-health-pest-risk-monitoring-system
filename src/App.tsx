import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./components/Auth";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const getUser = () => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("User parse error", e);
      return null;
    }
  };
  const user = getUser();
  const token = localStorage.getItem("token");

  if (!token || !user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  const [language, setLanguage] = useState("English");
  const [health, setHealth] = useState<string>("");

  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(JSON.stringify(data));
    } catch (e: any) {
      setHealth("Error: " + e.message);
    }
  };

  return (
    <BrowserRouter>
      <Layout language={language} setLanguage={setLanguage}>
        <Routes>
          <Route path="/login" element={<Auth language={language} />} />
          <Route path="/patient" element={
            <ProtectedRoute role="patient">
              <PatientDashboard language={language} />
            </ProtectedRoute>
          } />
          <Route path="/doctor" element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard language={language} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
