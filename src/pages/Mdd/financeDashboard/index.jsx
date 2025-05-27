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
import { FiDownload } from "react-icons/fi";
import { useSpring, animated } from '@react-spring/web';
import * as XLSX from "xlsx";



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
  const [creditNotes, setCreditNotes] = useState([]);
  const [debitNotes, setDebitNotes] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [selectedCreditNotes, setSelectedCreditNotes] = useState([]);
  const [selectedDebitNotes, setSelectedDebitNotes] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [error, setError] = useState("");
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
      let timer;
      if (error) {
        setShowAlert(true);
        timer = setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      } else {
        // Ensure it hides if error is manually cleared
        setShowAlert(false);
      }
      return () => clearTimeout(timer);
    }, [error]);

  
  const animatedTotal = useSpring({
    number: totalSelectedAmount,
    from: { number: 0 },
    config: { duration: 200 },
    reset: false
  });


  const handleSelect = (type, entry) => {
    const isCreditComplete = creditNotes.length > 0 && selectedCreditNotes.length === creditNotes.length;

    if ((type === "debit" || type === "invoice") && !isCreditComplete) {
      setError("Please select all the credit notes first.");
      return;
    }

    setError("");

    const updateState = (prev, setState) => {
      const exists = prev.some(e => e.invoiceNumber === entry.invoiceNumber);
      const updated = exists
        ? prev.filter(e => e.invoiceNumber !== entry.invoiceNumber)
        : [...prev, entry];
      setState(updated);
    };

    if (type === "credit") updateState(selectedCreditNotes, setSelectedCreditNotes);
    if (type === "debit") updateState(selectedDebitNotes, setSelectedDebitNotes);
    if (type === "invoice") updateState(selectedInvoices, setSelectedInvoices);
  };


  useEffect(() => {
    const total =
      [...selectedInvoices, ...selectedDebitNotes].reduce((sum, row) => sum + (row.pendingAmount || 0), 0) -
      selectedCreditNotes.reduce((sum, row) => sum + (row.pendingAmount || 0), 0);
    setTotalSelectedAmount(total);
  }, [selectedCreditNotes, selectedDebitNotes, selectedInvoices]);



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

    const fetchCreditNotes = async () => {
      try {
        const response = await axios.get(`${backend_url}/finance/pc/credit-notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCreditNotes(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch outstanding breakup:", err);
      }
    };

    const fetchDebitNotes = async () => {
      try {
        const response = await axios.get(`${backend_url}/finance/pc/debit-notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setDebitNotes(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch outstanding breakup:", err);
      }
    };

    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${backend_url}/finance/pc/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setInvoices(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch outstanding breakup:", err);
      }
    };

    fetchOverview();
    fetchBreakup();
    fetchCreditNotes();
    fetchDebitNotes();
    fetchInvoices();

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

    const handleDownload = () => {
      const allData = [
        ...selectedInvoices.map((row) => ({
          Type: "Invoice",
          "Invoice No": row.invoiceNumber,
          "Date of Invoice": row.date,
          "Due Date": row.dueDate,
          "Invoice Amount": row.invoiceAmount,
          "Payment Received": row.invoiceAmount - row.pendingAmount,
          "Pending Amount": row.pendingAmount,
          "OD Days": row.overDueDays,
          "Remarks": row.remarks
        })),
        ...selectedDebitNotes.map((row) => ({
          Type: "Debit Note",
          "Invoice No": row.invoiceNumber,
          "Date of Invoice": row.date,
          "Due Date": row.dueDate,
          "Invoice Amount": row.invoiceAmount,
          "Payment Received": row.invoiceAmount - row.pendingAmount,
          "Pending Amount": row.pendingAmount,
          "OD Days": row.overDueDays,
          "Remarks": row.remarks
        })),
        ...selectedCreditNotes.map((row) => ({
          Type: "Credit Note",
          "Invoice No": row.invoiceNumber,
          "Date of Invoice": row.date,
          "Due Date": row.dueDate,
          "Invoice Amount": -row.invoiceAmount,
          "Payment Received": -(row.invoiceAmount - row.pendingAmount),
          "Pending Amount": -row.pendingAmount,
          "OD Days": row.overDueDays,
          "Remarks": row.remarks
        }))
      ];

      const total = allData.reduce((sum, row) => sum + (row["Pending Amount"] || 0), 0);

      allData.push({
        Type: "Total",
        "Invoice No": "",
        "Date of Invoice": "",
        "Due Date": "",
        "Invoice Amount": "",
        "Payment Received": "",
        "Pending Amount": total,
        "OD Days": "",
        "Remarks": ""
      });

      const worksheet = XLSX.utils.json_to_sheet(allData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Breakup");

      XLSX.writeFile(workbook, "finance_breakup.xlsx");
    };



  return (
    <div className="finance-dashboard-container">

            {showAlert && (
            <div style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "500",
              zIndex: 9999,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 
                10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

      <div className="finance-summary-cards">
        <div className="finance-summary-card">
          <div className="finance-summary-title">Today Total OS</div>
          <div className="finance-summary-value">₹ {formatNumberIndian(overview.todayTotalOS)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={creditLineData}><Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Today Due</div>
          <div className="finance-summary-value">₹ {formatNumberIndian(overview.todayDue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={usedLineData}><Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Today Overdue</div>
          <div className="finance-summary-value">₹ {formatNumberIndian(overview.todayOverdue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={availableLineData}><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
        <div className="finance-summary-card">
          <div className="finance-summary-title">Total Due Overdue</div>
          <div className="finance-summary-value">₹ {formatNumberIndian(overview.totalDueOverdue)}</div>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={availableLineData}><Line type="monotone" dataKey="value" stroke="#ffb84d" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Payment Calculator  */}
      <div className="payment-calculator-main">

        <div className="pc-header">
          <h3>Payment Calculator</h3>
          
          <div className="pc-header-right">
            <animated.h2>
              {animatedTotal.number.to(n => `₹ ${Math.round(n).toLocaleString("en-IN")}`)}
            </animated.h2>

            <div className="tooltip-wrapper">
              <button className="download-button" onClick={handleDownload}>
                <FiDownload size={20} />
              </button>
              <span className="tooltip-text">Download Breakup</span>
            </div>
          </div>
          
        </div>


        <div className="payment-calculator-sub">
          <div className="pc-table">
            <h3>Invoices</h3>
            {invoices.length === 0 ? (
              <p style={{ padding: "1rem", color: "#888" }}>No data found.</p>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <table>
                  <thead>
                    <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedInvoices.length === invoices.length}
                              onChange={(e) =>
                                setSelectedInvoices(
                                  e.target.checked ? invoices : []
                                )
                              }
                            />
                          </th>
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
                    {invoices.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedInvoices.some(e => e.invoiceNumber === row.invoiceNumber)}
                            onChange={() => handleSelect("invoice", row)}
                          />
                        </td>
                        <td>{row.invoiceNumber}</td>
                        <td>{row.date}</td>
                        <td>{row.dueDate}</td>
                        <td>{formatCurrency(row.invoiceAmount)}</td>
                        <td>{formatCurrency(row.invoiceAmount - row.pendingAmount)}</td>
                        <td>{formatCurrency(row.pendingAmount)}</td>
                        <td className={
                          row.overDueDays < 0 ? "od-positive" :
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


          <div className="pc-table">
            <h3>Debit Notes</h3>
            {debitNotes.length === 0 ? (
              <p style={{ padding: "1rem", color: "#888" }}>No data found.</p>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <table>
                  <thead>
                    <tr>
                     <th>
                        <input
                          type="checkbox"
                          checked={selectedDebitNotes.length === debitNotes.length}
                          onChange={(e) =>
                            setSelectedDebitNotes(
                              e.target.checked ? debitNotes : []
                            )
                          }
                        />
                      </th>
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
                    {debitNotes.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedDebitNotes.some(e => e.invoiceNumber === row.invoiceNumber)}
                            onChange={() => handleSelect("debit", row)}
                          />
                        </td>
                        <td>{row.invoiceNumber}</td>
                        <td>{row.date}</td>
                        <td>{row.dueDate}</td>
                        <td>{formatCurrency(row.invoiceAmount)}</td>
                        <td>{formatCurrency(row.invoiceAmount - row.pendingAmount)}</td>
                        <td>{formatCurrency(row.pendingAmount)}</td>
                        <td className={
                          row.overDueDays < 0 ? "od-positive" :
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

            <div className="pc-table">
            <h3>Credit Notes</h3>
            {creditNotes.length === 0 ? (
              <p style={{ padding: "1rem", color: "#888" }}>No data found.</p>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                <table>
                  <thead>
                    <tr>
                     <th>
                        <input
                          type="checkbox"
                          checked={selectedCreditNotes.length === creditNotes.length}
                          onChange={(e) =>
                            setSelectedCreditNotes(
                              e.target.checked ? creditNotes : []
                            )
                          }
                        />
                      </th>
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
                    {creditNotes.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedCreditNotes.some(e => e.invoiceNumber === row.invoiceNumber)}
                            onChange={() => handleSelect("credit", row)}
                          />
                        </td>
                        <td>{row.invoiceNumber}</td>
                        <td>{row.date}</td>
                        <td>{row.dueDate}</td>
                        <td>{formatCurrency(row.invoiceAmount)}</td>
                        <td>{formatCurrency(row.invoiceAmount - row.pendingAmount)}</td>
                        <td>{formatCurrency(row.pendingAmount)}</td>
                        <td className={
                          row.overDueDays < 0 ? "od-positive" :
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

        </div>
      </div>


      {/* OS breakup table  */}
      <div className="os-breakup-table">
        <h3>Outstanding Breakup</h3>
        {transactions.length === 0 ? (
          <p style={{ padding: "1rem", color: "#888" }}>No data found.</p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
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
                      row.overDueDays < 0 ? "od-positive" :
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

export default FinanceDashboard;