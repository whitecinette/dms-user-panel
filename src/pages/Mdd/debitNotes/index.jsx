import React, { useEffect, useState } from "react";
import config from "../../../config.js";
import * as XLSX from "xlsx";
import "./style.scss";

const backendUrl = config.backend_url;

function DebitNotes() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().substring(0, 10);
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().substring(0, 10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(lastOfMonth);
  const [workingLoading, setWorkingLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        startDate: new Date(startDate).toISOString().split("T")[0] + "T00:00:00.000Z",
        endDate: new Date(endDate).toISOString().split("T")[0] + "T23:59:59.999Z",
      });

      const res = await fetch(`${backendUrl}/finance/debit-notes?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Error fetching debit notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, startDate, endDate]);

  const formatNumberIndian = (num) => {
    if (isNaN(num)) return num;
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const downloadWorkingData = async (label) => {
    setWorkingLoading(true);
    try {
      const query = new URLSearchParams({
        label,
        startDate,
        endDate,
      });

      const res = await fetch(`${backendUrl}/finance/debit-notes-working?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(json.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Working Data");

        XLSX.writeFile(workbook, `${label.replace(/\s+/g, "_")}_Working.xlsx`);
      } else {
        alert("No working data found for this scheme.");
      }
    } catch (err) {
      console.error("Error downloading working data:", err);
      alert("Something went wrong while downloading the file.");
    } finally {
      setWorkingLoading(false);
    }
  };

  return (
    <div className="finance-data-container">
      <h2>📄 Debit Note Vouchers</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Scheme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {loading ? (
        <p className="loader">Loading...</p>
      ) : data.length === 0 ? (
        <p className="no-data">Oops! No data found. Try adjusting your date range or search criteria.</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Date</th>
              <th>CN No.</th>
              <th>Download</th>
              <th>Working</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.label}</td>
                <td>{entry.startDateFormatted} to {entry.endDateFormatted}</td>
                <td>₹{formatNumberIndian(entry["Final Payout"] || 0)}</td>
                <td>{entry["CN Date"]}</td>
                <td>{entry["CN Number"]}</td>
                <td><button className="action-btn">Invoice</button></td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => downloadWorkingData(entry.label)}
                    disabled={workingLoading}
                  >
                    {workingLoading ? "Loading..." : "Download"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DebitNotes;
