import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import config from "../../../config";
import CustomAlert from "../../../components/CustomAlert";
import "./style.scss";

const backendUrl = config.backend_url;

const PunchInAndPunchOut = () => {
  const webcamRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [imageSrc, setImageSrc] = useState(null);
  const [location, setLocation] = useState(null);

  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [punchInDisplayTime, setPunchInDisplayTime] = useState("");

  const [isPunchingIn, setIsPunchingIn] = useState(false);
  const [isPunchingOut, setIsPunchingOut] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const getStoredToken = () => {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) return null;

    // Avoid double Bearer if token already stored with it
    if (rawToken.startsWith("Bearer ")) return rawToken;
    return `Bearer ${rawToken}`;
  };

  const showAlert = useCallback((type, message) => {
    setAlert({ show: true, type, message });

    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  }, []);

  const format12HourTime = (input) => {
    try {
      if (!input) return "";
      const dt = new Date(input);
      if (Number.isNaN(dt.getTime())) return "";

      let hour = dt.getHours();
      const minute = String(dt.getMinutes()).padStart(2, "0");
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;

      return `${hour}:${minute} ${period}`;
    } catch {
      return "";
    }
  };

  const formatCurrentClock = (now) => {
    let hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute}:${second} ${period}`;
  };

  const currentTime = formatCurrentClock(date);
  const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      showAlert("error", "Geolocation is not supported by your browser.");
      setLocation(null);
      return;
    }

    setIsLoadingLocation(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
        });

        if (accuracy > 100) {
          showAlert(
            "warning",
            `Your location accuracy is low (${Math.round(
              accuracy
            )} meters). Try moving to a better signal or enabling GPS.`
          );
        }

        navigator.geolocation.clearWatch(watchId);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        showAlert("error", "Location access denied or unavailable.");
        setLocation(null);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [showAlert]);

  const loadTodayAttendanceStatus = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setHasPunchedIn(false);
      setPunchInDisplayTime("");
      return;
    }

    setIsLoadingStatus(true);

    try {
      const res = await axios.get(`${backendUrl}/today-status`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = res?.data || {};
      const attendance = data?.attendance || {};
      const punchIn = attendance?.punchIn ?? data?.punchIn ?? null;

      setHasPunchedIn(data?.hasPunchedIn === true);
      setPunchInDisplayTime(punchIn ? format12HourTime(punchIn) : "");
    } catch (error) {
      console.error("Failed to load today attendance status:", error);
      setHasPunchedIn(false);
      setPunchInDisplayTime("");
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    getLocation();
    loadTodayAttendanceStatus();

    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [getLocation, loadTodayAttendanceStatus]);

  const captureImage = () => {
    const image = webcamRef.current?.getScreenshot();

    if (!image) {
      showAlert("error", "Failed to capture image. Please try again.");
      return null;
    }

    setImageSrc(image);
    return image;
  };

  const normalizePunchResponse = (data) => {
    const isSuccess = data?.success === true;
    const isWarning = data?.warning === true;
    const statusCode = data?.statusCode ?? 200;

    if (!isSuccess || statusCode >= 400) {
      return {
        ok: false,
        warning: isWarning,
        message: data?.message || "Something went wrong.",
      };
    }

    return {
      ok: true,
      message: data?.message || "Success",
    };
  };

  const sendPunch = async (type) => {
    const token = getStoredToken();

    if (!token) {
      showAlert("error", "User is not authenticated.");
      return;
    }

    let finalImage = imageSrc;

    if (!finalImage) {
      finalImage = captureImage();
      if (!finalImage) {
        showAlert("warning", "Image is required. Please try again.");
        return;
      }
    }

    if (!location?.lat || !location?.lng) {
      showAlert(
        "error",
        "Location not available. Please ensure GPS/location is enabled."
      );
      return;
    }

    const setLoading = type === "in" ? setIsPunchingIn : setIsPunchingOut;
    setLoading(true);

    try {
      const blob = await (await fetch(finalImage)).blob();
      const file = new File([blob], `${type}-punch.jpg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append(type === "in" ? "punchInImage" : "punchOutImage", file);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);

      const endpoint = type === "in" ? "punch-in" : "punch-out";

      const res = await axios.post(`${backendUrl}/${endpoint}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      const result = normalizePunchResponse(res?.data || {});

      if (!result.ok) {
        showAlert(result.warning ? "warning" : "error", result.message);
        return;
      }

      showAlert("success", result.message);
      setImageSrc(null);

      // Same flow as Flutter: reload attendance status after successful action
      await loadTodayAttendanceStatus();
      getLocation();
    } catch (err) {
      console.error("Error sending punch:", err);
      showAlert(
        "error",
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (hasPunchedIn) {
      await sendPunch("out");
    } else {
      await sendPunch("in");
    }
  };

  const refreshPage = async () => {
    setIsRefreshing(true);
    setImageSrc(null);

    try {
      await Promise.all([loadTodayAttendanceStatus(), Promise.resolve(getLocation())]);
      setDate(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const openLeaveForm = () => {
    showAlert("info", "Connect your leave form modal here.");
  };

  const accentColor = hasPunchedIn ? "#16A34A" : "#2563EB";
  const accentLight = hasPunchedIn ? "#DCFCE7" : "#DBEAFE";

  const statusTitle = hasPunchedIn ? "You have punched in" : "Ready to check in";
  const statusSubtitle = hasPunchedIn
    ? punchInDisplayTime
      ? `Punched in at ${punchInDisplayTime}`
      : "Attendance active for today"
    : "Capture selfie and confirm your location";

  const primaryButtonLabel = hasPunchedIn ? "Check Out Now" : "Check In Now";
  const primaryLoading = hasPunchedIn ? isPunchingOut : isPunchingIn;

  return (
    <div className="punch-page">
      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}

      <div className="punch-page__header">
        <div>
          <h1>Attendance</h1>
          <p>Mark your attendance with selfie and live location</p>
        </div>

        <div className="punch-page__header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={refreshPage}
            disabled={isRefreshing}
            title="Refresh"
          >
            ↻
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={getLocation}
            disabled={isLoadingLocation}
            title="Refresh GPS"
          >
            ◎
          </button>
        </div>
      </div>

      <div
        className={`summary-card ${
          hasPunchedIn ? "summary-card--green" : "summary-card--blue"
        }`}
      >
        <div className="summary-card__top">
          <div className="summary-card__icon">
            {hasPunchedIn ? "✓" : "⏱"}
          </div>

          <div className="summary-card__text">
            <h2>{statusTitle}</h2>
            <p>{isLoadingStatus ? "Checking attendance status..." : statusSubtitle}</p>
          </div>
        </div>

        <div className="summary-card__metrics">
          <div className="metric-tile">
            <span className="metric-tile__label">Time</span>
            <strong className="metric-tile__value">{currentTime}</strong>
          </div>

          <div className="metric-tile">
            <span className="metric-tile__label">Date</span>
            <strong className="metric-tile__value">{currentDate}</strong>
          </div>
        </div>

        <div className="summary-card__location">
          <div className="summary-card__location-icon">📍</div>

          <div className="summary-card__location-text">
            {isLoadingLocation ? (
              <span>Fetching location...</span>
            ) : location ? (
              <>
                <span>
                  {location.lat}, {location.lng}
                </span>
                <small>Accuracy: {Math.round(location.accuracy || 0)}m</small>
              </>
            ) : (
              <span>Location not available</span>
            )}
          </div>
        </div>
      </div>

      <div className="camera-hero">
        <div
          className={`camera-hero__ring ${
            hasPunchedIn ? "camera-hero__ring--green" : "camera-hero__ring--blue"
          }`}
        >
          <div className="camera-hero__inner">
            {!imageSrc ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="camera-hero__webcam"
                />

                <div className="camera-hero__overlay" onClick={captureImage}>
                  <div className="camera-hero__camera-icon">📷</div>
                  <p>Tap to capture</p>
                </div>
              </>
            ) : (
              <img
                src={imageSrc}
                alt="Captured selfie"
                className="camera-hero__captured"
              />
            )}
          </div>
        </div>

        <div className="camera-hero__content">
          <h3>
            {imageSrc
              ? "Selfie captured successfully"
              : hasPunchedIn
              ? "You are checked in for today"
              : "Capture a clear selfie before punching"}
          </h3>

          <p>
            {imageSrc
              ? "You can retake your selfie below."
              : hasPunchedIn
              ? "You can now punch out when your work is done."
              : "Good lighting and clear face work best."}
          </p>
        </div>

        <div className="camera-hero__actions">
          {!imageSrc ? (
            <button type="button" className="secondary-btn" onClick={captureImage}>
              Capture Selfie
            </button>
          ) : (
            <button
              type="button"
              className="secondary-btn secondary-btn--muted"
              onClick={() => setImageSrc(null)}
            >
              Retake Selfie
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className={`primary-action-btn ${
          hasPunchedIn ? "primary-action-btn--red" : "primary-action-btn--green"
        }`}
        onClick={handlePrimaryAction}
        disabled={primaryLoading || isLoadingStatus}
      >
        {primaryLoading ? (
          <span>Processing...</span>
        ) : (
          <>
            <span className="primary-action-btn__icon">
              {hasPunchedIn ? "⇥" : "☑"}
            </span>
            <span>{primaryButtonLabel}</span>
          </>
        )}
      </button>

      <div className="quick-actions">
        <div
          className="mini-action-card mini-action-card--leave"
          onClick={openLeaveForm}
        >
          <div className="mini-action-card__icon">🗓</div>
          <div className="mini-action-card__content">
            <h4>Leave</h4>
            <p>Request now</p>
          </div>
        </div>
      </div>

      <div
        className="hint-card"
        style={{
          background: accentLight,
          borderColor: `${accentColor}22`,
        }}
      >
        <div className="hint-card__icon" style={{ color: accentColor }}>
          💡
        </div>
        <p>
          {hasPunchedIn
            ? "You have already punched in. Use the button above when you are ready to check out."
            : "Your selfie and GPS location will be used for attendance verification."}
        </p>
      </div>
    </div>
  );
};

export default PunchInAndPunchOut;