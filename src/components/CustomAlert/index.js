import React from "react";
import "./style.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

const CustomAlert = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="mui-alert-icon success" />;
      case "error":
        return <ErrorIcon className="mui-alert-icon error" />;
      case "warning":
        return <WarningIcon className="mui-alert-icon warning" />;
      default:
        return <InfoIcon className="mui-alert-icon info" />;
    }
  };

  return (
    <div className={`custom-alert ${type}`} role="alert">
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close alert"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
