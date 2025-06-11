import React, { useEffect, useState } from "react";
import "./style.scss";
import axios from "axios";
import config from "../../../../config.js";
import { FaPlus } from "react-icons/fa";
import CustomAlert from "../../../../components/CustomAlert";

const backend_url = config.backend_url;

const formatDate = (dateInput) => {
  // Get only the date part to avoid time zone shift
  const datePart = dateInput?.slice(0, 10); // "YYYY-MM-DD"
  if (!datePart) return "N/A";

  const [year, month, day] = datePart.split("-");
  const dateObj = new Date(year, month - 1, day); // month is 0-indexed

  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate || "N/A";
};

const HrLeave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [leaveApplication, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveRequested, setIsLeaveRequested] = useState(false);
  const [leaveRequestForm, setLeaveRequestFrom] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  //handle leave request form
  const handleLeaveRequestForm = (e) => {
    const { name, value } = e.target;
    setLeaveRequestFrom((leave) => ({
      ...leave,
      [name]: value,
    }));
  };

  //get Leave Application
  const getLeaveApplication = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backend_url}/get-requested-leave-emp`, {
        params: {
          fromDate,
          toDate,
          status,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLeaveApplications(res.data.leaves);
    } catch (err) {
      console.log(err);
      setLeaveApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backend_url}/request-leave`,
        leaveRequestForm,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAlert({
        show: true,
        message: res.data.message,
        type: "success",
      });
      
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: error.response.data.message || "Error posting Leave Request",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setAlert({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
      setIsLeaveRequested(false);
      setLeaveRequestFrom({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    }
  };

  useEffect(() => {
    getLeaveApplication();
  }, [fromDate, toDate, status]);

  return (
    <div className="Hr-leave-page">
      {alert.show && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() =>
            setAlert({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
      <div className="Hr-leave-container">
        <div className="Hr-leave-filters">
          <div className="date-filter">
            <label htmlFor="fromDate">From</label>
            <input
              id="fromDate"
              name="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
              }}
            />
            <label htmlFor="toDate">To</label>
            <input
              id="toDate"
              name="toDate"
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            />
          </div>
          <div className="status-filter">
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={""}>Select Status</option>
              <option value={"pending"}>Pending</option>
              <option value={"rejected"}>Rejected</option>
              <option value={"approved"}>Approved</option>
            </select>
          </div>
        </div>
        <div className="hr-leave-button">
          <button
            className="request-leave-button"
            onClick={() => setIsLeaveRequested(true)}
          >
            <FaPlus /> Request Leave
          </button>
        </div>
      </div>
      <div className="leave-table-container">
        <table className="leave-table">
          <thead>
            <tr>
              <th>From Date</th>
              <th>To Date</th>
              <th>Total Days</th>
              <th>Status</th>
              <th>Leave Type</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  loading...
                </td>
              </tr>
            ) : leaveApplication.length > 0 ? (
              leaveApplication.map((application) => (
                <React.Fragment key={application._id}>
                  <tr className="leave-row">
                    <td>{formatDate(application.fromDate)}</td>
                    <td>{formatDate(application.toDate)}</td>
                    <td>{application.totalDays}</td>
                    <td>{application.status}</td>
                    <td>{application.leaveType}</td>
                    <td>{formatDate(application.appliedAt)}</td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isLeaveRequested && (
        <div className="leave-request" onClick={()=>setIsLeaveRequested(false)}>
          <div className="leave-request-container" onClick={(e)=>e.stopPropagation()}>
            <div className="leave-request-content">
              <div className="leave-request-header">Leave Request</div>
              <form onSubmit={(e)=>handleLeaveRequest(e)}>
                <select
                  name="leaveType"
                  value={leaveRequestForm.leaveType}
                  onChange={handleLeaveRequestForm}
                >
                  <option value={""}>Select Leave Type</option>
                  <option value={"casual"}>Casual</option>
                  <option value={"sick"}>Sick</option>
                  <option value={"earned"}>Earned</option>
                  <option value={"maternity"}>Maternity</option>
                  <option value={"paternity"}>Paternity</option>
                  <option value={"other"}>Other</option>
                </select>
                <label htmlFor="From">From</label>
                <input
                  type="date"
                  id="From"
                  name="fromDate"
                  value={leaveRequestForm.fromDate}
                  onChange={(e) => handleLeaveRequestForm(e)}
                />
                <label htmlFor="TO">To</label>
                <input
                  type="date"
                  id="To"
                  name="toDate"
                  value={leaveRequestForm.toDate}
                  onChange={(e) => handleLeaveRequestForm(e)}
                />
                <label htmlFor="reason">Reason</label>
                <textarea
                  name="reason"
                  id="reason"
                  value={leaveRequestForm.reason}
                  onChange={(e) => handleLeaveRequestForm(e)}
                ></textarea>

                <div className="leave-request-button">
                  <button className="leave-request-submit" type="submit">
                    Submit
                  </button>
                  <button
                    className="leave-request-cancel"
                    onClick={() => setIsLeaveRequested(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrLeave;
