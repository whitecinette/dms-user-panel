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
import { formatNumberIndian } from "../../../utils/format";

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

const FinanceDashboard = () => {
  const [overview, setOverview] = useState({
    todayTotalOS: 0,
    todayDue: 0,
    todayOverdue: 0,
    totalDueOverdue: 0,
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOverview = async () => {
      try {
        const response = await axios.get(`${backend_url}/finance/finance-overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOverview(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch finance overview:", err);
      }
    };

    const fetchBreakup = async () => {
      try {
        const response = await axios.get(`${backend_url}/finance/outstanding-breakup`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch outstanding breakup:", err);
      }
    };

    fetchOverview();
    fetchBreakup();
  }, []);

  const formatCurrency = (num) => `₹ ${Number(num || 0).toLocaleString("en-IN")}`;

  const totalInvoice = transactions.reduce((sum, t) => sum + (t.invoiceAmount || 0), 0);
  const totalReceived = transactions.reduce((sum, t) => sum + ((t.invoiceAmount || 0) - (t.pendingAmount || 0)), 0);
  const totalPending = transactions.reduce((sum, t) => sum + (t.pendingAmount || 0), 0);
  const totalOverdue = transactions.reduce((sum, t) => (
    t.remarks === "Overdue" || t.remarks === "Today Due"
      ? sum + (t.pendingAmount || 0)
      : sum
  ), 0);

  return (
    <div className="finance-dashboard-container">
      <div className="finance-summary-cards">
        {/* Summary cards here (unchanged) */}
      </div>

      {/* OS breakup table */}
      <div className="os-breakup-table">
        <h3>Outstanding Breakup</h3>
        {transactions.length === 0 ? (
          <p style={{ padding: "1rem", color: "#888" }}>No data found.</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
                      row.overDueDays < 0 ? "od-negative" :
                      row.overDueDays === 0 ? "od-zero" : "od-positive"
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
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td>{formatCurrency(totalInvoice)}</td>
                  <td>{formatCurrency(totalReceived)}</td>
                  <td>{formatCurrency(totalPending)}</td>
                  <td></td>
                  <td>{formatCurrency(totalOverdue)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="finance-charts-row">
        {/* Chart section remains unchanged */}
      </div>
    </div>
  );
};

export default FinanceDashboard;
