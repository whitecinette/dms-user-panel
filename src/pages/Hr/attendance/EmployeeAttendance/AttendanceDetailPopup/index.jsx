import React, { useState } from "react";
import "./style.scss";

const AttendanceDetailPopup = ({ record, onClose, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedRecord, setEditedRecord] = useState(record);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedRecord);
    setEditMode(false);
  };

  return (
    <div className="attendance-popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Attendance Details</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="popup-body">
          <div className="detail-grid">
            <div className="detail-column">
              <div className="detail-item">
                <label>Employee Name:</label>
                <span>{record.name}</span>
              </div>

              <div className="detail-item">
                <label>Employee Code:</label>
                <span>{record.code}</span>
              </div>

              <div className="detail-item">
                <label>Check In:</label>
                {editMode ? (
                  <input
                    type="time"
                    name="punchIn"
                    value={
                      editedRecord.punchIn
                        ? new Date(editedRecord.punchIn).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        : ""
                    }
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    {record.punchIn
                      ? new Date(record.punchIn).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </span>
                )}
              </div>

              <div className="detail-item">
                <label>Check In Location:</label>
                <span>{record.punchInName || "N/A"}</span>
              </div>
            </div>

            <div className="detail-column">
              <div className="detail-item">
                <label>Check Out:</label>
                {editMode ? (
                  <input
                    type="time"
                    name="punchOut"
                    value={
                      editedRecord.punchOut
                        ? new Date(editedRecord.punchOut).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        : ""
                    }
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    {record.punchOut
                      ? new Date(record.punchOut).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </span>
                )}
              </div>

              <div className="detail-item">
                <label>Check Out Location:</label>
                <span>{record.punchOutName || "N/A"}</span>
              </div>

              <div className="detail-item">
                <label>Total Hours:</label>
                <span>{record.hoursWorked || "N/A"}</span>
              </div>

              <div className="detail-item">
                <label>Status:</label>
                {editMode ? (
                  <select
                    name="status"
                    value={editedRecord.status}
                    onChange={handleChange}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                ) : (
                  <span
                    className={`status-badge ${record.status.toLowerCase()}`}
                  >
                    {record.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(record.punchInImage || record.punchOutImage) && (
            <div className="images-container">
              {record.punchInImage && (
                <div className="image-item">
                  <label>Check In Image:</label>
                  <img src={record.punchInImage} alt="Check In" />
                </div>
              )}
              {record.punchOutImage && (
                <div className="image-item">
                  <label>Check Out Image:</label>
                  <img src={record.punchOutImage} alt="Check Out" />
                </div>
              )}
            </div>
          )}
        </div>
        {record.status !== "Absent" && (
          <div className="popup-footer">
            {editMode ? (
              <>
                <button
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button className="save-button" onClick={handleSubmit}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  className="edit-button"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
                <button className="close-button" onClick={onClose}>
                  Close
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDetailPopup;
