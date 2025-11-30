const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: String, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  status: { type: String, enum: ["Present", "Absent", "Late", "Half-Day"], default: "Present" },
  totalHours: { type: Number, default: 0 },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
