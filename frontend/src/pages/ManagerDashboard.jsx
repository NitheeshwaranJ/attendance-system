import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { fetchTeamAttendance } from "../redux/attendanceSlice";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const [summary, setSummary] = useState(null);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    loadSummary();
    loadToday();
    dispatch(fetchTeamAttendance());
    // eslint-disable-next-line
  }, []);

  const loadSummary = async () => {
    try {
      const res = await API.get("/attendance/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadToday = async () => {
    try {
      const res = await API.get("/attendance/today-status");
      setTodayCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    window.location.href = `${API.defaults.baseURL}/attendance/export`;
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Total Records</div>
          <div style={{ fontSize: 20 }}>{summary ? summary.total : "-"}</div>
        </div>

        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Present</div>
          <div style={{ fontSize: 20 }}>{summary ? summary.present : "-"}</div>
        </div>

        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Late</div>
          <div style={{ fontSize: 20 }}>{summary ? summary.late : "-"}</div>
        </div>

        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Today</div>
          <div style={{ fontSize: 20 }}>{todayCount}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/manager/all-attendance"><button>View All Attendance</button></Link>
        <Link to="/manager/team-calendar"><button>Team Calendar</button></Link>
        <button onClick={exportCSV}>Export CSV</button>
      </div>
    </div>
  );
}
