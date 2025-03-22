import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiImageOn } from "react-icons/ci";
import Table from "../../table";
import config from "../../../config";
import { useLocation, useNavigate, useParams } from "react-router-dom";


const backend_url = config.backend_url;
const AttendanceDetails = () => {
    const location = useLocation();
    const { employeeCode } = useParams();
    const employeeName = location.state?.employeeName || "Unknown Employee"; // Fallback if no name is passed
    const navigate = useNavigate();
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [modalImage, setModalImage] = useState(null);


    useEffect(() => {
        fetchAttendance(employeeCode);
    }, [employeeCode]);

    const fetchAttendance = async (code) => {
        try {
            setLoading(true);
            const response = await axios.get(`${backend_url}/get-all-attendance`);
            const filteredData = response.data.attendance
                .filter((record) => record.code === code)
                .map((record) => ({
                    _id: record._id,
                    code: record.code,
                    name: record.name,
                    status: record.status,
                    punchIn: record.punchIn,
                    punchInImg: record.punchInImage,
                    punchOutImg: record.punchOutImage,
                    punchOut: record.punchOut,
                    hoursWorked: record.hoursWorked,
                }));
            setAttendanceData(filteredData);
            setFilteredAttendance(filteredData);
        } catch (err) {
            console.error("Failed to fetch attendance data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = attendanceData;
        if (startDate && endDate) {
            filtered = filtered.filter((row) => {
                const punchInDate = new Date(row.punchIn).toISOString().split("T")[0];
                return punchInDate >= startDate && punchInDate <= endDate;
            });
        }
        setFilteredAttendance(filtered);
    }, [startDate, endDate, attendanceData]);

    const openImageModal = (imgUrl) => {
        setModalImage(imgUrl);
    };

    const closeImageModal = (e) => {
        e.stopPropagation();
        setModalImage(null);
    };

    return (
        <div
            style={{
                // position: "fixed",
                // top: 0,
                // left: 0,
                width: "100%",
                height: "100vh",
                background: "rgb(255, 255, 255)",
                display: "flex",
                flexDirection: "column",
                justifyContent: 'space-between',
                color: "black",
                padding: "20px",
                zIndex: 9999,
            }}
        >
            <div>
                <h3>Attendance for: {employeeName}/{employeeCode}</h3>

                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table
                        data={{
                            headers: ["Code", "Name", "Status", "Punch In", "Punch In Img", "Punch Out Img", "Punch Out", "Hours Worked"],
                            data: filteredAttendance.map((row) => ({
                                Code: row.code || "N/A",
                                Name: row.name || "N/A",
                                Status: row.status || "N/A",
                                "Punch In": row.punchIn ? new Date(row.punchIn).toLocaleString() : "N/A",
                                "Punch In Img": row.punchInImg ? (
                                    <img
                                        src={row.punchInImg}
                                        alt="Punch In"
                                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                                        onClick={() => openImageModal(row.punchInImg)}
                                    />
                                ) : "No Image",
                                "Punch Out Img": row.punchOutImg ? (
                                    <img
                                        src={row.punchOutImg}
                                        alt="Punch Out"
                                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                                        onClick={() => openImageModal(row.punchOutImg)}
                                    />
                                ) : "No Image",
                                "Punch Out": row.punchOut ? new Date(row.punchOut).toLocaleString() : "N/A",
                                "Hours Worked": row.hoursWorked || "N/A",
                            })),
                            currentPage: 1,
                        }}
                    />
                )}
            </div>
            <div style={{ textAlign: "center" }}>
                <button
                    onClick={() => navigate(-1)}  // ✅ Correct function usage
                    style={{ padding: "10px 20px", backgroundColor: "red", color: "white", borderRadius:'20px', border:'none' }}
                >
                    Close
                </button>
            </div>

            {modalImage && (
                <div onClick={closeImageModal} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999 }}>
                    <img src={modalImage} alt="PunchImg" style={{ maxWidth: "90%", maxHeight: "90%" }} />
                </div>
            )}
        </div>
    );
};

export default AttendanceDetails;
