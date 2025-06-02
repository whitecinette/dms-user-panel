import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import './style.scss';
import { MdCreditScore } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiBarChart2 } from 'react-icons/fi';
import { MdOutlineDateRange, MdOutlineAccessTime } from "react-icons/md";
import { RiCalendarEventLine } from "react-icons/ri";
import { TbAlertCircle } from "react-icons/tb"; // instead of TbAlarmExclamation




const CreditAndPaymentSummary = ({
  totalLimit = 100000000,
  utilized = 2510638,
  available = 7489362,
  todayDue = 500000,
  todayOverdue = 2510638,
  upcoming= 200000,
}) => {
  const availablePercentage = totalLimit
    ? ((available / totalLimit) * 100).toFixed(1)
    : 0;

  const pieData = [
    { name: 'Due Today', value: todayDue },
    { name: 'Overdue', value: todayOverdue },
    { name: 'Upcoming', value: upcoming }
  ];

  const totalDueOverdue = todayDue + todayOverdue;
  const totalOutstanding = todayDue + todayOverdue + upcoming;


  const pieColors = ['#f97316', '#3b82f6', '10b981'];

  return (
    <div className="credit-payment-summary">
      {/* Credit Overview */}
      <div className="credit-card">
        <div className="credit-header">
          <MdCreditScore size={22} />
          <h3 className="credit-heading">Credit Overview</h3>
        </div>
        <div className="credit-body">
          <div className="credit-donut">
            <CircularProgressbar
              value={availablePercentage}
              strokeWidth={12}
              styles={buildStyles({
                pathColor: "#f97316",
                trailColor: "#e5e7eb",
              })}
            />
          </div>
          <div className="credit-info">
            <h2 className="credit-amount">₹ {available.toLocaleString("en-IN")}</h2>
            <p className="credit-label">Available Credit Limit</p>
            <span className="credit-chip">Available</span>
          </div>
        </div>

        <div className="credit-metrics">
        <div className="metric-tile">
            <div className="metric-value">₹ {utilized.toLocaleString("en-IN")}</div>
            <div className="metric-label">
              <FiBarChart2 size={14} style={{ marginRight: "5px", verticalAlign: "middle" }} />
              Utilized
            </div>
          </div>
        <div className="metric-tile">
            <div className="metric-value">₹ {available.toLocaleString("en-IN")}</div>
            <div className="metric-label">Available</div>
          </div>
          <div className="metric-tile">
            <div className="metric-value">₹ {totalLimit.toLocaleString("en-IN")}</div>
            <div className="metric-label">Total Limit</div>
          </div>
          {/* <div className="metric-tile">
            <div className="metric-value">{availablePercentage}%</div>
            <div className="metric-label">Available %</div>
          </div> */}

        </div>
      </div>

      {/* Outstanding Dues */}
        <div className="payment-card">
        <div className="payment-header">
            <FaRupeeSign size={20} />
            <h3 className="payment-heading">Outstanding Dues</h3>
        </div>

        <div className="payment-body-layout new-layout">
            <div className="payment-donut clean-style">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    startAngle={90}
                    endAngle={-270}
                    labelLine={false}
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                    padding: "0.75rem"
                    }}
                    formatter={(value, name) => [`₹ ${value.toLocaleString("en-IN")}`, name]}
                />
                </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-text">
                <h4>₹ {totalOutstanding.toLocaleString("en-IN")}</h4>
                <p>Total OS</p>
            </div>
            </div>

            <div className="payment-box-labels">
            {pieData.map((item, index) => {
                let icon, color, title;

                if (item.name === "Due Today") {
                icon = <RiCalendarEventLine size={20} color="#f97316" />;
                color = "#f97316";
                title = "Due Today";
                } else if (item.name === "Overdue") {
                icon = <TbAlertCircle size={20} color="#3b82f6" />;
                color = "#3b82f6";
                title = "Overdue";
                } else if (item.name === "Upcoming") {
                icon = <RiCalendarEventLine size={20} color="#10b981" />;
                color = "#10b981";
                title = "Upcoming";
                }

                return (
                <div key={index} className="label-card">
                    <div className="label-icon">{icon}</div>
                    <div className="label-info">
                    <span className="label-title" style={{ color }}>{title}</span>
                    <span className="label-value">₹ {item.value.toLocaleString("en-IN")}</span>
                    </div>
                </div>
                );
            })}

            <div className="label-card total-label">
                <div className="label-icon">
                <FaRupeeSign size={20} color="#9ca3af" />
                </div>
                <div className="label-info">
                <span className="label-title" style={{ color: "#9ca3af" }}>
                    Total (Due + Overdue)
                </span>
                <span className="label-value">₹ {totalDueOverdue.toLocaleString("en-IN")}</span>
                </div>
            </div>
            </div>
        </div>
        </div>

    </div>
  );
};

export default CreditAndPaymentSummary;
