import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import attendanceReducer from "../redux/attendanceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
  },
});

export default store;
