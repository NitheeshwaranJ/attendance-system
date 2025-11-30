const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  myAttendance,
  myMonthlySummary,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendanceCSV,
  todayStatus
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my-history", protect, myAttendance);
router.get("/my-monthly-summary", protect, myMonthlySummary);
router.get("/today-status", protect, todayStatus);

router.get("/all", protect, authorize("manager"), getAllAttendance);
router.get("/employee/:id", protect, authorize("manager"), getEmployeeAttendance);
router.get("/summary", protect, authorize("manager"), getTeamSummary);
router.get("/export", protect, authorize("manager"), exportAttendanceCSV);

module.exports = router;
