import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import Profile from "./pages/Profile";
import AttendanceHistory from "./pages/AttendanceHistory";
import AllAttendance from "./pages/AllAttendance";
import TeamCalendar from "./pages/TeamCalendar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "20px auto", background: "#fff", padding: 20, borderRadius: 8 }}>
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === "manager" ? "/manager" : "/dashboard"} /> : <Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="employee">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/history"
            element={
              <ProtectedRoute role="employee">
                <AttendanceHistory />
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

          {/* Manager protected */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/all-attendance"
            element={
              <ProtectedRoute role="manager">
                <AllAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/team-calendar"
            element={
              <ProtectedRoute role="manager">
                <TeamCalendar />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}
