import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import Table from "../../../components/table";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

import './style.scss'

const backend_url = config.backend_url;

function Employees() {
  const [employeesData, setEmployeesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50; // Number of records per page

  const fetchEmployees = async (page) => {
    try {
      const response = await axios.get(`${backend_url}/get-emp-for-hr?page=${page}&limit=${limit}`);

      console.log("API Response:", response.data); // Debugging API response

      if (response.data && Array.isArray(response.data.data)) {
        setEmployeesData(response.data.data);
        
        // Calculate total pages based on totalRecords
        const calculatedTotalPages = Math.ceil(response.data.totalRecords / limit);
        setTotalPages(calculatedTotalPages || 1);
      } else {
        setEmployeesData([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setEmployeesData([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const tableData = {
    headers: ["code", "parent_code", "name", "position", "role", "status"],
    data: employeesData,
    currentPage,
  };

  return (
    <div className="main">
      <h2>Employee List</h2>
      <Table data={tableData} 
      handleSave={(updatedData, id) => {
        console.log("Updated Data:", updatedData, "ID:", id);
        // Call your API to save edited data
      }}
      deleteRow={(id) => {
        console.log("Delete ID:", id);
        // Call API to delete row
      }}
      statusOptions={["Active", "Inactive"]} // Ensure this is passed
      />

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          <GrFormPrevious />
        </button>
        <span style={{ margin: "0 15px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage >= totalPages}>
          <MdOutlineNavigateNext />
        </button>
      </div>
    </div>
  );
}

export default Employees;
