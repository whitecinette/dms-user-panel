import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import config from "../../config"; // Import backend config
import "./style.scss"; // Import styles

const backend_url = config.backend_url; // Get backend URL from config

const Login = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Role-based dashboard mapping
  const roleDashboard = {
    employee: "/employee/dashboard/",
    dealer: "/dealer/dashboard/",
    mdd: "/mdd/dashboard/",
    hr: "/hr/hr-dashboard/",
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/app/user/login`, {
        code,
        password,
      });

      console.log("API Response:", response.data);

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        const user = response.data.user;
        const name = user.name;
        const role = user.role.toLowerCase();

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        const dashboardPath = roleDashboard[role];

        if (dashboardPath) {
          navigate(dashboardPath);
        } else {
          alert("Invalid Role");
        }
      } else {
        setError(
          response.response?.data?.message || "Login failed. Please try again."
        );
        setTimeout(() => {
          setError(null);
        }, 3000); // Clear error message after 3 seconds
      }
    } catch (err) {
      console.error("Login failed:", err);
      // alert(err.response?.data?.message || "Login failed. Please try again.");
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setTimeout(() => {
        setError(null);
      }, 3000); // Clear error message after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="login-card"
      >
        <img src="/sc.jpg" alt="Company Logo" className="login-logo" />
        <h2>Welcome !</h2>
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
        {/*
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
         */}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
