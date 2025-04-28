import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import config from "../../../config";
import "./style.scss";
import axios from "axios";
import CustomAlert from "../../../components/CustomAlert";

const backendUrl = config.backend_url;

const PunchInAndPunchOut = () => {
  const [date, setDate] = useState(new Date());
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [location, setLocation] = useState(null);
  const [isPunchingIn, setIsPunchingIn] = useState(false);
  const [isPunchingOut, setIsPunchingOut] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  //get Location
  const getLocation = () => {
    if (!navigator.geolocation) {
      showAlert("error", "Geolocation not supported by your browser.");
      setLocation(null);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("Current Position:", { latitude, longitude, accuracy });

        if (accuracy > 100) {
          console.warn(`Low accuracy: ${accuracy} meters`);
          showAlert(
            "warning",
            `Your location accuracy is low (${accuracy} meters). Try moving to a better signal or enabling GPS.`
          );
        }

        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
        });

        // Stop watching after getting a valid fix
        navigator.geolocation.clearWatch(watchId);
      },
      (error) => {
        console.error("Error getting location:", error);
        showAlert("error", "Location access denied or unavailable.");
        setLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const captureImage = () => {
    const image = webcamRef.current.getScreenshot();
    if (!image) {
      showAlert("error", "Failed to capture image. Please try again.");
      return;
    }
    setImageSrc(image);
  };

  const sendPunch = async (type) => {
    if (!imageSrc) {
      showAlert("error", "Please capture an image before punching.");
      return;
    }

    if (!location?.lat || !location?.lng) {
      showAlert(
        "error",
        "Location not available. Please enable location services."
      );
      return;
    }

    const setLoading = type === "in" ? setIsPunchingIn : setIsPunchingOut;
    setLoading(true);

    try {
      const blob = await (await fetch(imageSrc)).blob();
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
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });

      showAlert(
        "success",
        res.data.message || `Punch ${type === "in" ? "In" : "Out"} successful!`
      );
    } catch (err) {
      console.error("Error sending punch:", err);
      showAlert(
        "error",
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setImageSrc(null);
    }
  };

  return (
    <div className="punch-in-page">
      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}

      <div className="date-container">
        <span className="date">{date.toISOString().split("T")[0]}</span>
        <span className="time">
          {date.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!imageSrc ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
      ) : (
        <div className="preview-container">
          <img src={imageSrc} alt="Captured" className="captured-image" />
          <button onClick={() => setImageSrc(null)} className="recapture-btn">
            Retake Image
          </button>
        </div>
      )}

      <div className="capture-controls">
        {!imageSrc && (
          <button onClick={captureImage} className="capture-btn">
            Capture Image
          </button>
        )}
      </div>

      <div className="location-info">
        {location ? (
          <>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lng}</p>
            <button onClick={getLocation} className="refresh-location-btn">
              Refresh Location
            </button>
          </>
        ) : (
          <p>Location not available. Please enable location services.</p>
        )}
      </div>
      {imageSrc && (
        <div className="punch-in-page-buttons">
          <button
            onClick={() => sendPunch("in")}
            className="punch-in-button"
            disabled={isPunchingIn || !imageSrc}
          >
            {isPunchingIn ? "Punching In..." : "Punch In"}
          </button>
          <button
            onClick={() => sendPunch("out")}
            className="punch-out-button"
            disabled={isPunchingOut || !imageSrc}
          >
            {isPunchingOut ? "Punching Out..." : "Punch Out"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PunchInAndPunchOut;
