import React, { useState, useEffect } from "react";
import "./style.scss";
import CustomAlert  from "../../../components/CustomAlert";
// For PDF export
// You need to install jsPDF and autoTable: npm install jspdf jspdf-autotable
// import jsPDF from "jspdf";
// import "jspdf-autotable";

const dummyData = [
  {
    voucher: "SAM24/25-19507",
    amount: "778813.00",
    type: "Sales DMS",
    date: "2024-12-09",
  },
  {
    voucher: "SAM24/25-19508",
    amount: "216299.00",
    type: "Sales DMS",
    date: "2024-12-10",
  },
  {
    voucher: "SAM24/25-19533",
    amount: "121484.00",
    type: "Sales DMS",
    date: "2024-12-11",
  },
];

function TableSection({
  title,
  data,
  selected,
  onSelect,
  onSelectAll,
  disabled,
}) {
  const allSelected = data.length > 0 && selected.length === data.length;
  return (
    <div className="table-section">
      <h3>{title}</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all"
                  disabled={disabled}
                />
              </th>
              <th>Voucher Number</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-rows">
                  No rows
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(idx)}
                      onChange={(e) => onSelect(idx, e.target.checked)}
                      aria-label={`Select row ${idx + 1}`}
                      disabled={disabled}
                    />
                  </td>
                  <td>{row.voucher}</td>
                  <td>{row.amount}</td>
                  <td>{row.type}</td>
                  <td>{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function sumSelected(data, selected) {
  return selected.reduce((sum, idx) => sum + Number(data[idx]?.amount || 0), 0);
}

function Calculator() {
  const [alert, setAlert] = useState({
    open: false,
    msg: "",
    type: "success",
  });
  // Selection state for each table
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [selectedDebits, setSelectedDebits] = useState([]);

  const creditData = dummyData.slice(0, 2);
  const debitData = dummyData.slice(0, 2);

  const total =
    sumSelected(dummyData, selectedInvoices) -
    sumSelected(creditData, selectedCredits) +
    sumSelected(debitData, selectedDebits);

  const canSelectInvoices =
    creditData.length > 0 &&
    debitData.length > 0 &&
    selectedCredits.length > 0 &&
    selectedDebits.length > 0;

  // PDF download
  const handleDownloadPDF = () => {
    // const doc = new jsPDF();
    const doc = [];
    doc.text("Payment Calculator - Selected Data", 14, 14);
    const tables = [
      { title: "Invoices", data: dummyData, selected: selectedInvoices },
      { title: "Credit Notes", data: creditData, selected: selectedCredits },
      { title: "Debit Notes", data: debitData, selected: selectedDebits },
    ];
    let y = 24;
    tables.forEach(({ title, data, selected }) => {
      if (selected.length === 0) return;
      doc.text(title, 14, y);
      doc.autoTable({
        startY: y + 2,
        head: [["Voucher Number", "Amount", "Type", "Date"]],
        body: selected.map((idx) => [
          data[idx].voucher,
          data[idx].amount,
          data[idx].type,
          data[idx].date,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });
      y = doc.lastAutoTable.finalY + 8;
    });
    doc.text(`Total: ₹${total.toLocaleString()}`, 14, y);
    doc.save("payment_calculator.pdf");
  };

  useEffect(() => {
    if (!canSelectInvoices) {
      setSelectedInvoices([]);
    }
  }, [canSelectInvoices]);

  return (
    <div className="calculator-container">
      {alert.open && (
        <CustomAlert
          message={alert.msg}
          type={alert.type}
          onClose={() => setAlert({ open: false })}
        />
      )}
      <div className="header-row">
        <div className="title">Payment Calculator</div>
        <div className="amount-display">
          <span className="currency">₹</span>
          <span className="amount">{total.toLocaleString()}</span>
          <button
            className="action-btn"
            title="Download PDF"
            onClick={handleDownloadPDF}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 12l2 2 4-4" />
            </svg>
          </button>
        </div>
      </div>
      <TableSection
        title="Invoices"
        data={dummyData}
        selected={selectedInvoices}
        onSelect={(idx, checked) => {
            if (!canSelectInvoices) {
              setAlert({
                open: true,
                msg: "Please select at least one Credit Note and one Debit Note before selecting an Invoice.",
                type: "warning",
              });
              return;
            }
            setSelectedInvoices(checked
              ? [...selectedInvoices, idx]
              : selectedInvoices.filter((i) => i !== idx)
          );
        }}
        onSelectAll={(checked) => {
          if (!canSelectInvoices) {
            setAlert({
              open: true,
              msg: "Please select at least one Credit Note and one Debit Note before selecting an Invoice.",
              type: "warning",
            });
            return;
          }
          setSelectedInvoices(checked ? dummyData.map((_, i) => i) : []);
        }}
      />
      <div className="tables-grid">
        <TableSection
          title="Credit Notes"
          data={creditData}
          selected={selectedCredits}
          onSelect={(idx, checked) =>
            setSelectedCredits(
              checked
                ? [...selectedCredits, idx]
                : selectedCredits.filter((i) => i !== idx)
            )
          }
          onSelectAll={(checked) =>
            setSelectedCredits(checked ? creditData.map((_, i) => i) : [])
          }
        />
        <TableSection
          title="Debit Notes"
          data={debitData}
          selected={selectedDebits}
          onSelect={(idx, checked) =>
            setSelectedDebits(
              checked
                ? [...selectedDebits, idx]
                : selectedDebits.filter((i) => i !== idx)
            )
          }
          onSelectAll={(checked) =>
            setSelectedDebits(checked ? debitData.map((_, i) => i) : [])
          }
        />
      </div>
    </div>
  );
}

export default Calculator;
