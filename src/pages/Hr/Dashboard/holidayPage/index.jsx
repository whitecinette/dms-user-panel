import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.scss";

const HolidayPage = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [showForm, setShowForm] = useState(false);
    const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });

    const API_KEY = "YOUR_API_KEY"; // Replace with your Calendarific API key
    // Sign up at Calendarific
    // Get a free API key
    // Replace "YOUR_API_KEY" in the code.
    const countryCode = "IN"; // India

    useEffect(() => {
        fetchHolidays(year);
        loadCustomHolidays();
    }, [year]);

    // Fetch government holidays
    const fetchHolidays = async (selectedYear) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${selectedYear}&type=public`
            );
            const formattedHolidays = response.data.response.holidays.map((holiday) => ({
                date: holiday.date.iso,
                name: holiday.name,
                day: new Date(holiday.date.iso).toLocaleDateString("en-US", {
                    weekday: "long",
                }),
                isCustom: false, // Flag to differentiate official vs. custom holidays
            }));
            setHolidays(formattedHolidays);
            setError(null);
        } catch (err) {
            setError("Failed to fetch holidays. Please check your API key or try again later.");
        }
        setLoading(false);
    };
    useEffect(() => {
        const savedHolidays = JSON.parse(localStorage.getItem("holidays")) || [];
        setHolidays(savedHolidays);
    }, []);
    useEffect(() => {
        fetchHolidays(year);
    }, [year]);

    useEffect(() => {
        loadCustomHolidays();
    }, []);


    // Load custom holidays from local storage
    const loadCustomHolidays = () => {
        const storedHolidays = JSON.parse(localStorage.getItem("customHolidays")) || [];
        setHolidays((prevHolidays) => [...prevHolidays, ...storedHolidays]);
    };

    // Save custom holiday to local storage
    const handleAddHoliday = () => {
        if (newHoliday.date && newHoliday.name) {
            const newDate = new Date(newHoliday.date);
            const dayName = newDate.toLocaleDateString("en-US", { weekday: "long" });

            // Prevent duplicate holidays
            const isDuplicate = holidays.some(holiday => holiday.date === newHoliday.date);

            if (!isDuplicate) {
                const customHoliday = { ...newHoliday, day: dayName, isCustom: true };
                const updatedHolidays = [...holidays, customHoliday];
                setHolidays(updatedHolidays);

                // Save only custom holidays separately
                const storedCustomHolidays = JSON.parse(localStorage.getItem("customHolidays")) || [];
                const updatedCustomHolidays = [...storedCustomHolidays, customHoliday];
                localStorage.setItem("customHolidays", JSON.stringify(updatedCustomHolidays));
            }

            setNewHoliday({ date: "", name: "" });
            setShowForm(false);
        }
    };



    // Remove a holiday (only from custom added ones)
    const handleRemoveHoliday = (date) => {
        // Filter out the holiday to remove
        const updatedHolidays = holidays.filter(holiday => holiday.date !== date);
        setHolidays(updatedHolidays);

        // Update customHolidays in localStorage
        const storedCustomHolidays = JSON.parse(localStorage.getItem("customHolidays")) || [];
        const updatedCustomHolidays = storedCustomHolidays.filter(holiday => holiday.date !== date);
        localStorage.setItem("customHolidays", JSON.stringify(updatedCustomHolidays));
    };



    return (
        <div className="holiday-container">
            <h1>Holidays in {year}</h1>

            <div className="actions">
                <div className="year-selector">
                    <label>Select Year: </label>
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {Array.from({ length: 5 }, (_, i) => {
                            const newYear = new Date().getFullYear() + i;
                            return (
                                <option key={newYear} value={newYear}>
                                    {newYear}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <button className="add-holiday-btn" onClick={() => setShowForm(true)}>
                    + Add Holiday
                </button>
            </div>

            {loading && <p className="loading">Loading holidays...</p>}
            {error && <p className="error">{error}</p>}

            <div className="table-container">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Date</th>
                                <th>Holiday</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.length > 0 ? (
                                holidays.map((holiday, index) => (
                                    <tr key={index}>
                                        <td>{holiday.day}</td>
                                        <td>{new Date(holiday.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}</td>
                                        <td>{holiday.name}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleRemoveHoliday(holiday.date)}>
                                                ❌ Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="no-holidays">No holidays available.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Pop-up Form for Adding Holiday */}
            {showForm && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Add New Holiday</h2>
                        <input
                            type="date"
                            value={newHoliday.date}
                            onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Holiday Name"
                            value={newHoliday.name}
                            onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        />
                        <div className="popup-buttons">
                            <button className="save-btn" onClick={handleAddHoliday}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HolidayPage;
