import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import "./style.scss";
import { UAParser } from "ua-parser-js";

const backend_url = config.backend_url;

const Login = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const getPersistentWebDeviceId = () => {
    const STORAGE_KEY = "webDeviceId";

    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) return existing;

      const seed = [
        "web",
        navigator.userAgent || "",
        navigator.platform || "",
        window.screen?.width || "",
        window.screen?.height || "",
        Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        Date.now(),
        Math.random().toString(36).slice(2),
      ].join("|");

      const generated = btoa(unescape(encodeURIComponent(seed))).replace(/=+$/, "");
      localStorage.setItem(STORAGE_KEY, generated);
      return generated;
    } catch (err) {
      console.error("Error generating web device id:", err);
      return `web-fallback-${Date.now()}`;
    }
  };

  const getWebDeviceInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();

    return {
      brand: result.device.vendor || "Web",
      model: result.device.model || result.browser.name || "Browser",
      os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
      appVersion: config.appVersion || "web-1.0.0",
    };
  };

  const handleCodeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const webDeviceId = getPersistentWebDeviceId();
      const deviceInfo = getWebDeviceInfo();

      const response = await axios.post(
        `${backend_url}/app/user/login`,
        {
          code: code.trim().toUpperCase(),
          password,
          androidId: webDeviceId,
          deviceInfo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Client-Type": "user",
          },
        }
      );

      const data = response?.data || {};

      if (data.needsApproval === true) {
        const status = String(data.deviceStatus || "pending").toLowerCase();

        if (status === "blocked") {
          setError("This device/browser is blocked. Please contact admin.");
        } else {
          setInfoMessage("Device approval required. Please contact admin or wait for approval.");
        }
        return;
      }

      if (response.status === 200 && data.token && data.user) {
        const { token, user, refreshToken } = data;

        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        localStorage.setItem("role", user.role || "");
        localStorage.setItem("code", user.code || "");
        localStorage.setItem("name", user.name || "");
        localStorage.setItem("position", user.position || "");
        localStorage.setItem("userId", user.id || "");
        localStorage.setItem("toolpad-mode", "light");
        localStorage.setItem("toolpad-color-scheme-dark", "light");

        
        navigate("/app/employee/dashboard", { replace: true });
        return;
      }

      setError(data.message || "Login failed. Please try again.");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleCodeLogin} className="login-card">
        <img src="/sc.jpg" alt="Company Logo" className="login-logo" />

        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Login to continue securely with device approval and active session protection.
        </p>

        <div className="login-input-group">
          <label className="login-label">Employee / User Code</label>
          <input
            type="text"
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="login-input"
            autoComplete="username"
          />
        </div>

        <div className="login-input-group">
          <label className="login-label">Password</label>
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input login-input-password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {!error && infoMessage && <div className="info-message">{infoMessage}</div>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="login-note">
          This browser will be treated as your device for approval on web.
        </div>
      </form>
    </div>
  );
};

export default Login;