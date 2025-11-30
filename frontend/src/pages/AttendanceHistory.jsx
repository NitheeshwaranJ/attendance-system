import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api/axios";

const AttendanceHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchAttendanceHistory = async () => {
    setLoading(true);
    try {
      const res = await API.get("/attendance/my-history");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAttendanceHistory();
  }, [token]);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const getTileContent = ({ date: tileDate }) => {
    const formatted = formatDate(tileDate);
    const entry = records.find((r) => r.date === formatted);
    if (!entry) return null;

    const statusColors = {
      Present: "green",
      Absent: "red",
      Late: "orange",
      "Half-Day": "blue",
    };

    const shortText = {
      Present: "P",
      Absent: "A",
      Late: "L",
      "Half-Day": "H",
    };

    return (
      <div
        title={entry.status}
        style={{
          backgroundColor: statusColors[entry.status],
          color: "white",
          borderRadius: "50%",
          textAlign: "center",
          width: "24px",
          height: "24px",
          lineHeight: "24px",
          margin: "0 auto",
        }}
      >
        {shortText[entry.status]}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto" }}>
      <h2>My Attendance Calendar</h2>

      {loading ? (
        <p>Loading attendance...</p>
      ) : (
        <>
          <Calendar value={date} onChange={setDate} tileContent={getTileContent} />

          <h3 style={{ marginTop: "30px" }}>Detailed Attendance Records</h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f3f3f3" }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Check-In</th>
                <th style={thStyle}>Check-Out</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Total Hours</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                    No attendance data found
                  </td>
                </tr>
              ) : (
                records.map((r, index) => (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td style={tdStyle}>{r.date}</td>
                    <td style={tdStyle}>{r.checkIn || "-"}</td>
                    <td style={tdStyle}>{r.checkOut || "-"}</td>
                    <td style={tdStyle}>{r.status}</td>
                    <td style={tdStyle}>{r.totalHours || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// Table styling
const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default AttendanceHistory;
