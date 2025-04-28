// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import config from "../../../config";
// import Table from "../../table";

// const backend_url = config.backend_url;

// const Payroll = () => {
//   const [salaries, setSalaries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchSalaries = async () => {
//     try {
//       const response = await axios.get(`${backend_url}/salary-details`);
//       console.log("Fetched data:", response.data.data);

//       const requiredFields = [
//         "actorCode",
//         "actorName",
//         "position",
//         "role",
//         "basicSalary",
//         "bonuses",
//         "deductions",
//         "taxAmount",
//         "netSalary",
//         "paymentDate",
//       ];
//       const salaryData = response.data.data.map((item) =>
//         Object.fromEntries(
//           Object.entries(item).filter(([key]) => requiredFields.includes(key))
//         )
//       );

//       setSalaries(salaryData);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch salaries");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSalaries();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : salaries.length === 0 ? (
//         <p>No salary data available.</p>
//       ) : (
//         <Table data={{
//           headers: salaries.length > 0 ? Object.keys(salaries[0]) : [],
//           data: salaries,
//           currentPage: 1, // Or use a state if pagination is needed
//         }} /> // ✅ Now properly updates table
//       )}
//     </div>
//   );
// };

// export default Payroll;
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import { FaSort, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./style.scss"; // Import the SCSS styles

const backend_url = config.backend_url;

const Payroll = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${backend_url}/salary-details`);

      // const requiredFields = [
      //   "code",
      //   "name",
      //   "baseSalary",
      //   "totalAdditions",
      //   "totalDeductions",
      //   "absentDays",
      //   "halfDays",
      //   "absentDeduction",
      //   "halfDayDeduction",
      //   "attendanceDeductions",
      //   "netSalary",
      // ];

      // const salaryData = response.data.data.map((item) =>
      //   Object.fromEntries(
      //     Object.entries(item).filter(([key]) => requiredFields.includes(key))
      //   )
      // );
      const salaryData=response.data.data
      console.log('salaryData::::',salaryData);
      
      setSalaries(salaryData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch salaries");
      setLoading(false);
    }
  };

  // Handle Search
  const filteredSalaries = salaries.filter(
    (salary) =>
      // salary.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // salary.role.toLowerCase().includes(searchQuery.toLowerCase())
    salary.code.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  // Handle Sorting
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredSalaries].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSalaries(sorted);
    setSortConfig({ key, direction });
  };

  return (
    <div className="payroll-body">
      <div className="payroll-container">
        <div className="payroll-header">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredSalaries.length === 0 ? (
          <p>No salary data available.</p>
        ) : (
          <table className="payroll-table">
            <thead>
              <tr>
                <th onClick={() => sortData("code")}>
                   Code <FaSort />
                </th>
                <th onClick={() => sortData("actorName")}>
                  Name <FaSort />
                </th>
                <th onClick={() => sortData("position")}>
                  Position <FaSort />
                </th>
                <th onClick={() => sortData("role")}>
                  Role <FaSort />
                </th>
                <th onClick={() => sortData("netSalary")}>
                  Net Salary <FaSort />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{salary.code}</td>
                    <td>{salary.name}</td>
                    <td>{salary.position}</td>
                    <td>{salary.role}</td>
                    <td>₹{salary.netSalary}</td>
                    <td>
                      <button
                        className="expand-button"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        {expandedIndex === index ? "Collapse" : "Expand"}
                      </button>
                    </td>
                  </tr>
                  {expandedIndex === index && (
                    <tr className="expanded-content">
                      <td colSpan="6">
                        <p><strong>Basic Salary:</strong> ₹{salary.baseSalary}</p>
                        <p><strong>Bonuses:</strong> ₹{salary.bonuses}</p>
                        <p><strong>Deductions:</strong> ₹{salary.deductions}</p>
                        <p><strong>Tax Amount:</strong> ₹{salary.taxAmount}</p>
                        <p><strong>Payment Date:</strong> {salary.paymentDate}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payroll;
