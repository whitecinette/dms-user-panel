import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import axios from "axios";
import config from "../../../../config";
import {
  Groups,
  HowToReg,
  PersonOff,
  Timer,
  EventBusy,
} from "@mui/icons-material";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import AttendanceDetailPopup from "./AttendanceDetailPopup";

const backendUrl = config.backend_url;

const formatDate = (dateInput) => {
  try {
    // Handle different input types
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      // Get only the date part to avoid timezone issues
      const datePart = dateInput.slice(0, 10); // "YYYY-MM-DD"
      if (!datePart) return "N/A";

      const [year, month, day] = datePart.split("-").map(Number);
      date = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      return "N/A";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }

    // Format the date using Intl.DateTimeFormat for better localization
    const formatter = new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

const EmployeeAttendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [firmList, setFirmList] = useState([]);
  const [firms, setFirms] = useState([]);
  const [tempSelectedFirms, setTempSelectedFirms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [dropdownStyles, setDropdownStyles] = useState({ top: 0, left: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const dropdownRef = useRef(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [count, setCount] = useState({
    total: 0,
    present: 0,
    halfDay: 0,
    leave: 0,
    absent: 0,
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [tag, setTag] = useState("")

  // Add these handler functions after other functions
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };
  const handleSaveDetails = async (updatedRecord) => {
    try {
      await axios.put(
        `${backendUrl}/edit-attendance/${selectedRecord._id}}`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setShowPopup(false);
      getAttendance(); // Refresh the table
      setAlert({
        show: true,
        message: "Successfully Updated Records",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      setAlert({
        show: true,
        message: "Error Updating Records please try Again",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
    }
  };

  const getCount = async () => {
    try {
      const UrlDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `${backendUrl}/get-attendance-by-date/${UrlDate}`,
        {
          params: {
            firms,
            tag
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCount(response.data.attendanceCount);
    } catch (error) {
      console.error("Error fetching attendance count:", error);
      // Add better error handling
      setCount({
        total: 0,
        present: 0,
        halfDay: 0,
        leave: 0,
        absent: 0,
      });
    }
  };

  // Fetch all actor types for the dropdown
  const getAllActorTypes = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/actorTypesHierarchy/get-all-by-admin`
      );
      setFirmList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFirmSelect = (firm) => {
    if (tempSelectedFirms.includes(firm._id)) {
      setTempSelectedFirms(tempSelectedFirms.filter((id) => id !== firm._id));
    } else {
      setTempSelectedFirms([...tempSelectedFirms, firm._id]);
    }
  };

  const handleClearFirms = () => {
    setTempSelectedFirms([]);
  };

  const handleApplyFirms = () => {
    setFirms(tempSelectedFirms);
    setDropdownOpen(false);
    setDropdownSearch("");
    getAttendance();
    setPage(1);
  };

  const handleDropdownClick = (event) => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownStyles({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      // Set temporary selections to current selections when opening dropdown
      if (!dropdownOpen) {
        setTempSelectedFirms([...firms]);
      }
    }
    setDropdownOpen(!dropdownOpen);
  };

  //get attendance
  const getAttendance = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/get-latest-attendance-by-date`,
        {
          params: {
            date: date.toISOString().split("T")[0], // Format date to YYYY-MM-DD
            page, // Add 1 to convert to 1-based indexing for API
            limit: 50,
            search: searchQuery,
            status: statusFilter,
            firms: firms,
            tag
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAttendanceData(res.data.data);
      setTotalPages(res.data.totalPages || 0); // Set total records
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    if (!date) {
      setDate(new Date());
    }
    getCount();
    getAttendance();
    getAllActorTypes();
  }, [date, firms, tag]);

  useEffect(()=>{
    getAttendance();
  },[date, searchQuery, statusFilter, firms, tag, page])

  // Modify the useEffect that handles click-outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setDropdownSearch("");
        setTempSelectedFirms([...firms]);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, firms]);

  // Handle Previous Page
  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Handle Next Page
  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // Add this helper function at the top level
  const isToday = (dateToCheck) => {
    const today = new Date();
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="EmployeeAttendance">
      <div className="attendance-card">
        <div className="attendance-card-header">
          {isToday(date)
            ? "Today's Attendance"
            : `${formatDate(date)} Attendance`}
        </div>
        <div className="attendance-count-grid">
          <div className="attendance-count-card total">
            <div className="attendance-icon">
              <Groups sx={{ fontSize: 40 }} />
            </div>
            <div className="content">
              <div className="header">Total Employee</div>
              <div className="count">{count.total}</div>
            </div>
          </div>
          <div className="attendance-count-card present">
            <div className="attendance-icon">
              <HowToReg sx={{ fontSize: 40 }} />
            </div>
            <div className="content">
              <div className="header">Present</div>
              <div className="count">{count.present}</div>
            </div>
          </div>
          <div className="attendance-count-card absent">
            <div className="attendance-icon">
              <PersonOff sx={{ fontSize: 40 }} />
            </div>
            <div className="content">
              <div className="header">Absent</div>
              <div className="count">{count.absent}</div>
            </div>
          </div>
          <div className="attendance-count-card half-day">
            <div className="attendance-icon">
              <Timer sx={{ fontSize: 40 }} />
            </div>
            <div className="content">
              <div className="header">Half-Day</div>
              <div className="count">{count.halfDay}</div>
            </div>
          </div>
          <div className="attendance-count-card leave">
            <div className="attendance-icon">
              <EventBusy sx={{ fontSize: 40 }} />
            </div>
            <div className="content">
              <div className="header">Leave</div>
              <div className="count">{count.leave}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="attendance-table-container">
        <div className="attendance-filter">
          <div className="search">
            <label htmlFor="search-input">Search Employee:</label>
            <input
              type="text"
              id="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="date-filter">
            <label htmlFor="date-picker">Select Date:</label>
            <input
              type="date"
              id="date-picker"
              value={date.toISOString().split("T")[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
          <div className="status-filter">
            <label htmlFor="status-select">Filter by Status:</label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half-Day</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
          <div className="tag-filter">
            <label htmlFor="tag-select">Filter by Tag:</label>
            <select
              id="tag-select"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All</option>
              <option value="office">Office</option>
            </select>
          </div>
          <div className="custom-dropdown" ref={dropdownRef}>
            <div className="dropdown-header" onClick={handleDropdownClick}>
              {firms.length > 0 ? (
                <span>
                  {firms.length} firm{firms.length > 1 ? "s" : ""} selected
                </span>
              ) : (
                <span>Select Firms</span>
              )}
              {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {dropdownOpen && (
              <div
                className="dropdown-content"
                style={{ position: "absolute" }}
              >
                <div className="dropdown-search">
                  <input
                    type="text"
                    placeholder="Search firms..."
                    value={dropdownSearch}
                    onChange={(e) => setDropdownSearch(e.target.value)}
                  />
                </div>

                {tempSelectedFirms.length > 0 && (
                  <div className="selected-firms">
                    {firmList
                      .filter((firm) => tempSelectedFirms.includes(firm._id))
                      .map((firm) => (
                        <div
                          key={firm._id}
                          className="selected-firm-item"
                          onClick={() => handleFirmSelect(firm)}
                        >
                          {firm.name}
                        </div>
                      ))}
                  </div>
                )}

                <div className="firms-list">
                  {firmList
                    .filter(
                      (firm) =>
                        !tempSelectedFirms.includes(firm._id) &&
                        firm.name
                          .toLowerCase()
                          .includes(dropdownSearch.toLowerCase())
                    )
                    .map((firm) => (
                      <div
                        key={firm._id}
                        className="firm-item"
                        onClick={() => handleFirmSelect(firm)}
                      >
                        {firm.name}
                      </div>
                    ))}
                </div>

                <div className="dropdown-actions">
                  <button className="clear-btn" onClick={handleClearFirms}>
                    Clear
                  </button>
                  <button className="apply-btn" onClick={handleApplyFirms}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="reset-button">
            <button
              className="reset-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setDate(new Date());
                setFirms([]);
                setTempSelectedFirms([]);
                getAttendance();
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Position</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>View Detail</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record) => (
                  <tr key={record._id} onClick={() => handleViewDetails(record)}>
                    <td>{record.name}</td>
                    <td>{record.code}</td>
                    <td>{record.position}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      {record.punchIn
                        ? new Date(record.punchIn).toLocaleTimeString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                        : "N/A"}
                    </td>
                    <td>
                      {record.punchOut
                        ? new Date(record.punchOut).toLocaleTimeString(
                            "en-IN",
                            {
                              timeZone: "Asia/Kolkata",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td>{record.hoursWorked || "N/A"}</td>
                    <td>{record.status}</td>
                    <td
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewDetails(record)}
                    >
                      View Details
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} align="center">
                    No recent activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        <div className="pagination">
          <button
            onClick={prevPage}
            className="page-btn"
            disabled={page === 1}
          >
            &lt;
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            className="page-btn"
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      {showPopup && selectedRecord && (
        <AttendanceDetailPopup
          record={selectedRecord}
          onClose={() => setShowPopup(false)}
          onSave={handleSaveDetails}
        />
      )}
    </div>
  );
};

export default EmployeeAttendance;
