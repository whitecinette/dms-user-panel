import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { NavLink } from "react-router-dom";
import "./attendance.scss";

const backend_url = config.backend_url;

const Attendance = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [availableStatuses, setAvailableStatuses] = useState(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Retrieve saved date or set default
  const storedDate = localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(storedDate);

  useEffect(() => {
    fetchEmpThroughActorCode();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    console.log("Employee Data:", employeeData);
    console.log("Attendance Data:", attendanceData);
  }, [employeeData, attendanceData]);

  const fetchEmpThroughActorCode = async () => {
    try {
      const response = await axios.get(`${backend_url}/actorCode/get-actorCode-for-admin`);
      setEmployeeData(response.data.employeeList || []);
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setEmployeeData([]);
    }
  };

  const fetchAttendance = async (date) => {
    try {
      console.log("Fetching attendance for:", date);
      setAttendanceData([]);
      setAvailableStatuses(new Set());

      const response = await axios.get(`${backend_url}/get-attendance-by-date/${date}`);
      console.log("API Response:", response.data);

      if (!response.data || !Array.isArray(response.data.attendance)) {
        console.error("Invalid response format:", response);
        return;
      }

      const attendanceList = response.data.attendance;
      setAttendanceData(attendanceList);

      const statuses = new Set(attendanceList.map((record) => record.status));
      setAvailableStatuses(statuses);
    } catch (err) {
      console.error("Failed to fetch attendance data:", err);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate); // 🔹 Save selected date
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses((prevStatuses) => {
      const newStatuses = new Set(prevStatuses);
      if (newStatuses.has(status)) {
        newStatuses.delete(status);
      } else {
        newStatuses.add(status);
      }
      return newStatuses;
    });
  };

  const filteredEmployees = attendanceData
    .map((attendanceRecord) => {
      const employee = employeeData.find(emp => emp.employee_code === attendanceRecord.code);
      return {
        code: attendanceRecord.code,
        name: employee ? employee.employee_name : "Unknown",
        status: attendanceRecord.status
      };
    })
    .filter(employee => {
      const matchesSearch =
        employee.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(employee.status);

      return matchesSearch && matchesStatus;
    });

  return (
    <div style={{ padding: "20px" }}>
      <h3>Employee List For Attendance</h3>

      <input
        type="text"
        placeholder="Search by Name or Code"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{
          margin: "10px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <div className="status-dropdown">
        <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
          Filter by Status ⏷
        </button>

        {isOpen && availableStatuses.size > 0 && (
          <div className="dropdown-menu">
            {[...availableStatuses].map((status) => (
              <label key={status}>
                <input
                  type="checkbox"
                  checked={selectedStatuses.has(status)}
                  onChange={() => handleStatusChange(status)}
                />
                {status}
              </label>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxHeight: "450px", overflow: "scroll" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#6399f9",
                color: "white",
                position: "sticky",
                top: "-1px",
              }}
            >
              <th>S. No</th>
              <th>EMPLOYEE_CODE</th>
              <th>NAME</th>
              <th>STATUS</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <tr key={employee.employee_code} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{index + 1}</td>
                  <td>{employee.code}</td>
                  <td>{employee.name}</td>
                  <td>{employee.status}</td>
                  <td>
                    <NavLink
                      to={`/attendance-detail/${employee.code}`}
                      state={{ employeeName: employee.name }}
                    >
                      <button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          padding: "3px 8px",
                          cursor: "pointer",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                      >
                        View
                      </button>
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
