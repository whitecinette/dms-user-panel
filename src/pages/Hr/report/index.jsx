import React from "react";
import "./style.scss";

const Report = () => {
  const stats = [
    { label: "Smart-Phone", amount: "₹5,52,500", percentage: "23%", color: "#3B3B98" },
    { label: "Laptop", amount: "₹24,50,000", percentage: "52%", color: "#FF5E78" },
    { label: "Wearables", amount: "₹1,25,800", percentage: "27%", color: "#FF73B3" },
    { label: "Others", amount: "₹5620", percentage: "12%", color: "#E91E63" },
  ];

  const orders = [
    {
      item: "HP Laptop",
      orderBy: "Marshall Nichols",
      from: "Paytem",
      date: "07 March, 2018",
      paidBy: "PayPal",
      status: "Pending",
      amount: "₹20,500",
    },
    {
      item: "iMack Desktop",
      orderBy: "Marshall Nichols",
      from: "ebay USA",
      date: "22 July, 2017",
      paidBy: "PayPal",
      status: "Pending",
      amount: "₹35,500",
    },
    {
      item: "Logitech USB Mouse, Keyboard",
      orderBy: "Marshall Nichols",
      from: "Amazon",
      date: "28 July, 2018",
      paidBy: "PayPal",
      status: "Approved",
      amount: "₹4000",
    },
    {
      item: "MacBook Pro Air",
      orderBy: "Debra Stewart",
      from: "Amazon",
      date: "17 June, 2018",
      paidBy: "Mastercard",
      status: "Approved",
      amount: "₹80,000",
    },
  ];

  return (
    <div className="report">
        <h2>Report of the Month</h2>
      {/* Stats Cards */}
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h2>{stat.amount}</h2>
            <p style={{ color: stat.color }}>{stat.percentage}</p>
            <span>{stat.label}</span>
            <div className="progress-bar" style={{ backgroundColor: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="orders">
        <table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>ORDER BY</th>
              <th>FROM</th>
              <th>DATE</th>
              <th>PAID BY</th>
              <th>STATUS</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.item}</td>
                <td>{order.orderBy}</td>
                <td>{order.from}</td>
                <td>{order.date}</td>
                <td>
                  <span className="payment-badge">{order.paidBy}</span>
                </td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
