import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import "./style.scss";

const backend_url = config.backend_url;

const Login = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("start"); // 'start' | 'otp'
  const [mode, setMode] = useState("code"); // 'code' | 'phone'
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const [error, setError] = useState("");

  const roleDashboard = {
    employee: "/employee/dashboard/",
    dealer: "/dealer/dashboard/",
    mdd: "/mdd/dashboard/",
    hr: "/hr/dashboard/",
  };




  const handleCodeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/app/user/login`, {
        code,
        password,
      });

      if (response.status === 200 && response.data.token) {
        const { token, user, refreshToken } = response.data;
        const role = user.role.toLowerCase();

        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("code", user.code);
        localStorage.setItem("name", user.name);
        localStorage.setItem("position", user.position);
        localStorage.setItem("toolpad-mode", "light");
        localStorage.setItem("toolpad-color-scheme-dark", "light");

        navigate(roleDashboard[role] || "/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/send-otp`, {
        phone,
      });

      if (response.data.success) {
        setSessionId(response.data.sessionId); // <-- store it
        setStep("otp");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP send failed:", err);
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };




  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/verify-otp`, {
        sessionId,
        otp,
        phone
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role.toLowerCase());
      localStorage.setItem("code", user.code);
      localStorage.setItem("name", user.name);
      localStorage.setItem("position", user.position);
      localStorage.setItem("toolpad-mode", "light");
      localStorage.setItem("toolpad-color-scheme-dark", "light");

      navigate("/mdd/dashboard/");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.response?.data?.message || "Invalid OTP or verification failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">

      <form
        onSubmit={
          mode === "code"
            ? handleCodeLogin
            : step === "otp"
              ? handleOTPVerify
              : handlePhoneSubmit
        }
        className="login-card"
      >
        <img src="/sc.jpg" alt="Company Logo" className="login-logo" />
        <h2>Welcome!</h2>
        <p className="login-subtitle">Please log in to continue</p>

              <div className="login-toggle">
                <button onClick={() => { setMode("code"); setStep("start"); }} disabled={mode === "code"}>Login with Code</button>
                <button onClick={() => { setMode("phone"); setStep("start"); }} disabled={mode === "phone"}>Login as Distributor</button>
              </div>

        {mode === "code" && (
          <>
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
          </>
        )}

        {mode === "phone" && step === "start" && (
          <input
            type="text"
            placeholder="Enter Phone (+91 6764533222)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="login-input"
          />
        )}

        {mode === "phone" && step === "otp" && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="login-input"
          />
        )}


        <button type="submit" className="login-btn" disabled={loading}>
          {loading
            ? "Processing..."
            : mode === "phone" && step === "otp"
            ? "Verify OTP"
            : "Login"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
