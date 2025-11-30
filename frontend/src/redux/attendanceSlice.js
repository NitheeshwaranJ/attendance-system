import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

export const fetchMyAttendance = createAsyncThunk("attendance/fetchMyAttendance", async (_, thunkAPI) => {
  try {
    const res = await API.get("/attendance/my-history");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const checkIn = createAsyncThunk("attendance/checkIn", async (_, thunkAPI) => {
  try {
    const res = await API.post("/attendance/checkin");
    return res.data.record;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const checkOut = createAsyncThunk("attendance/checkOut", async (_, thunkAPI) => {
  try {
    const res = await API.post("/attendance/checkout");
    return res.data.record;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchTeamAttendance = createAsyncThunk("attendance/fetchTeam", async (_, thunkAPI) => {
  try {
    const res = await API.get("/attendance/all");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: { records: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyAttendance.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => { state.loading = false; state.records = action.payload; })
      .addCase(fetchMyAttendance.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(checkIn.fulfilled, (state, action) => { state.records.unshift(action.payload); })
      .addCase(checkOut.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.records[index] = action.payload;
      })
      .addCase(fetchTeamAttendance.fulfilled, (state, action) => { state.records = action.payload; });
  },
});

export default attendanceSlice.reducer;
