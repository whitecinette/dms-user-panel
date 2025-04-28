import React, { useState } from "react";
import "./style.scss";
import { FaEdit, FaSave } from "react-icons/fa";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        fullName: "Monkey D. Luffy",
        dob: "March 15th, 1999",
        gender: "Male",
        maritalStatus: "Single",
        phone: "+91 123457890",
        email: "kingofpirates@gmail.com",
        address: "Dawn Island, East Blue",
        bankName: "Marine Bank",
        accountNo: "159843014641",
        ifsc: "IC124504",
        pan: "TC000Y56",
        emergencyPrimary: { name: "Monkey D. Dragon", relation: "Father", phone: "9876543210" },
        emergencySecondary: { name: "Gold D. Ace", relation: "Brother", phone: "9876543210" },
        certificates: ["Certified HR Manager", "Leadership in HR", "Workplace Compliance"],
        qualifications: ["MBA in HR", "BBA in Management", "Diploma in Industrial Relations"],
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle emergency contact change
    const handleEmergencyChange = (e, type) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [type]: { ...prev[type], [name]: value },
        }));
    };

    // Toggle edit mode
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="profile-container">
            <main className="profile-main">
                <h1>HR Profile</h1>
                <div className="profile-header">
                    <div className="profile-img-nd-info">
                        <div className="profile-card">
                            <img
                                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a7f44195-647e-4a6d-9fb1-cbbeb953e9e2/dg6j2ox-39c6dbf6-cd10-4a19-96bf-bd187e19adc4.png/v1/fill/w_1600,h_2245,q_80,strp/monkey_d__luffy_real_life_by_shibuz4_dg6j2ox-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI0NSIsInBhdGgiOiJcL2ZcL2E3ZjQ0MTk1LTY0N2UtNGE2ZC05ZmIxLWNiYmViOTUzZTllMlwvZGc2ajJveC0zOWM2ZGJmNi1jZDEwLTRhMTktOTZiZi1iZDE4N2UxOWFkYzQucG5nIiwid2lkdGgiOiI8PTE2MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.q2EVHkF-qP_tv6oQTdJejOlJ9Zl1h2sfldyUvL7UCT0"
                                alt="profile"
                            />
                        </div>
                        <div className="profile-info">
                            {/* <div className="profile-name"> */}
                                <h2>{userInfo.fullName}</h2>
                                <p className="profile-role">Human Resource</p>
                                <h5>Employee-Code: SC-HR0001</h5>
                                <p className="profile-join-date">Date of Joining: 01-01-2023</p>
                            {/* </div> */}
                        </div>
                    </div>
                    <button className="edit-btn" onClick={toggleEdit}>
                        {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? "Save" : "Edit Profile"}
                    </button>
                </div>

                <div className="profile-details">
                    <div className="profile-section">
                        <h3>Personal Information</h3>
                        <p><strong>Date of Birth:</strong> {isEditing ? <input type="text" name="dob" value={userInfo.dob} onChange={handleChange} /> : userInfo.dob}</p>
                        <p><strong>Gender:</strong> {isEditing ? <input type="text" name="gender" value={userInfo.gender} onChange={handleChange} /> : userInfo.gender}</p>
                        <p><strong>Marital Status:</strong> {isEditing ? <input type="text" name="maritalStatus" value={userInfo.maritalStatus} onChange={handleChange} /> : userInfo.maritalStatus}</p>
                        <p><strong>Phone:</strong> {isEditing ? <input type="text" name="phone" value={userInfo.phone} onChange={handleChange} /> : userInfo.phone}</p>
                        <p><strong>Email:</strong> {isEditing ? <input type="text" name="email" value={userInfo.email} onChange={handleChange} /> : userInfo.email}</p>
                        <p><strong>Address:</strong> {isEditing ? <input type="text" name="address" value={userInfo.address} onChange={handleChange} /> : userInfo.address}</p>
                    </div>

                    <div className="profile-section">
                        <h3>Bank Information</h3>
                        {/* <p><strong>Bank Name:</strong> {isEditing ? <input type="text" name="bankName" value={userInfo.bankName} onChange={handleChange} /> : userInfo.bankName}</p>
                        <p><strong>Account No:</strong> {isEditing ? <input type="text" name="accountNo" value={userInfo.accountNo} onChange={handleChange} /> : userInfo.accountNo}</p>
                        <p><strong>IFSC Code:</strong> {isEditing ? <input type="text" name="ifsc" value={userInfo.ifsc} onChange={handleChange} /> : userInfo.ifsc}</p>
                        <p><strong>PAN No:</strong> {isEditing ? <input type="text" name="pan" value={userInfo.pan} onChange={handleChange} /> : userInfo.pan}</p> */}
                        <p><strong>Bank Name:</strong> {userInfo.bankName}</p>
                        <p><strong>Account No:</strong> {userInfo.accountNo}</p>
                        <p><strong>IFSC Code:</strong> {userInfo.ifsc}</p>
                        <p><strong>PAN No:</strong> {userInfo.pan}</p>
                    </div>

                    <div className="profile-section">
                        <h3>Emergency Contact</h3>
                        <p><strong>Primary:</strong>
                            {isEditing ? (
                                <>
                                    <input type="text" name="name" value={userInfo.emergencyPrimary.name} onChange={(e) => handleEmergencyChange(e, "emergencyPrimary")} />
                                    <input type="text" name="relation" value={userInfo.emergencyPrimary.relation} onChange={(e) => handleEmergencyChange(e, "emergencyPrimary")} />
                                    <input type="text" name="phone" value={userInfo.emergencyPrimary.phone} onChange={(e) => handleEmergencyChange(e, "emergencyPrimary")} />
                                </>
                            ) : `${userInfo.emergencyPrimary.name} (${userInfo.emergencyPrimary.relation}) - ${userInfo.emergencyPrimary.phone}`}
                        </p>
                        <p><strong>Secondary:</strong>
                            {isEditing ? (
                                <>
                                    <input type="text" name="name" value={userInfo.emergencySecondary.name} onChange={(e) => handleEmergencyChange(e, "emergencySecondary")} />
                                    <input type="text" name="relation" value={userInfo.emergencySecondary.relation} onChange={(e) => handleEmergencyChange(e, "emergencySecondary")} />
                                    <input type="text" name="phone" value={userInfo.emergencySecondary.phone} onChange={(e) => handleEmergencyChange(e, "emergencySecondary")} />
                                </>
                            ) : `${userInfo.emergencySecondary.name} (${userInfo.emergencySecondary.relation}) - ${userInfo.emergencySecondary.phone}`}
                        </p>
                    </div>
                </div>

                <div className="extra-info">
                    <div className="card">
                        <h3>Certificates</h3>
                        <ul>
                            {userInfo.certificates.map((cert, index) => (
                                <li key={index}>{cert}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="card">
                        <h3>Qualifications</h3>
                        <ul>
                            {userInfo.qualifications.map((qual, index) => (
                                <li key={index}>{qual}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
