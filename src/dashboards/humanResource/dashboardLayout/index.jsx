import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.scss";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaMale, FaFemale } from "react-icons/fa";

// Attendance Pie Chart Data
const COLORS = ["#0088FE", "#FF8042"];
const dataPie = [
  { name: "Present", value: 95, color: "#5C3CF2" },
  { name: "Absent", value: 15, color: "red" },
  // ];

  // Leave Request | Approvals Pie Chart Data
  // const leaveData = [
  //   { name: "Female", value: 35, color: "#5C3CF2" },
  //   { name: "Male", value: 65, color: "#00B589" },
  // ];
  // const leaveData = [
  { name: "Approved", value: 35, color: "green" },
  { name: "pending", value: 65, color: "orange" },
];

// Static Data for Birthdays & Events
const staticBirthdays = {
  "2025-02-23": [{ name: "John Doe" }, { name: "Jane Smith" }],
  "2025-02-25": [{ name: "Alice Johnson" }],
  // fixe the dates in fetching api 
};

const staticEvents = {
  "2025-02-23": [{ title: "Company Meeting" }],
  "2025-02-26": [{ title: "Project Deadline" }],
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" fontSize="14" fontWeight="bold">
      {index === 0 ? <FaFemale color="#5C3CF2" /> : <FaMale color="#00B589" />} {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  // const selectedDate = date.toISOString().split("T")[0];
  const selectedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const birthdays = staticBirthdays[selectedDate] || [];
  const events = staticEvents[selectedDate] || [];

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
      {/* Employee Stats Cards */}
      {/* <div className="cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>120</p>
        </div>
        <div className="card">
          <h3>Total Present</h3>
          <p>95</p>
        </div>
        <div className="card">
          <h3>Total Absent</h3>
          <p>15</p>
        </div>
      </div> */}
      <div className="chart-container">
        <div className="chart-content">

          {/* Center: Combined Pie Charts */}
          <div className="chart-center">
            <ResponsiveContainer width={300} height={200}>
              <PieChart>
                <Pie
                  data={dataPie} // Merged attendance & leave data
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  innerRadius={20}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={12}
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>


          {/* Right: Leave Approval Stats */}
          <div className="chart-right">
            <div className="employee-stat">
              <h6>Total Employees: <span>120</span></h6>
              
            </div>
            <div className="employee-stat">
              <h6>Total Present</h6>
              {/* <p>95</p> */}
            </div>
            <div className="employee-stat">
              <h6>Total Absent</h6>
              {/* <p>15</p> */}
            </div>
            <div className="employee-stat">
              <h6>Approved</h6>
              {/* <p>35</p> */}
            </div>
            <div className="employee-stat">
              <h6>Pending</h6>
              {/* <p>65</p> */}
            </div>
          </div>

        </div>
        <div className="chart-leave">
          <h2>Leave Requests</h2>
        </div>
      </div>
      <div className="charts">
        <div className="calendar-container">
          <Calendar onChange={setDate} value={date} view="month" tileContent={tileContent} />
        </div>

        <div className="event-table">
          <h2>Birthdays & Events</h2>
          <table>
            <thead>
              {/* <tr> */}
                <th>Name</th>
                <th>Type</th>
              {/* </tr> */}
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
  );
};

export default Dashboard;
