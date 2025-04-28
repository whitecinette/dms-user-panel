import React, { useState } from "react";
import "./style.scss";

const HRRecruitment = () => {
    const [jobOpenings] = useState([
        { id: 1, title: "TSE", applicants: 12, status: "Open" },
        { id: 2, title: "Field Marketer", applicants: 8, status: "Open" },
        { id: 3, title: "Manager", applicants: 2, status: "Open" },
    ]);

    const [applicants, setApplicants] = useState([
        { id: 1, name: "Marshall Nichols", email: "marshall-n@gmail.com", position: "Field-Marketer", date: "24 Jun, 2015", status: "Interview" },
        { id: 2, name: "Susie Willis", email: "sussie-w@gmail.com", position: "TSE", date: "28 Jun, 2015", status: "Interview" },
        { id: 3, name: "Debra Stewart", email: "debra@gmail.com", position: "Manager", date: "21 July, 2015", status: "Rejected" },
        { id: 4, name: "Francisco Vasquez", email: "francisv@gmail.com", position: "Office Boy", date: "18 Jan, 2016", status: "Interview" },
        { id: 5, name: "Jane Hunt", email: "jane-hunt@gmail.com", position: "HR", date: "08 Mar, 2016", status: "Interviewed" },
    ]);

    const [newApplicant, setNewApplicant] = useState({
        name: "",
        position: "",
        status: "Interview",
    });

    const [showForm, setShowForm] = useState(false);

    const handleStatusChange = (id, newStatus) => {
        setApplicants((prev) =>
            prev.map((applicant) =>
                applicant.id === id ? { ...applicant, status: newStatus } : applicant
            )
        );
    };

    const handleAddApplicant = () => {
        if (!newApplicant.name || !newApplicant.position) return;

        const currentDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        const newEntry = {
            id: applicants.length + 1,
            name: newApplicant.name,
            // email: `${newApplicant.name.toLowerCase().replace(/\s/g, "-")}@gmail.com`,
            email: newApplicant.email,
            position: newApplicant.position,
            date: currentDate,
            status: newApplicant.status,
        };

        setApplicants([...applicants, newEntry]);
        setNewApplicant({ name: "", position: "", status: "Interview" });
        setShowForm(false);
    };

    return (
        <div className="recruitment-container">
            <h2 className="title">HR Recruitment Dashboard</h2>

            {/* 🔹 Job Openings Section */}
            <div className="job-openings">
                {jobOpenings.map((job) => (
                    <div className="job-card" key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.applicants} Applicants</p>
                        <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                    </div>
                ))}
            </div>

            {/* 🔹 Add Applicant Button */}
            <button className="add-applicant-btn" onClick={() => setShowForm(true)}>
                Add Applicant
            </button>

            {/* 🔹 Pop-up Modal Form */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add New Applicant</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newApplicant.name}
                            onChange={(e) => setNewApplicant({ ...newApplicant, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="E-Mail"
                            value={newApplicant.email}
                            onChange={(e) => setNewApplicant({ ...newApplicant, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Apply For (Position)"
                            value={newApplicant.position}
                            onChange={(e) => setNewApplicant({ ...newApplicant, position: e.target.value })}
                        />
                        <select
                            value={newApplicant.status}
                            onChange={(e) => setNewApplicant({ ...newApplicant, status: e.target.value })}
                        >
                            <option value="Hired">Hired</option>
                            <option value="Interview">Interview</option>
                            <option value="Interviewed">Interviewed</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="submit-btn" onClick={handleAddApplicant}>Submit</button>
                            <button className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            {/* 🔹 Applicants Section */}
            <div className="applicants-section">
                <h3 className="subtitle">Recent Applicants</h3>
                <div className="applicants-table-container">
                    <table className="applicants-table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>APPLY FOR</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant) => (
                                <tr key={applicant.id}>
                                    <td>
                                        <div className="applicant-info">
                                            <span className="avatar">{applicant.name.charAt(0)}</span>
                                            <div className="applicant-details">
                                                <strong>{applicant.name}</strong>
                                                <p>{applicant.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{applicant.position}</td>
                                    <td>{applicant.date}</td>
                                    <td>
                                        <select
                                            className={`status-dropdown ${applicant.status.toLowerCase()}`}
                                            value={applicant.status}
                                            onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                        >
                                            <option value="Hired">Hired</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Interviewed">Interviewed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HRRecruitment;
