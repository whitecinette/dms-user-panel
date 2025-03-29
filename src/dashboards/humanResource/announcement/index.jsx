import React, { useEffect, useState } from "react";
import "./style.scss";

const Announcements = () => {
    const INITIAL_VISIBLE = 3;

    const [announcements, setAnnouncements] = useState([
        { id: "today-announcement", title: "📢 Today's Announcement", content: [] },
        { id: "employee-announcement", title: "👥 Employee Related Announcement", content: [] },
        { id: "policy-training", title: "📚 Policy & Training Announcement", content: [] },
        { id: "event-celebration", title: "🎉 Event & Celebration Announcement", content: [] },
        { id: "performance-announcement", title: "🏆 Performance Announcement", content: [] },
        { id: "administrative-announcement", title: "🛠️ Administrative Announcement", content: [] }
    ]);
    useEffect(() => {
        const todayAnnouncement = announcements.find((ann) => ann.id === "today-announcement");
        if (todayAnnouncement) {
          localStorage.setItem("todayAnnouncement", JSON.stringify(todayAnnouncement.content));
        }
      }, []);
    const [expandedSections, setExpandedSections] = useState(Array(announcements.length).fill(false));
    const [showModal, setShowModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        date: "",
        type: "",
        description: ""
    });

    const today = new Date().toISOString().split("T")[0];

    const toggleSection = (index) => {
        setExpandedSections((prevState) => {
            const updatedSections = [...prevState];
            updatedSections[index] = !updatedSections[index];
            return updatedSections;
        });
    };

    const handleAddAnnouncement = () => {
        if (!newAnnouncement.date || !newAnnouncement.description) {
            alert("Please fill all fields");
            return;
        }
    
        const isToday = newAnnouncement.date === today;
        const announcementType = isToday ? "today-announcement" : newAnnouncement.type;
    
        if (!announcementType) {
            alert("Please select an announcement type");
            return;
        }
    
        setAnnouncements((prev) =>
            prev.map((announcement) =>
                announcement.id === announcementType
                    ? { ...announcement, content: [...announcement.content, `${newAnnouncement.date}: ${newAnnouncement.description}`] }
                    : announcement
            )
        );
    
        // 🟢 Update localStorage if it's today's announcement
        if (isToday) {
            const updatedTodayAnnouncements = [...JSON.parse(localStorage.getItem("todayAnnouncement") || "[]"), newAnnouncement.description];
            localStorage.setItem("todayAnnouncement", JSON.stringify(updatedTodayAnnouncements));
        }
    
        setNewAnnouncement({ date: "", type: "", description: "" });
        setShowModal(false);
    };
    

    return (
        <div className="announcement-container">
            <h1>Company Announcements</h1>
            <button className="add-announcement-btn" onClick={() => setShowModal(true)}>
                Add Announcement
            </button>

            {/* 🟢 TODAY'S ANNOUNCEMENT */}
            <h2>📢 Today's Announcement</h2>
            <div className="announcement-section">
                {announcements
                    .filter((a) => a.id === "today-announcement")
                    .map((ann) =>
                        (
                            <div key={ann.id}>
                              {/* <h3>{ann.title}</h3> */}
                              <ul>
                                {ann.content.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )
                    )}
            </div>

            {/* 🔵 UPCOMING ANNOUNCEMENTS */}
            <h2>📅 Upcoming Announcements</h2>
            {announcements
                .filter((a) => a.id !== "today-announcement")
                .map((announcement, index) => (
                    <div className="announcement-section" key={index}>
                        <h3>{announcement.title}</h3>
                        {announcement.content
                            .slice(0, expandedSections[index] ? announcement.content.length : INITIAL_VISIBLE)
                            .map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                            ))}

                        {announcement.content.length > INITIAL_VISIBLE && (
                            <button className="load-more-btn" onClick={() => toggleSection(index)}>
                                {expandedSections[index] ? "Show Less" : "Load More"}
                            </button>
                        )}
                    </div>
                ))}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add Announcement</h2>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={newAnnouncement.date}
                            min={today}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                        />

                        {!newAnnouncement.date || newAnnouncement.date !== today ? (
                            <>
                                <label>Announcement Type:</label>
                                <select
                                    value={newAnnouncement.type}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                >
                                    <option value="">Select Type</option>
                                    {announcements
                                        .filter((a) => a.id !== "today-announcement")
                                        .map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.title}
                                            </option>
                                        ))}
                                </select>
                            </>
                        ) : null}

                        <label>Description:</label>
                        <textarea
                            value={newAnnouncement.description}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                        />

                        <button className="save-btn" onClick={handleAddAnnouncement}>
                            Save
                        </button>
                        <button className="close-btn" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
