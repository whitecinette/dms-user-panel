import React, { useState } from "react";
import "./style.scss";
import EmployeeAttendance from "./EmployeeAttendance";
import HRAttendance from "./HRAttenadance/HRAttendance";

function Attendance() {
  const [view, setView] = useState("employee");
  return (
    <div className="Hr-attendance-page">
      <div className="attendance-header">
        <div className="attendance-header-buttons">
          <button
            className={view === "employee" ? "employee active" : ""}
            onClick={() => setView("employee")}
          >
            Employee Attendance
          </button>
          <button
            className={view === "Hr" ? "Hr active" : ""}
            onClick={() => setView("Hr")}
          >
            HR Attendance
          </button>
        </div>
      </div>
      {view === "employee" ? (
        <EmployeeAttendance />
      ) : (
        <HRAttendance />
      )}
    </div>
  );
}

export default Attendance;
