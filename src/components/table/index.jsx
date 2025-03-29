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

function Table({ data, className, handleSave, deleteRow, statusOptions }) {
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 1 });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const headers = data.headers || [];
  const rows = data.data || [];
  const currentPage = data.currentPage || 1;
  const limit = 50;

  const handleEdit = (row) => {
    if (!row._id) return;
    setEditId(row._id);
    setEditData({ ...row });
  };

  const handleSort = (header) => {
    let direction = sortConfig.key === header && sortConfig.direction === 1 ? -1 : 1;
    setSortConfig({ key: header, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    const valueA = a[sortConfig.key] ?? "";
    const valueB = b[sortConfig.key] ?? "";
    return isNaN(valueA) || isNaN(valueB)
      ? sortConfig.direction * valueA.toString().localeCompare(valueB.toString())
      : sortConfig.direction * (Number(valueA) - Number(valueB));
  });

  return (
    <div className="table-component">
      <table className={`table-component ${className || ""}`}>
        <thead>
          <tr>
            <th>SNo.</th>
            {headers.map((header, index) => (
              <th key={index} onClick={() => handleSort(header)} style={{ cursor: "pointer" }}>
                {header.toUpperCase()} {sortConfig.key === header ? (sortConfig.direction === 1 ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.length > 0 ? (
            sortedRows.map((row, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                {headers.map((header, idx) => (
                  <td key={idx}>
                    {editId === row._id ? (
                      header.toLowerCase() === "status" ? (
                        <select value={editData[header] || ""} onChange={(e) => setEditData({ ...editData, [header]: e.target.value })}>
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" value={editData[header] || ""} onChange={(e) => setEditData({ ...editData, [header]: e.target.value })} />
                      )
                    ) : (
                      <span style={{ color: header.toLowerCase() === "status" && row[header]?.toLowerCase() === "inactive" ? "#F21E1E" : "black" }}>
                        {row[header] || "N/A"}
                      </span>
                    )}
                  </td>
                ))}
                <td>
                  {editId === row._id ? (
                    <>
                      <FaSave color="#23862A" style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => { handleSave(editData, editId); setEditId(null); }} />
                      <FaTimes color="#F21E1E" style={{ cursor: "pointer" }} onClick={() => setEditId(null)} />
                    </>
                  ) : (
                    <>
                      <FaEdit color="#005bfe" style={{ cursor: "pointer" }} onClick={() => handleEdit(row)} />
                      <RiDeleteBin6Line color="#F21E1E" style={{ cursor: "pointer" }} onClick={() => setDeleteId(row._id)} />
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + 2} style={{ textAlign: "center", color: "rgb(240 28 28)", fontWeight: "bold" }}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
      {deleteId !== null && (
        <div className="delete-modal" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <div className="delete-model-header">Are you sure you want to delete this row?</div>
              <div className="delete-modal-buttons">
                <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="delete-btn" onClick={() => { deleteRow(deleteId); setDeleteId(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
