import React, { useEffect, useState } from "react";
import config from "../../../config"
import axios from "axios";
import Table from "../../table";

const backend_url = config.backend_url;

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
   try {
     const response = await axios.get(`${backend_url}/get-all-attendance`);
     console.log("Full API Response:", response.data);
 
     const { attendance } = response.data;
     console.log("Extracted Attendance Data:", attendance);
 
     const formattedData = attendance.map((record) => ({
       _id: record._id,
       name: record.employeeId?.name || "N/A", 
       status: record.status,
       hoursWorked :record.hoursWorked,
     }));
 
     console.log("Formatted Data for Table:", formattedData);
     setAttendanceData(formattedData);
   } catch (err) {
     setError("Failed to fetch attendance data");
   } finally {
     setLoading(false);
   }
 };
 
  useEffect(() => {
    fetchAttendance();
  }, []);

  const tableData = {
    headers: ["name", "status","hoursWorked"], // Adjusted to match fetched data
    data: attendanceData,
    currentPage: 1,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Attendance</h3>
      <Table data={tableData} onSort={() => {}} handleSave={() => {}} deleteRow={() => {}} />
    </div>
  );
};

export default Attendance;
