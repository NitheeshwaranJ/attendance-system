import React, { useState } from "react";
import { useSelector } from "react-redux";
import API from "../api/axios";

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await API.put("/auth/update-profile", { name, email });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleUpdate}>Update</button>
      {message && <p>{message}</p>}
    </div>
  );
}
