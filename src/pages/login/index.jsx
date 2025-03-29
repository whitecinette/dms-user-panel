import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import config from "../../config"; // Import backend config
import "./style.scss"; // Import styles

const backend_url = config.backend_url; // Get backend URL from config

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role
  const [loading, setLoading] = useState(false);

  // Role-based dashboard mapping
  const roleDashboard = {
    employee: "/employee/dashboard",
    dealer: "/dealer/dashboard",
    mdd: "/mdd/dashboard",
    hr: "/hr-dashboard",
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/login-user`, {
        code,
        password,
        role,
      });

      console.log("API Response:", response.data);

      if (response.status === 200 && response.data.token) {
        const user = response.data.user; // Extract user details

        // Store user and token in context
        login({ ...user, token: response.data.token });

        // Redirect based on role
        const dashboardPath = roleDashboard[user.role.toLowerCase()];
        if (dashboardPath) {
          navigate(dashboardPath);
        } else {
          alert("Invalid Role");
        }
      } else {
        alert(response.data.message || "Invalid Credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/sc.jpg" alt="Company Logo" className="login-logo" />
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Please log in to continue</p>

        <input
          type="text"
          placeholder="Enter Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="login-input"
        >
          <option value="employee">Employee</option>
          <option value="dealer">Dealer</option>
          <option value="mdd">MDD</option>
          <option value="hr">HR</option>
        </select>

        <button onClick={handleLogin} className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
