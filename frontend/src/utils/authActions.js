import API from "../api/axios";
import { setUser } from "../redux/authSlice";

export const loginUser = async (dispatch, email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token); // save token
    dispatch(setUser({ user: res.data.user, token: res.data.token }));
    return res.data.user.role; // return role for redirect
  } catch (err) {
    alert(err.response.data.message || "Login failed");
  }
};
