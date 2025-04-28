import React from "react";
import "./style.scss";

const DealersAccounts = () => {
  const stats = [
    { label: "Total Accounts", amount: "5,000", color: "#3B3B98" },
    { label: "New Accounts", amount: "250", color: "#FF5E78" },
    { label: "Total Current A/C", amount: "2,500", color: "#FF73B3" },
    { label: "Total Saving A/C", amount: "2,500", color: "#E91E63" },
  ];

  const dealers = [
    {
      dealer: "John Doe Enterprises",
      owner: "John Doe",
      type: "Current A/C",
      openingDate: "01 Jan, 2023",
      status: "Active",
      balance: "₹10,000",
    },
    {
      dealer: "ABC Traders",
      owner: "Alice Brown",
      type: "Saving A/C",
      openingDate: "15 Feb, 2023",
      status: "Inactive",
      balance: "₹8,500",
    },
    {
      dealer: "XYZ Distributors",
      owner: "Robert Smith",
      type: "Current A/C",
      openingDate: "05 Mar, 2023",
      status: "Active",
      balance: "₹15,000",
    },
  ];

  return (
    <div className="dealers-accounts">
        <h2>Employees Account</h2>
      {/* Stats Cards */}
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2>{stat.amount}</h2>
            <span>{stat.label}</span>
            <div className="progress-bar" style={{ backgroundColor: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Dealers Table */}
      <div className="dealers-table">
        <table>
          <thead>
            <tr>
              <th>Dealer</th>
              <th>Owner</th>
              <th>Account Type</th>
              <th>Opening Date</th>
              <th>Status</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer, index) => (
              <tr key={index}>
                <td>{dealer.dealer}</td>
                <td>{dealer.owner}</td>
                <td>{dealer.type}</td>
                <td>{dealer.openingDate}</td>
                <td>
                  <span className={`status-badge ${dealer.status.toLowerCase()}`}>
                    {dealer.status}
                  </span>
                </td>
                <td>{dealer.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealersAccounts;
