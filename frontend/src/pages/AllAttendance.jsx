import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function AllAttendance() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState({ employee: "", status: "", from: "", to: "" });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadAll();
    loadEmployees();
    // eslint-disable-next-line
  }, []);

  const loadAll = async (q = {}) => {
    try {
      const res = await API.get("/attendance/all");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEmployees = async () => {
    // No employee list endpoint in backend — we can derive from records or create a small endpoint.
    try {
      const res = await API.get("/attendance/all");
      const emps = Array.from(new Map(res.data.map(r => [r.employeeId._id, r.employeeId])).values());
      setEmployees(emps);
    } catch (err) { }
  };

  const applyFilter = () => {
    const { employee, status, from, to } = filter;
    let filtered = [...records];

    if (employee) filtered = filtered.filter(r => r.employeeId._id === employee);
    if (status) filtered = filtered.filter(r => r.status === status);
    if (from) filtered = filtered.filter(r => r.date >= from);
    if (to) filtered = filtered.filter(r => r.date <= to);

    setRecords(filtered);
  };

  const reset = async () => {
    setFilter({ employee: "", status: "", from: "", to: "" });
    await loadAll();
    await loadEmployees();
  };

  return (
    <div>
      <h2>All Attendance</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select value={filter.employee} onChange={(e) => setFilter({ ...filter, employee: e.target.value })}>
          <option value="">All employees</option>
          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
        </select>

        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All status</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Half-Day">Half-Day</option>
          <option value="Absent">Absent</option>
        </select>

        <input type="date" value={filter.from} onChange={(e) => setFilter({ ...filter, from: e.target.value })} />
        <input type="date" value={filter.to} onChange={(e) => setFilter({ ...filter, to: e.target.value })} />

        <button onClick={applyFilter}>Apply</button>
        <button onClick={reset}>Reset</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f7f7f7" }}>
          <tr>
            <th style={{ padding: 8 }}>Employee</th>
            <th style={{ padding: 8 }}>Date</th>
            <th style={{ padding: 8 }}>Check In</th>
            <th style={{ padding: 8 }}>Check Out</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Hours</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r._id}>
              <td style={{ padding: 8 }}>{r.employeeId?.name || "-"}</td>
              <td style={{ padding: 8 }}>{r.date}</td>
              <td style={{ padding: 8 }}>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}</td>
              <td style={{ padding: 8 }}>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}</td>
              <td style={{ padding: 8 }}>{r.status}</td>
              <td style={{ padding: 8 }}>{r.totalHours || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
