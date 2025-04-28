import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import config from "../../../config";
import CustomAlert from "../../../components/CustomAlert";
import "./style.scss";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const backendUrl = config.backend_url;

const GeoTagging = () => {
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [imageSrc, setImageSrc] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const webcamRef = useRef(null);

  // Fetch dealers on mount
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/get-dealer-by-employee`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setDealers(res.data.dealers || []);
      } catch (err) {
        showAlert("error", "Failed to fetch dealers.");
      }
    };
    fetchDealers();
  }, []);

  // Get location
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
  }, []);

  // Alert helper
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  // Capture image
  const captureImage = () => {
    const image = webcamRef.current.getScreenshot();
    if (!image) {
      showAlert("error", "Failed to capture image.");
      return;
    }
    setImageSrc(image);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!selectedDealer) {
      showAlert("error", "Please select a dealer.");
      return;
    }
    if (!imageSrc) {
      showAlert("error", "Please capture a photo.");
      return;
    }
    if (!location?.lat || !location?.lng) {
      showAlert("error", "Location not available.");
      return;
    }
    setLoading(true);
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], `geo-tag.jpg`, { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("code", selectedDealer.code || selectedDealer.dealerCode);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);
      formData.append("geotag_picture", file);
      const res = await axios.put(
        `${backendUrl}/update-geo-tag-lat-long`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      showAlert(
        "success",
        res.data?.message || "Geo-tag updated successfully!"
      );
      setImageSrc(null);
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Failed to update geo-tag."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="geo-tagging-container">
      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          margin: "auto",
          mt: 6,
          boxShadow: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            GeoTag Dealer Shop
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Autocomplete
            options={dealers}
            getOptionLabel={(option) => option.name || "n/a"}
            value={selectedDealer}
            onChange={(_, value) => setSelectedDealer(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Dealer" variant="outlined" />
            )}
            sx={{ width: "100%", mb: 2 }}
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />

          <FormControlLabel
            control={
              <Switch
                checked={cameraFacingMode === "user"}
                onChange={() =>
                  setCameraFacingMode(
                    cameraFacingMode === "user" ? "environment" : "user"
                  )
                }
                color="primary"
              />
            }
            label={cameraFacingMode === "user" ? "Front Camera" : "Back Camera"}
            sx={{ mb: 2 }}
          />

          {!imageSrc ? (
            <Box className="preview-container" sx={{ mb: 2 }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: cameraFacingMode }}
              className="geo-webcam"
              style={{ borderRadius: 8, width: "100%", marginBottom: 12 }}
            />
            </Box>
          ) : (
            <Box className="preview-container" sx={{ mb: 2 }}>
              <img
                src={imageSrc}
                alt="Captured"
                className="captured-image"
                style={{ borderRadius: 8, width: "100%" }}
              />
            </Box>
          )}

          {selectedDealer && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              {!imageSrc ? (
                <Button variant="contained" onClick={captureImage}>
                  Capture Photo
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => setImageSrc(null)}>
                  Retake Photo
                </Button>
              )}
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit GeoTag"}
              </Button>
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />
          <Box className="geo-location-info" sx={{ textAlign: "center" }}>
            {location ? (
              <>
                <Typography variant="body2" color="textSecondary">
                  Latitude: {location.lat} &nbsp; | &nbsp; Longitude:{" "}
                  {location.lng}
                </Typography>
                <Button size="small" onClick={getLocation} sx={{ mt: 1 }}>
                  Refresh Location
                </Button>
              </>
            ) : (
              <Typography variant="body2" color="error">
                Location not available.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GeoTagging;
