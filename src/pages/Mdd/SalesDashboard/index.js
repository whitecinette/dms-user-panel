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

const backend_url = config.backend_url;

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

const limitChartData = Array.from({ length: 12 }, (_, i) => ({
  month: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

const SalesDashboard = () => {
  const [overview, setOverview] = useState({
    todayTotalOS: 0,
    todayDue: 0,
    todayOverdue: 0,
    totalDueOverdue: 0,
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchOverview = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backend_url}/finnace/finance-overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setOverview(response.data.data);
          setTransactions(response.data.data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to fetch finance overview:", err);
      }
    };
    fetchOverview();
  }, []);

  const formatCurrency = (num) => `₹ ${Number(num || 0).toLocaleString()}`;

  return (
    <div className="finance-dashboard-container">
      <div className="finance-summary-cards">
        <div className="finance-summary-card">
          <div className="finance-summary-title">Todayyy Total OS</div>
          <div className="finance-summary-value">{formatCurrency(overview.todayTotalOS)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={creditLineData}><Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Today Due</div>
          <div className="finance-summary-value">{formatCurrency(overview.todayDue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={usedLineData}><Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Today Overdue</div>
          <div className="finance-summary-value">{formatCurrency(overview.todayOverdue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={availableLineData}><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Total Due Overdue</div>
          <div className="finance-summary-value">{formatCurrency(overview.totalDueOverdue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={availableLineData}><Line type="monotone" dataKey="value" stroke="#ffb84d" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OS breakup table  */}
      <div className="os-breakup-table">
        <h3>Outstanding Breakup</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date of Invoice</th>
              <th>Due Date</th>
              <th>Amt</th>
              <th>Payment Rcd</th>
              <th>Balance Payment</th>
              <th>OD Days</th>
              <th>Total Due Overdue</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row, i) => (
              <tr key={i}>
                <td>{row.invoiceNumber}</td>
                <td>{row.date}</td>
                <td>{row.dueDate}</td>
                <td>{formatCurrency(row.invoiceAmount)}</td>
                <td>{formatCurrency(row.invoiceAmount - row.pendingAmount)}</td>
                <td>{formatCurrency(row.pendingAmount)}</td>
                <td className={
                  row.overDueDays > 0 ? "od-positive" :
                  row.overDueDays === 0 ? "od-zero" : "od-negative"
                }>
                  <p>{row.overDueDays}</p>
                </td>
                <td>{row.remarks === "Overdue" || row.remarks === "Today Due" ? formatCurrency(row.pendingAmount) : 0}</td>
                <td>
                  <span className={
                    row.remarks === "Overdue" ? "badge overdue" :
                    row.remarks === "Today Due" ? "badge today" :
                    "badge upcoming"
                  }>
                    {row.remarks}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="finance-charts-row">
        <div className="finance-chart-card">
          <div className="finance-chart-title">Limit</div>
          <div className="finance-chart-subtitle">Limit used according to date</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={limitChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="used" name="Credit Limit Used" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="utilized" name="Utilized Credit Limit" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-chart-card">
          <div className="finance-chart-title">Orders</div>
          <div className="finance-chart-subtitle">Orders in each month</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ordersChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
    </div>
  );
};

export default SalesDashboard;
