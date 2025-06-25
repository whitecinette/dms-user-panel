import React, { useState, useEffect } from "react";
import "./style.scss";
import config from "../../config";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { FaRoute, FaWpforms } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const backendSocketUrl = config.backend_url;

const NotificationAlert = () => {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io(backendSocketUrl, {
      withCredentials: true,
      query: { token },
    });

    socket.on("connect", () => {
      setConnectionStatus("connected");
      const userId = localStorage.getItem("userId");
      if (userId) {
        socket.emit("join", userId);
      }
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", (err) => {
      setConnectionStatus("error");
      console.error("Socket.IO connection error:", err.message);
      // Retry connection after 5 seconds
      setTimeout(() => {
        socket.connect();
      }, 5000);
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data.notification]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNotificationClick = (notification) => {
    try {
      if (notification.title === "Route Plan") {
        const [name, startDate, endDate] = notification.filters;
        navigate(
          `/routePlan?search=${encodeURIComponent(
            name
          )}&startDate=${startDate}&endDate=${endDate}`
        );
      } else if (notification.title === "Leave Request") {
        const [code, startDate, endDate] = notification.filters;
        navigate(
          `/leaveApplication?search=${encodeURIComponent(
            code
          )}&startDate=${startDate}&endDate=${endDate}`
        );
      }
    } catch (error) {
      console.error("Error in handleNotificationClick:", error);
    } finally {
      handleClose(null, notification._id);
    }
  };

  const getNotificationIcon = (title) => {
    if (title === "Route Plan") {
      return <FaRoute className="icon" />;
    } else if (title === "Leave Request") {
      return <FaWpforms className="icon" />;
    }
    return null;
  };

  const handleClose = async (e, id) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await axios.put(
        `${backendSocketUrl}/mark/notification`,
        {
          userId: localStorage.getItem("userId"),
          notificationIds: [id],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const formatDate = (dateInput) => {
    const datePart = dateInput?.slice(0, 10); // "YYYY-MM-DD"
    if (!datePart) return "N/A";

    const [year, month, day] = datePart.split("-");
    const dateObj = new Date(year, month - 1, day);

    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate || "N/A";
  };

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div
          className={`notification-item ${notification.title.toLowerCase()}`}
          key={notification._id || index}
          onClick={() => handleNotificationClick(notification)}
        >
          <div className="notification-content">
            <div className="notification-header">
              <h3>
                {getNotificationIcon(notification.title)}
                {notification.title}
              </h3>
              <button
                className="close-button"
                onClick={(e) => handleClose(e, notification._id)}
                title="Mark as read"
              >
                <IoMdClose />
              </button>
            </div>
            <p className="message">{notification.message}</p>
            <div className="notification-details">
              <span className="code">
                {notification.targetCodes?.join(", ")}
              </span>
              <span className="timestamp">
                {formatDate(notification.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationAlert;