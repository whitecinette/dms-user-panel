import React, { useState } from "react";
import "./style.scss";

const Vouchers = () => {
  const [voucherName, setVoucherName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignedVouchers, setAssignedVouchers] = useState([]);

  const employees = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"];

  const voucherCategories = {
    "General Vouchers": [
      "Employee of the Month Bonus",
      "Performance Excellence Reward",
      "Outstanding Teamwork Incentive",
      "Best Attendance Award",
      "Quarterly Achievement Bonus",
      "Customer Service Star Award",
    ],
    "Monetary & Gift Vouchers": [
      "Cash Bonus Voucher",
      "Meal Allowance Voucher",
      "Travel Reimbursement Voucher",
      "Work Anniversary Gift Voucher",
      "Festival Bonus Voucher",
      "Holiday Gift Card",
    ],
    "Wellness & Lifestyle Vouchers": [
      "Health & Wellness Allowance",
      "Gym Membership Reimbursement",
      "Mental Health Wellness Voucher",
      "Work-from-Home Essentials Voucher",
      "Fuel Reimbursement Voucher",
    ],
  };

  const getCategory = (voucher) => {
    for (const [category, vouchers] of Object.entries(voucherCategories)) {
      if (vouchers.includes(voucher)) {
        return category;
      }
    }
    return "Unknown Category";
  };

  const getCategoryClass = (category) => {
    return category.toLowerCase().replace(/[^a-z0-9]/g, "-");
  };

  const handleAssignVoucher = () => {
    if (!voucherName || !amount || !selectedEmployee) {
      alert("Please fill all fields");
      return;
    }

    const category = getCategory(voucherName);

    const newVoucher = {
      id: assignedVouchers.length + 1,
      voucherName,
      amount,
      description,
      employee: selectedEmployee,
      category,
    };

    setAssignedVouchers([...assignedVouchers, newVoucher]);
    setVoucherName("");
    setAmount("");
    setDescription("");
    setSelectedEmployee("");
  };

  return (
    <div className="vouchers-container">
      <h2>🎉 Create and Assign Vouchers</h2>
      <div className="form-container">
        <select value={voucherName} onChange={(e) => setVoucherName(e.target.value)}>
          <option value="">Select Voucher</option>
          {Object.entries(voucherCategories).map(([category, vouchers]) => (
            <optgroup key={category} label={category}>
              {vouchers.map((voucher, index) => (
                <option key={index} value={voucher}>{voucher}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <input type="number" placeholder="💰 Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <textarea placeholder="✍️ Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
          <option value="">👤 Select Employee</option>
          {employees.map((emp, index) => (
            <option key={index} value={emp}>{emp}</option>
          ))}
        </select>

        <button className="assign-btn" onClick={handleAssignVoucher}>🚀 Assign Voucher</button>
      </div>

      <h3>📝 Assigned Vouchers</h3>
      <div className="vouchers-list">
        {assignedVouchers.map((voucher) => (
          <div className={`voucher-card ${getCategoryClass(voucher.category)}`} key={voucher.id}>
            <h4>{voucher.employee}</h4>
            <p><strong>📌 Category:</strong> {voucher.category}</p>
            <p><strong>🎁 Voucher:</strong> {voucher.voucherName}</p>
            <p><strong>💵 Amount:</strong> ${voucher.amount}</p>
            <strong>📝 Description:</strong>
            <div className="description"><p> {voucher.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vouchers;
