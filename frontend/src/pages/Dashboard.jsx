import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyAttendance, checkIn, checkOut } from "../redux/attendanceSlice";
import API from "../api/axios";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { records, loading } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();

  const [monthly, setMonthly] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyAttendance());
    fetchMonthly();
    fetchToday();
    // eslint-disable-next-line
  }, [dispatch]);

  const fetchMonthly = async () => {
    try {
      const res = await API.get("/attendance/my-monthly-summary");
      setMonthly(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchToday = async () => {
    try {
      const res = await API.get("/attendance/my-history");
      const today = new Date().toISOString().split("T")[0];
      const rec = res.data.find((r) => r.date === today);
      setTodayRecord(rec || null);
    } catch (err) {
      console.error(err);
    }
  };

  const onCheckIn = async () => {
    setActionLoading(true);
    try {
      await dispatch(checkIn()).unwrap();
      fetchMonthly();
      fetchToday();
    } catch (err) {
      alert(err || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const onCheckOut = async () => {
    setActionLoading(true);
    try {
      await dispatch(checkOut()).unwrap();
      fetchMonthly();
      fetchToday();
    } catch (err) {
      alert(err || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h2>{user.name}'s Dashboard</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <div>
          <strong>Today:</strong> {new Date().toLocaleDateString()}
        </div>

        <div>
          {!todayRecord ? (
            <button onClick={onCheckIn} disabled={actionLoading} style={{ padding: "8px 12px" }}>
              {actionLoading ? "Processing..." : "Check In"}
            </button>
          ) : (
            <span>Checked in at: {todayRecord.checkInTime ? new Date(todayRecord.checkInTime).toLocaleTimeString() : "-"}</span>
          )}
        </div>

        <div>
          <button onClick={onCheckOut} disabled={!todayRecord || todayRecord.checkOutTime || actionLoading} style={{ padding: "8px 12px" }}>
            {actionLoading ? "Processing..." : "Check Out"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Present</div>
          <div style={{ fontSize: 20 }}>{monthly ? monthly.present : "-"}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Late</div>
          <div style={{ fontSize: 20 }}>{monthly ? monthly.late : "-"}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Half-Day</div>
          <div style={{ fontSize: 20 }}>{monthly ? monthly.halfDay : "-"}</div>
        </div>
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: "#666" }}>Absent</div>
          <div style={{ fontSize: 20 }}>{monthly ? monthly.absent : "-"}</div>
        </div>
      </div>

      <h3>Recent attendance</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f7f7f7" }}>
            <tr>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Check In</th>
              <th style={{ padding: 8 }}>Check Out</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 10).map((r) => (
              <tr key={r._id}>
                <td style={{ padding: 8 }}>{r.date}</td>
                <td style={{ padding: 8 }}>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}</td>
                <td style={{ padding: 8 }}>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}</td>
                <td style={{ padding: 8 }}>{r.status}</td>
                <td style={{ padding: 8 }}>{r.totalHours || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
