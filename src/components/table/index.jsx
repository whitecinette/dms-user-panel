import { useState } from "react";
import {
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./style.scss";

function Table(prop) {
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 1 });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const headers = prop.data.headers || [];
  const rows = prop.data.data || [];
  const currentPage = prop.data.currentPage || 1;
  const limit = 50;

  // Enable edit mode for a row
  // const handleEdit = (row) => {
  //   setEditId(row._id);
  //   setEditData({ ...row }); // Store original data in state
  // };
  const handleEdit = (row) => {
    // ==hDs=========
    if (!row._id) {
      console.error("Row ID is missing:", row);
      return; // Prevent editing if no ID
    }
    setEditId(String(row._id)); // Convert _id to string
    // ==hDs=========
    setEditId(row._id);
    setEditData({ ...row }); // Store original data in state
  };

  const handleSort = (header) => {
    let direction = 1; // Default: Ascending
    if (sortConfig.key === header && sortConfig.direction === 1) {
      direction = -1; // Toggle to Descending
    }

    setSortConfig({ key: header, direction });

    //   prop.onSort(header, direction); // 🔥 Send sorting info to parent
    // };
    // ======hDs===========
    // Sort the rows locally
    const sortedRows = [...rows].sort((a, b) => {
      const valueA = a[header] ?? "";
      const valueB = b[header] ?? "";

      // Handle numbers and strings separately
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return direction * (Number(valueA) - Number(valueB));
      }
      return direction * valueA.toString().localeCompare(valueB.toString());
    });

    // If `onSort` is provided, pass sorted data to the parent
    if (prop.onSort) {
      prop.onSort(header, direction, sortedRows);
    }
  };
  // ======hDs===========

  return (
    <>
      <div className="table-component">
        <table>
          <thead>
            <tr>
              <th>SNo.</th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(header)}
                  style={{ cursor: "pointer" }}
                >
                  {header.toUpperCase()}
                  {sortConfig.key === header ? (
                    sortConfig.direction === 1 ? (
                      <FaSortUp />
                    ) : (
                      <FaSortDown />
                    )
                  ) : (
                    <FaSort />
                  )}
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              // rows.map((row, index) => (
              // ===========hDs===========
              [...rows].sort((a, b) => {
                const valueA = a[sortConfig.key] ?? "";
                const valueB = b[sortConfig.key] ?? "";
                if (!isNaN(valueA) && !isNaN(valueB)) {
                  return sortConfig.direction * (Number(valueA) - Number(valueB));
                }
                return sortConfig.direction * valueA.toString().localeCompare(valueB.toString());
              }).map((row, index) => (
                // ===========hDs===========
                <tr key={index}>
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  {headers.map((header, idx) => (
                    <td key={idx}>
                      {editId === row._id ? (
                        header.toLowerCase() === "status" ? (
                          // 🔥 Status dropdown for Active/Inactive
                          <select
                            value={editData[header] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [header]: e.target.value,
                              })
                            }
                          >
                            {/* <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select> */}
                            {prop.statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editData[header] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [header]: e.target.value,
                              })
                            }
                          />
                        )
                      ) : (
                        <span
                          style={{
                            color:
                              header.toLowerCase() === "status"
                                ? row[header]?.toLowerCase() === "active"
                                  ? "#23862A"
                                  : row[header]?.toLowerCase() === "inactive"
                                    ? "#F21E1E"
                                    : "black"
                                : "black",
                          }}
                        >
                          {row[header] || "N/A"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td>
                    {editId === row._id ? (
                      <>
                        <FaSave
                          color="#23862A"
                          style={{ cursor: "pointer", marginRight: "8px" }}
                          onClick={() => {
                            // ========hDs===========
                            if (prop.handleSave) {
                            // ========hDs===========
                              prop.handleSave(editData, editId);
                            // ========hDs===========
                            } else {
                              console.warn("handleSave function is not provided!");
                            }
                            // ========hDs===========
                            setEditId(null);
                          }}
                        />
                        <FaTimes
                          color="#F21E1E"
                          style={{ cursor: "pointer" }}
                          onClick={() => setEditId(null)}
                        />
                      </>
                    ) : (
                      <>
                        <FaEdit
                          color="#005bfe"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(row)}
                        />
                        <RiDeleteBin6Line
                          color="#F21E1E"
                          style={{ cursor: "pointer" }}
                          onClick={() => setDeleteId(row._id)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + 2}
                  style={{
                    textAlign: "center",
                    color: "rgb(240 28 28)",
                    fontWeight: "bold",
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="delete-modal" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <div className="delete-model-header">
                Are you sure you want to delete this row?
              </div>
              <div className="delete-modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    prop.deleteRow(deleteId);
                    setDeleteId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;