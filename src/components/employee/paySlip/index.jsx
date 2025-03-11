import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa6";
import "./style.scss";
import config from "../../../config";

const {backend_url} = config;
const PaySlipByEmployee = () => {
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const payslipRef = useRef();

    const employeeId = "67ac9dbee723439cdafb3915";

    useEffect(() => {
        const fetchPaySlip = async () => {
            try {
                const response = await axios.get(`${backend_url}/get-salary/${employeeId}`);
                setPayslip(response.data.paySlip);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch payslip");
            } finally {
                setLoading(false);
            }
        };

        fetchPaySlip();
    }, [employeeId]);

    const downloadPDF = () => {
        if (!payslipRef.current) return;
        html2canvas(payslipRef.current, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("Payslip.pdf");
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!payslip) return <p>No payslip data available</p>;

    return (
        <div className="payslip-container">
            <div className="dwn-btn-container">
                <button className="download-btn" onClick={downloadPDF}>
                    <FaDownload />
                </button>
            </div>

            <div ref={payslipRef} className="payslip-content">
                {/* Company Details */}
                <div className="company-name">
                    <div className="company-details">
                        <div >
                            <img src="./sc.jpg" width={100} alt="Company Logo" />
                        </div>
                        <div>
                            <h2>Siddha Corporation</h2>
                        </div>
                        <div>
                            <p>Address: abc road,<br /> xyz city, 123456</p>
                        </div>
                    </div>
                </div>

                <h2 className="title">EMPLOYEE SALARY SLIP</h2>

                {/* Employee Details */}
                <div className="header-section">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="4">Employee Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>{payslip.employeeDetails?.name || "N/A"}</td>
                                <td><strong>UID:</strong></td>
                                <td>{payslip.employeeDetails?.code || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><strong>Designation:</strong></td>
                                <td>{payslip.employeeDetails?.position || "N/A"}</td>
                                <td><strong>Company:</strong></td>
                                <td>Siddha Corporation</td>
                            </tr>
                            <tr>
                                <td><strong>Bank Name:</strong></td>
                                <td>{payslip.employeeDetails?.bankName || "N/A"}</td>
                                <td><strong>Bank Account Number:</strong></td>
                                <td>{payslip.employeeDetails?.bankAccNumber || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><strong>Date Of Joining:</strong></td>
                                <td>{payslip.employeeDetails?.joinDate || "N/A"}</td>
                                <td><strong>PF Account Number:</strong></td>
                                <td>{payslip.employeeDetails?.pfAccNumber || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><strong>Branch:</strong></td>
                                <td>{payslip.employeeDetails?.branch || "N/A"}</td>
                                <td><strong>State:</strong></td>
                                <td>{payslip.employeeDetails?.state || "N/A"}</td>
                            </tr>
                            <tr>
                                <td><strong>Payment Date:</strong></td>
                                <td colSpan="3">
                                    {payslip.salaryDetails?.paymentDate
                                        ? new Date(payslip.salaryDetails.paymentDate).toLocaleDateString()
                                        : "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Salary Breakdown */}
                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>EMOLUMENTS</th>
                            <th>AMOUNT (₹)</th>
                            <th>DEDUCTIONS</th>
                            <th>AMOUNT (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["Basic Pay", payslip.salaryDetails?.basicSalary],
                            ["Bonuses", payslip.salaryDetails?.bonuses],
                            ["Leave Days", payslip.salaryDetails?.leaveDays],
                            ["Half Days", payslip.salaryDetails?.halfDays],
                        ].map(([label, value], index) => (
                            <tr key={index}>
                                <td>{label}</td>
                                <td>{value ? value.toFixed(2) : "0.00"}</td>
                                <td>{index === 0 ? "Tax Amount" : index === 1 ? "Deductions" : index === 2 ? "Half-Day Deduction" : "Total Deductions"}</td>
                                <td>
                                    {index === 0
                                        ? payslip.salaryDetails?.taxAmount?.toFixed(2) || "0.00"
                                        : index === 1
                                            ? payslip.salaryDetails?.deductions?.toFixed(2) || "0.00"
                                            : index === 2
                                                ? payslip.salaryDetails?.halfDayDeduction?.toFixed(2) || "0.00"
                                                : payslip.salaryDetails?.totalDeductions?.toFixed(2) || "0.00"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2"><strong>GROSS SALARY:</strong> ₹{((payslip.salaryDetails?.basicSalary || 0) + (payslip.salaryDetails?.bonuses || 0)).toFixed(2)}</td>
                            <td colSpan="2"><strong>NET PAY:</strong> ₹{payslip.salaryDetails?.netSalary?.toFixed(2) || "0.00"}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default PaySlipByEmployee;
