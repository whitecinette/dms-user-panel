import React, { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci"; // Image icon
import config from "../../../config";
import axios from "axios";
import Table from "../../table";

const backend_url = config.backend_url;

const Attendance = () => {
  const [employeeData, setEmployeeData] = useState([]); // Store unique employees
  const [attendanceData, setAttendanceData] = useState([]); // Store attendance records
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee for viewing attendance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);

  // Fetch unique employees
  const fetchEmpThroughActorCode = async () => {
    try {
      const response = await axios.get(`${backend_url}/actorCode/get-actorCode-for-admin`);
      console.log("Fetched Employees:", response.data);
  
      // Extract employeeList from the response
      if (response.data && Array.isArray(response.data.employeeList)) {
        setEmployeeData(response.data.employeeList);
      } else {
        setEmployeeData([]); // Fallback to an empty array
      }
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setEmployeeData([]); // Ensure state remains an array even on failure
    }
  };
  

  // Fetch attendance data for a specific employee
  const fetchAttendance = async (code) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend_url}/get-all-attendance`);
      const { attendance } = response.data;
      console.log("Full Attendance API Response:", response.data);
      
      // Filter records for the selected employee
      const filteredData = attendance
        .filter((record) => record.code === code)
        .map((record) => ({
          _id: record._id,
          code: record.code,
          name: record.name,
          status: record.status,
          punchIn: record.punchIn,
          punchInImg: record.punchInImage,
          punchOutImg: record.punchOutImage,
          punchOut: record.punchOut,
          hoursWorked: record.hoursWorked,
        }));

      setAttendanceData(filteredData);
      console.log("Filtered Attendance Data:", filteredData);
      
    } catch (err) {
      setError("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpThroughActorCode(); // Fetch employees on mount
  }, []);

  // Function to handle View button click
  const handleViewAttendance = (code) => {
    setSelectedEmployee(code); // Store selected employee code
    fetchAttendance(code); // Fetch attendance for selected employee
  };

  const openImageModal = (imgUrl) => {
    setModalImage(imgUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Employee Table (Shows unique employees)
  const employeeTableData = {
    headers: ["EMPLOYEE_CODE", "NAME", "Details"],
    data: employeeData.map((employee) => ({
      EMPLOYEE_CODE: employee.employee_code,  // ✅ Correct key
      NAME: employee.employee_name,          // ✅ Correct key
      Details: (
        <button
          onClick={() => handleViewAttendance(employee.employee_code)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          View
        </button>
      ),
    })),
    currentPage: 1,
  };

  // Attendance Table (Displays attendance when an employee is selected)
  const attendanceTableData = {
    headers: ["Code", "Name", "Status", "Punch In", "Punch In Img", "Punch Out Img", "Punch Out", "Hours Worked"],
    data: attendanceData.map((row) => ({
      Code: row.code || "N/A",
      Name: row.name || "N/A",
      Status: row.status || "N/A",
      "Punch In": row.punchIn ? new Date(row.punchIn).toLocaleString() : "N/A",
      "Punch In Img": row.punchInImg ? (
        <CiImageOn size={20} style={{ cursor: "pointer" }} onClick={() => openImageModal(row.punchInImg)} />
      ) : "No Image",
      "Punch Out Img": row.punchOutImg ? (
        <CiImageOn size={20} style={{ cursor: "pointer" }} onClick={() => openImageModal(row.punchOutImg)} />
      ) : "No Image",
      "Punch Out": row.punchOut ? new Date(row.punchOut).toLocaleString() : "N/A",
      "Hours Worked": row.hoursWorked || "N/A",
    })),
    currentPage: 1,
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h3>Employee List For Attendance</h3>
      <Table data={employeeTableData} />

      {selectedEmployee && (
        <>
          <h3>Attendance for {selectedEmployee}</h3>
          <Table data={attendanceTableData} />
        </>
      )}

      {/* Modal for Viewing Image */}
      {modalImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal}
        >
          <img src={modalImage} alt="PunchImg" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}
    </div>
  );
};

export default Attendance;
