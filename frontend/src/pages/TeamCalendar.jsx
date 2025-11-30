import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../api/axios";

export default function TeamCalendar() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/attendance/all");
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const getTileContent = ({ date: tileDate }) => {
    const formatted = formatDate(tileDate);
    const todays = records.filter(r => r.date === formatted);
    if (!todays.length) return null;

    const counts = todays.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    return (
      <div style={{ fontSize: 12 }}>
        {counts.Present ? <div>✅ {counts.Present}</div> : null}
        {counts.Late ? <div>⚠️ {counts.Late}</div> : null}
        {counts["Half-Day"] ? <div>🟦 {counts["Half-Day"]}</div> : null}
        {counts.Absent ? <div>❌ {counts.Absent}</div> : null}
      </div>
    );
  };

  return (
    <div>
      <h2>Team Calendar</h2>
      <Calendar value={date} onChange={setDate} tileContent={getTileContent} />
    </div>
  );
}
