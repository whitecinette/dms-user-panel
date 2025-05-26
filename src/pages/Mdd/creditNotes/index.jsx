import React, { useEffect, useState } from "react";
import config from "../../../config.js";
import "./style.scss";

const backendUrl = config.backend_url;

function CreditNotes() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .substring(0, 10);
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .substring(0, 10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(lastOfMonth);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        startDate:
          new Date(startDate).toISOString().split("T")[0] + "T00:00:00.000Z",
        endDate:
          new Date(endDate).toISOString().split("T")[0] + "T23:59:59.999Z",
      });

      const res = await fetch(`${backendUrl}/finance/credit-notes?${query}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Error fetching credit notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, startDate, endDate]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="finance-data-container">
      <h2>📄 Credit Note Vouchers</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search Scheme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loader">Loading...</p>
      ) : (
        <table className="finance-table">
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>Duration</th>
              <th>CN Amount</th>
              <th>CN Date</th>
              <th>CN Number</th>
              <th>CN Download</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.label}</td>
                <td>
                  {formatDate(entry.startDate)} to{" "}
                  {formatDate(entry.endDate)}
                </td>
                <td>₹{Number(entry["Final Payout"] || 0).toFixed(2)}</td>
                <td>{entry["CN Date"]}</td>
                <td>{entry["CN Number"]}</td>
                <td>
                  <button className="action-btn">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CreditNotes;
