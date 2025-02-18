import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Static credentials
  const users = {
    "SC-TSE0001": { role: "Employee", dashboard: "/employee/dashboard" },
    "RAJD0691": { role: "Dealer", dashboard: "/dealer/dashboard" },
    "MDD0001": { role: "MDD", dashboard: "/mdd/dashboard" },
  };

  const handleLogin = () => {
    if (users[username] && password === "123456") {
      const userData = { username, role: users[username].role };
      login(userData);
      navigate(users[username].dashboard);
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter ID"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
