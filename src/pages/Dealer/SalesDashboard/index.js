import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./style.scss";

const backend_url = config.backend_url; // Get backend URL from config
// Dummy data for summary cards (mini line charts)
const creditLineData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 0.7 + Math.sin(i / 2) * 0.1 + Math.random() * 0.05,
}));
const usedLineData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 0.5 + Math.cos(i / 2) * 0.1 + Math.random() * 0.05,
}));
const availableLineData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 0.2 + Math.sin(i / 3) * 0.1 + Math.random() * 0.05,
}));

// Dummy data for main charts
const limitChartData = Array.from({ length: 12 }, (_, i) => ({
  month: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][i],
  used: Math.random(),
  utilized: Math.random(),
}));
const ordersChartData = [
  { month: "Jan", views: 5000, downloads: 2500 },
  { month: "Feb", views: 7000, downloads: 4000 },
  { month: "Mar", views: 8000, downloads: 6000 },
  { month: "Apr", views: 9000, downloads: 7000 },
  { month: "May", views: 12000, downloads: 10000 },
  { month: "Jun", views: 15000, downloads: 12000 },
  { month: "Jul", views: 11000, downloads: 9000 },
  { month: "Aug", views: 10000, downloads: 8000 },
  { month: "Sep", views: 9000, downloads: 7000 },
  { month: "Oct", views: 8000, downloads: 6000 },
  { month: "Nov", views: 7000, downloads: 5000 },
  { month: "Dec", views: 6000, downloads: 4000 },
];

// Dummy data for transactions table
const transactions = [
  { amount: 12000, voucherType: "Credit", creditNote: 12000, debitNote: 0 },
  { amount: 8000, voucherType: "Debit", creditNote: 0, debitNote: 8000 },
  { amount: 5000, voucherType: "Credit", creditNote: 5000, debitNote: 0 },
  { amount: 2000, voucherType: "Debit", creditNote: 0, debitNote: 2000 },
  { amount: 15000, voucherType: "Credit", creditNote: 15000, debitNote: 0 },
];

// Dummy data for new bottom row
const progressData = [
  { label: "Target", value: 80, color: "#3b82f6" },
  { label: "Achievement", value: 65, color: "#22c55e" },
  { label: "Ads", value: 45, color: "#f59e0b" },
];

const schemeLetters = [
  {
    title: "Summer Cashback Offer",
    desc: "Get 10% cashback on all orders above ₹20,000 till 31st July.",
    date: "01-Jul-2024",
  },
  {
    title: "Festive Bonanza",
    desc: "Special discounts on select models for the festive season.",
    date: "15-Aug-2024",
  },
  {
    title: "Refer & Earn",
    desc: "Refer a dealer and earn ₹2,000 on their first order.",
    date: "01-Sep-2024",
  },
];

function SalesDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${backend_url}/fetch-dealer-credit-limit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, []);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div className="finance-dashboard-container">
      {/* Top Summary Cards */}
      <div className="finance-summary-cards">
        <div className="finance-summary-card">
          <div className="finance-summary-title">Total Credit Limit</div>
          <div className="finance-summary-value">₹{user?.creditLimit}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart
              data={creditLineData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Used Credit Limit</div>
          <div className="finance-summary-value">₹0</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart
              data={usedLineData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Available Credit Limit</div>
          <div className="finance-summary-value">₹{user?.creditLimit}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart
              data={availableLineData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Section: Charts */}
      <div className="finance-charts-row">
        <div className="finance-chart-card">
          <div className="finance-chart-title">Limit</div>
          <div className="finance-chart-subtitle">
            Limit used according to date
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={limitChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="used"
                name="Credit Limit Used"
                stroke="#06b6d4"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="utilized"
                name="Utilized Credit Limit"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-chart-card">
          <div className="finance-chart-title">Orders</div>
          <div className="finance-chart-subtitle">Orders in each month</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={ordersChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" name="Page Views" fill="#67e8f9" />
              <Bar dataKey="downloads" name="Downloads" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Bottom Row */}
      <div className="finance-bottom-row">
        {/* Progress Card */}
        <div className="progress-card">
          <h3>Performance Overview</h3>
          <div className="progress-bars">
            {progressData.map((item, idx) => (
              <div className="progress-bar-group" key={idx}>
                <div className="progress-label-row">
                  <span className="progress-label">{item.label}</span>
                  <span className="progress-value">{item.value}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.value}%`, background: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Scheme Letters Card */}
        <div className="scheme-letters-card">
          <h3>New Scheme Letters</h3>
          <ul className="scheme-letters-list">
            {schemeLetters.map((scheme, idx) => (
              <li key={idx} className="scheme-letter-item">
                <div className="scheme-letter-title">{scheme.title}</div>
                <div className="scheme-letter-desc">{scheme.desc}</div>
                <div className="scheme-letter-date">
                  Launched: {scheme.date}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
