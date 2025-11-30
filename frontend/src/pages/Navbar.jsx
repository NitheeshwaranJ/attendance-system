import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", background: "#0d6efd", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontWeight: 700 }}>Attendance System</div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {!user && (
          <>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff" }}>Register</Link>
          </>
        )}

        {user && user.role === "employee" && (
          <>
            <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
            <Link to="/attendance/history" style={{ color: "#fff" }}>My History</Link>
          </>
        )}

        {user && user.role === "manager" && (
          <>
            <Link to="/manager" style={{ color: "#fff" }}>Manager</Link>
            <Link to="/manager/all-attendance" style={{ color: "#fff" }}>All Attendance</Link>
            <Link to="/manager/team-calendar" style={{ color: "#fff" }}>Team Calendar</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/profile" style={{ color: "#fff" }}>{user.name}</Link>
            <button onClick={handleLogout} style={{ padding: "6px 10px", borderRadius: 4, background: "#ffc107", border: "none", cursor: "pointer" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
