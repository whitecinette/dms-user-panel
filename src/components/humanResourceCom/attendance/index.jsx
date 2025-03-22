import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { NavLink } from "react-router-dom";

const backend_url = config.backend_url;

const Attendance = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());

  useEffect(() => {
    fetchEmpThroughActorCode();
    fetchAttendance();
  }, []);

  const fetchEmpThroughActorCode = async () => {
    try {
      const response = await axios.get(`${backend_url}/actorCode/get-actorCode-for-admin`);
      setEmployeeData(response.data.employeeList || []);
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setEmployeeData([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${backend_url}/get-all-attendance`);
      const allAttendance = response.data.attendance || [];

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter records only for today
      const todayAttendance = allAttendance.filter((record) => record.date === today);

      setAttendanceData(todayAttendance);
    } catch (err) {
      console.error("Failed to fetch attendance data:", err);
      setAttendanceData([]);
    }
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

  const filteredEmployees = employeeData.filter((employee) => {
    const matchesSearch =
      employee.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase());

    const attendanceRecord = attendanceData.find((record) => record.code === employee.employee_code);
    const employeeStatus = attendanceRecord ? attendanceRecord.status : "Pending";

    const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(employeeStatus);

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
        style={{ marginBottom: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      <div style={{ marginBottom: "10px" }}>
        {["Present", "Absent", "Half Day", "Pending"].map((status) => (
          <label key={status} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              value={status}
              checked={selectedStatuses.has(status)}
              onChange={() => handleStatusChange(status)}
            />
            {status}
          </label>
        ))}
      </div>

      <div style={{ maxHeight: "450px", overflow: "scroll" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#6399f9", color: "white", position: "sticky", top: "-1px" }}>
              <th>EMPLOYEE_CODE</th>
              <th>NAME</th>
              <th>STATUS</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => {
                const attendanceRecord = attendanceData.find((record) => record.code === employee.employee_code);
                const employeeStatus = attendanceRecord ? attendanceRecord.status : "Pending";

                return (
                  <tr key={employee.employee_code} style={{ borderBottom: "1px solid #ddd" }}>
                    <td>{employee.employee_code}</td>
                    <td>{employee.employee_name}</td>
                    <td>{employeeStatus}</td>
                    <td>
                      <NavLink
                        to={`/attendance-detail/${employee.employee_code}`}
                        state={{ employeeName: employee.employee_name }}
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
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
