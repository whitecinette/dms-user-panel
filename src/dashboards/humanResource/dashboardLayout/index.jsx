import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.scss";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar } from "recharts";
import { FaMale, FaFemale } from "react-icons/fa";
import config from "../../../config";
import axios from "axios";
import { FiUsers } from "react-icons/fi";
import { PiThumbsUpLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { IoCardOutline } from "react-icons/io5";
import { SlCalculator } from "react-icons/sl";
import { TbReportAnalytics } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import Employees from "../employees";
import { NavLink } from "react-router-dom";



const backend_url = config.backend_url;

// Attendance Pie Chart Data
const COLORS = ["#0088FE", "red", "green", "orange", "yellow"];
const initialDataPie = [
  { name: "Jaipur", value: 40, color: "#8b78e6" },
  { name: "Kota", value: 30, color: "#5643a9" },
  { name: "Jodhpur", value: 20, color: "#a192e6" },
  { name: "Dosa", value: 10, color: "#c5b7f2" },
];

// const leaveData = [
//   { name: "Approved", value: 35, color: "green" },
//   { name: "Pending", value: 65, color: "orange" },
// ];

// Static Data for Birthdays & Events
const staticBirthdays = {
  "2025-02-23": [{ name: "John Doe" }, { name: "Jane Smith" }],
  "2025-02-25": [{ name: "Alice Johnson" }],
};

const staticEvents = {
  "2025-02-23": [{ title: "Company Meeting" }],
  "2025-02-26": [{ title: "Project Deadline" }],
};

const employeeData = [
  { name: "Feb", profit: 40, revenue: 70, cashFlow: 30 },
  { name: "Mar", profit: 60, revenue: 90, cashFlow: 40 },
  { name: "Apr", profit: 30, revenue: 60, cashFlow: 20 },
  { name: "May", profit: 50, revenue: 100, cashFlow: 35 },
  { name: "Jun", profit: 40, revenue: 80, cashFlow: 30 },
  { name: "Jul", profit: 45, revenue: 85, cashFlow: 35 },
  { name: "Aug", profit: 50, revenue: 90, cashFlow: 40 },
  { name: "Sep", profit: 60, revenue: 110, cashFlow: 45 },
  { name: "Oct", profit: 55, revenue: 75, cashFlow: 38 },
];

const performanceData = [
  { name: "Market Team", value: 35, color: "#6667AB" },
  { name: "Office Team", value: 25, color: "#E63946" },
  { name: "Marketing", value: 15, color: "#6A0572" },
  { name: "Management", value: 20, color: "#5C67F2" },
  { name: "Other", value: 11, color: "#FF69B4" },
];

const growthData = [
  { name: "Jaipur", value: 35, color: "#7B68EE" },
  { name: "Kota", value: 25, color: "#6A5ACD" },
  { name: "Jodhpur", value: 20, color: "#9370DB" },
  { name: "Dosa", value: 20, color: "#8A2BE2" },
];

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const selectedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const [isExpanded, setIsExpanded] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [notices, setNotices] = useState([
    { id: 1, message: "Office will be closed on Friday." },
    { id: 2, message: "Submit your attendance by 5 PM." },
    { id: 3, message: "New HR policies have been updated." }
  ]);

  const removeNotice = (id) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const fetchEmpThroughActorCode = async () => {
    try {
      const response = await axios.get(`${backend_url}/actorCode/get-actorCode-for-admin`);
      const employeeList = response.data.employeeList || [];

      // Filter only those whose role is 'employee'
      const employeeCount = employeeList.length;

      setTotalEmployees(employeeCount);
      console.log("Total Employeesssssssssssssssss:", employeeCount);

    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setTotalEmployees(0);
    }
  };

  // Call this function inside useEffect to fetch the data on component mount
  useEffect(() => {
    fetchEmpThroughActorCode();
  }, []);

  const birthdays = staticBirthdays[selectedDate] || [];
  const events = staticEvents[selectedDate] || [];

  // Fetch Attendance Data from API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`${backend_url}/get-all-attendance`);
        const data = response.data;

        if (response.status === 200) {
          processAttendanceData(data.attendance);
          console.log("AttendanceOfEmployees:::", data.attendance);

        } else {
          console.error("Error fetching attendance:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAttendance();
  }, []);

  // Process attendance data
  const processAttendanceData = (attendanceRecords) => {
    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let approvedLeaveCount = 0;
    let pendingLeaveCount = 0;

    attendanceRecords.forEach((record) => {
      if (record.status === "Present") presentCount++;
      else if (record.status === "Half Day") halfDayCount++;
      else if (record.status === "Absent") absentCount++;
      else if (record.status === "Approved") approvedLeaveCount++;
      else if (record.status === "Pending") pendingLeaveCount++;
    });

    setAttendanceData([
      { name: "Present", value: presentCount, color: COLORS[0] },
      { name: "Absent", value: absentCount, color: COLORS[1] },
      { name: "Approved", value: approvedLeaveCount, color: COLORS[2] },
      { name: "Pending", value: pendingLeaveCount, color: COLORS[3] },
      { name: "Half Day", value: halfDayCount, color: COLORS[4] },
    ]);
  };

  // Function to highlight dates with events
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
      const hasBirthday = staticBirthdays[formattedDate];
      const hasEvent = staticEvents[formattedDate];

      if (hasBirthday || hasEvent) {
        return (
          <div className="event-indicator">
            {hasBirthday && <span className="birthday-dot">🎂</span>}
            {hasEvent && <span className="event-dot">📅</span>}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="dashboard">
      <div>
        <h2>Hello HR,</h2>
        <span>Measure How Fast You’re Growing Monthly Recurring Revenue. </span>
      </div>
      <div className="chart-container">
        <div className="announcements">
          <div>
            {/* Marquee Container */}
            <div className="marquee-container">
              <div className="marquee-content">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <div className="announcement" key={notice.id}>
                      <span>{notice.message}</span>
                      <button className="close-btn" onClick={() => removeNotice(notice.id)}><IoCloseSharp color="grey" fontSize={25} /></button>
                    </div>
                  ))
                ) : (
                  <div className="announcement">No Announcements Available</div>
                )}
              </div>
            </div>

            {/* Announcements List as Cards */}
            <div className="announcements-list">
              <div className="announcement-card">
                <img src="https://media.istockphoto.com/id/1344512181/vector/icon-red-loudspeaker.jpg?s=612x612&w=0&k=20&c=MSi3Z2La8OYjSY-pr0bB6f33NOuUKAQ_LBUooLhLQsk=" width={50} style={{ borderRadius: '100%' }} alt="" />
                <span>Employee Related Announcement</span></div>
              <div className="announcement-card">
                <img src="https://cdn-icons-png.freepik.com/256/11336/11336991.png?semt=ais_hybrid" width={50} alt="" />
                <span>Policy & Training Announcement</span></div>
              <div className="announcement-card">
                <img src="https://thumbs.dreamstime.com/b/events-icon-calendar-icon-white-background-events-icon-calendar-icon-simple-vector-icon-122490266.jpg" width={50} style={{ borderRadius: '100%' }} alt="" />
                <span>Event & Celebration Announcement</span></div>
              <div className="announcement-card">
                <img src="https://cdn-icons-png.freepik.com/256/3732/3732623.png?semt=ais_hybrid" width={50} alt="" />
                <span>Performance Announcement</span></div>
              <div className="announcement-card">
                <img src="https://img.freepik.com/premium-vector/audit-document-icon-comic-style-result-report-vector-cartoon-illustration-white-isolated-background-verification-control-business-concept-splash-effect_157943-8622.jpg" width={50} style={{ borderRadius: '100%' }} alt="" />
                <span>Administrative Announcement</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-option">
        <NavLink className="option" to="/employees-data"><FiUsers className="icons" /> <span>Employees</span></NavLink>
        <div className="option"><PiThumbsUpLight className="icons" /> <span>Holiday</span>
        </div>
        <div className="option calendar-events-container" onClick={() => setIsExpanded(!isExpanded)}>
          <IoCalendarOutline className="icons" /> <span>Events</span>
          <div
            className={`event-sidebar ${isExpanded ? "expanded" : ""}`}
            onClick={(e) => e.stopPropagation()} // Stop click from closing the sidebar
          >
            <div className="event-table">
              {/* Close Button */}
              <div style={{display:'flex',justifyContent:'end'}}>
                <button className="close-btn" onClick={() => setIsExpanded(false)}>
                  <IoCloseSharp color="grey" fontSize={30} />
                </button>
              </div>
              <div className="calendar-container">
                <Calendar onChange={setDate} value={date} view="month" tileContent={tileContent} />
              </div>
              <div style={{ display: 'flex' }}>
                <h2>Birthdays & Events</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {birthdays.map((bday, index) => (
                    <tr key={`bday-${index}`}>
                      <td>{bday.name}</td>
                      <td>Birthday</td>
                    </tr>
                  ))}
                  {events.map((event, index) => (
                    <tr key={`event-${index}`}>
                      <td>{event.title}</td>
                      <td>Event</td>
                    </tr>
                  ))}
                  {birthdays.length === 0 && events.length === 0 && (
                    <tr>
                      <td colSpan="2">No birthdays or events</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <NavLink className="option" to='/employees-payroll'><IoCardOutline className="icons" /> <span>PayRoll</span></NavLink>
        <div className="option">< SlCalculator className="icons" /> <span>Accounts</span></div>
        <div className="option">< TbReportAnalytics className="icons" /> <span>Report</span></div>
      </div>


      <div className="charts">
        <div className="chart-content">

          {/* Center: Combined Pie Charts */}
          <div className="chart-center">
            <div>
              <h2>Attendance:</h2>
              <h6>Total Employees: <span>{totalEmployees}</span></h6>
            </div>
            <div style={{ display: "flex" }}>
              <ResponsiveContainer width={300} height={200}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={50}
                    // label={({ name, value }) =>
                    //   totalEmployees > 0
                    //     ? `${name} ${(value / totalEmployees * 100).toFixed(0)}%`
                    //     : `${name} 0%`
                    // }
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Right: Leave Approval Stats */}
              <div className="chart-right">


                {/* <div style={{ display: "flex", gap: "10px", justifyContent: 'space-between' }}> */}
                <div className="employee-stat present">
                  <div className="indicator present-indicator"></div>
                  <h6>Present: <span>{attendanceData.find((item) => item.name === "Present")?.value || 0}</span></h6>
                </div>
                <div className="employee-stat absent">
                  <div className="indicator absent-indicator"></div>
                  <h6>Absent: <span>{attendanceData.find((item) => item.name === "Absent")?.value || 0}</span></h6>
                </div>
                {/* </div> */}

                {/* <div style={{ display: 'flex', gap: "10px", justifyContent: 'space-between' }}> */}
                <div className="employee-stat approved">
                  <div className="indicator approved-indicator"></div>
                  <h6>Approved: <span>{attendanceData.find((item) => item.name === "Approved")?.value || 0}</span></h6>
                </div>
                <div className="employee-stat pending">
                  <div className="indicator pending-indicator"></div>
                  <h6>Pending: <span>{attendanceData.find((item) => item.name === "Pending")?.value || 0}</span></h6>
                </div>
                {/* </div> */}
                <div className="employee-stat halfDay">
                  <div className="indicator halfDay-indicator"></div>
                  <h6>Half Day: <span>{attendanceData.find((item) => item.name === "Half Day")?.value || 0}</span></h6>
                </div>
              </div>
            </div>
            <NavLink to='/attendance'>show more</NavLink>
          </div>


        </div>
        {/* <div className=""> */}

        {/* Expand Button */}
        {/* <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "×" : "Event"}
          </button> */}

        {/* Performance */}
        <div className="card performance">
          <h4>PERFORMANCE</h4>
          <p>
            Measure How Fast You’re Growing Monthly Recurring Revenue.
            <span className="learn-more"> Learn More</span>
          </p>
          {performanceData.map((item) => (
            <div key={item.name} className="progress-container">
              <div className="progress-label">
                <span>{item.value}%</span> {item.name}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        {/* </div> */}
        <div className="revenue-card">
          <h4>REVENUE</h4>
          <PieChart width={120} height={120}>
            <Pie
              data={initialDataPie}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              dataKey="value"
            >
              {initialDataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <div className="legend">
            {initialDataPie.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="dot" style={{ backgroundColor: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
          <h2>
            1,24,301 <span className="growth">+3.7%</span>
          </h2>
          <p>Lorem Ipsum is simply dummy text</p>
          <button className="report-btn">Send Report</button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 'wrap', gap: '10px' }}>

        {/* Employee Structure */}
        <div className="card employee-structure">
          <h4>EMPLOYEE STRUCTURE</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={employeeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="profit" fill="#4B0082" />
              <Bar dataKey="revenue" fill="#6A0572" />
              <Bar dataKey="cashFlow" fill="#9370DB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth */}
        <div className="card growth">
          <h4>GROWTH</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={growthData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
              >
                {growthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {growthData.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="dot" style={{ background: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
