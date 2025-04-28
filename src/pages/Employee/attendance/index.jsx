import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import config from "../../../config";

const { backend_url } = config;

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, halfDay: 0 });
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    leaveDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const code = "RAJF001423";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/get-attandance/${code}`);
        console.log("Full API Response:", response.data);
        
        setAttendance(response.data.attendance);
        console.log("Attendance Data:", response.data.attendance);
        
        setSummary(response.data.summary);
      } catch (err) {
        setError("Error fetching attendance data");
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaveRecords = async () => {
      try {
        const response = await axios.get(`${backend_url}/get-emp-leave/${code}`);
        console.log("Leave Records:", response.data.data);
        
        setLeaveRecords(response.data.data);
      } catch (err) {
        console.error("Error fetching leave records:", err);
      }
    };

    fetchAttendance();
    fetchLeaveRecords();
  }, []);

  const handleLeaveRequest = async () => {
    if (isSubmitting) return;

    const isConfirmed = window.confirm("Are you sure you want to request leave?");
    if (!isConfirmed) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${backend_url}/request-leave/${code}`,
        leaveData
      );
      console.log("Leave request response:", response.data);

      alert("Leave requested successfully!");
      setShowLeaveModal(false);

      // Refresh leave records after requesting leave
      const updatedLeaveRecords = await axios.get(`${backend_url}/get-emp-leave/${code}`);
      setLeaveRecords(updatedLeaveRecords.data.data);
    } catch (err) {
      console.error("Error requesting leave:", err.response?.data || err.message);
      alert(`Failed to request leave: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-container">
        <div className="header">
          <div>
            <h1>Employee Attendance</h1>
            <p>View attendance records and request leave here</p>
          </div>
          {/* <h2>Attendance Summary</h2> */}
          <button className="request-leave-btn" onClick={() => setShowLeaveModal(true)}>
            Request Leave
          </button>
        </div>
        {summary && (
  <div className="status-emp">
    <div>Present: <span className="present">{summary.present}</span></div>
    <div>Absent: <span className="absent">{summary.absent}</span></div>
    <div>Half-Day: <span className="halfday">{summary.halfDay}</span></div>
    <div>Pending: <span className="pending">{summary.halfDay}</span></div>
  </div>
)}


        {/* Attendance Records Table */}
        <h3>Attendance Records</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  {attendance.map((record) => (
    <tr key={record._id}>
      <td>{new Date(record.date).toLocaleString()}</td> {/* Show Date & Time */}
      <td
        style={{
          color:
            record.status === "Present"
              ? "green"
              : record.status === "Absent"
                ? "red"
                : "orange",
          fontWeight: "bold",
        }}
      >
        {record.status}
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {/* Leave Records Table */}
        <h3>Leave Records</h3>
        <table>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Description</th>
              <th>Days</th>
              <th>Leave Status</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {leaveRecords.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.leaveType}</td>
                <td>{leave.leaveDescription}</td>
                <td>{leave.leaveDays}</td>
                <td
                  style={{
                    color:
                      leave.leaveStatus === "Approved"
                        ? "green"
                        : leave.leaveStatus === "Pending"
                          ? "orange"
                          : "red",
                    fontWeight: "bold",
                  }}
                >
                  {leave.leaveStatus}
                </td>
                <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Leave Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Request Leave</h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="date"
                value={leaveData.startDate}
                onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
              />
              <input
                type="date"
                value={leaveData.endDate}
                onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
              />
            </div>
            <select
              value={leaveData.leaveType}
              onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
            >
              <option value="">Select Leave Type</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Paid">Paid Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
            <textarea
              placeholder="Leave Description"
              value={leaveData.leaveDescription}
              onChange={(e) => setLeaveData({ ...leaveData, leaveDescription: e.target.value })}
            ></textarea>
            <div>
              <button className="submit-btn" onClick={handleLeaveRequest} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button className="cancel-btn" onClick={() => setShowLeaveModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
