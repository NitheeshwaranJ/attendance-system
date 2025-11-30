const Attendance = require("../models/Attendance");
const { Parser } = require("json2csv");

// CHECK-IN
exports.checkIn = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const date = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({ employeeId, date });
    if (record) return res.status(400).json({ message: "Already checked in today" });

    record = await Attendance.create({
      employeeId,
      date,
      checkInTime: new Date().toISOString(),
    });

    res.json({ message: "Checked in successfully", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK-OUT
exports.checkOut = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const date = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({ employeeId, date });
    if (!record) return res.status(400).json({ message: "You have not checked in today" });
    if (record.checkOutTime) return res.status(400).json({ message: "Already checked out today" });

    const checkIn = new Date(record.checkInTime);
    const checkOut = new Date();
    const hours = (checkOut - checkIn) / 1000 / 60 / 60;

    let status = "Present";
    const lateThreshold = new Date(record.date + "T09:30:00");
    if (checkIn > lateThreshold) status = "Late";
    if (hours < 4) status = "Half-Day";

    record.checkOutTime = checkOut.toISOString();
    record.totalHours = hours.toFixed(2);
    record.status = status;
    await record.save();

    res.json({ message: "Checked out successfully", record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MY ATTENDANCE HISTORY
exports.myAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MY MONTHLY SUMMARY
exports.myMonthlySummary = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const records = await Attendance.find({ employeeId, date: { $gte: monthStart, $lte: monthEnd } });

    const summary = {
      present: records.filter(r => r.status === "Present").length,
      absent: records.filter(r => r.status === "Absent").length,
      late: records.filter(r => r.status === "Late").length,
      halfDay: records.filter(r => r.status === "Half-Day").length,
      totalDays: records.length,
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ATTENDANCE (MANAGER)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("employeeId", "name email role");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SPECIFIC EMPLOYEE (MANAGER)
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TEAM SUMMARY (MANAGER)
exports.getTeamSummary = async (req, res) => {
  try {
    const records = await Attendance.find();
    const summary = {
      total: records.length,
      present: records.filter(r => r.status === "Present").length,
      absent: records.filter(r => r.status === "Absent").length,
      late: records.filter(r => r.status === "Late").length,
      halfDay: records.filter(r => r.status === "Half-Day").length,
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EXPORT CSV (MANAGER)
exports.exportAttendanceCSV = async (req, res) => {
  try {
    const records = await Attendance.find().populate("employeeId", "name email role");
    const fields = ["employeeId.name", "employeeId.email", "date", "checkInTime", "checkOutTime", "status", "totalHours"];
    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TODAY STATUS
exports.todayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const records = await Attendance.find({ date: today }).populate("employeeId", "name email");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
