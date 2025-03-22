import React, { useState, useEffect } from "react";
import config from "../../../config";
import "./style.scss";
import axios from "axios";

const backend_url = config.backend_url;

const ToDoForEmployee = () => {
    const [employees, setEmployees] = useState([]); // Store fetched employees
    const [tasks, setTasks] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", details: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTask, setSearchTask] = useState(""); // New state for task search
    const [editingTask, setEditingTask] = useState(null); // Store task being edited
    const [selectedStatuses, setSelectedStatuses] = useState([]);


    useEffect(() => {
        fetchEmpThroughActorCode();
    }, []);
    // Fetch employees from backend
    const fetchEmpThroughActorCode = async () => {
        try {
            const response = await axios.get(`${backend_url}/actorCode/get-actorCode-for-admin`);
            const employeeList = response.data.employeeList || [];
            console.log("Fetched Employees:", employeeList);
            setEmployees(employeeList); // Store all employees
        } catch (err) {
            console.error("Failed to fetch employee data:", err);
            setEmployees([]); // Ensure it doesn't break UI
        }
    };

    // useEffect(() => {
    //     fetchEmpThroughActorCode(); // Fetch employees on component mount
    // }, []);

    const openTaskModal = (employee) => {
        setSelectedEmployee(employee);
    };

    const closeTaskModal = () => {
        setSelectedEmployee(null);
        setNewTask({ title: "", details: "" });
    };

    const handleAssignTask = () => {
        if (newTask.title && newTask.details && selectedEmployee) {
            const assignedDate = new Date().toLocaleDateString(); // Get current date
            setTasks((prevTasks) => {
                const updatedTasks = {
                    ...prevTasks,
                    [selectedEmployee.employee_code]: [
                        ...(prevTasks[selectedEmployee.employee_code] || []),
                        { ...newTask, assignedDate, status: "Pending" }, // Add date and status
                    ],
                };
                console.log("Updated Tasks:", updatedTasks);
                return updatedTasks;
            });
            closeTaskModal();
        }
    };

    const handleEditTask = (empCode, index) => {
        const taskToEdit = tasks[empCode][index];
        setEditingTask({ empCode, index, ...taskToEdit });
    };

    const handleSaveTask = () => {
        if (editingTask) {
            setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
                updatedTasks[editingTask.empCode][editingTask.index] = {
                    title: editingTask.title,
                    details: editingTask.details,
                    assignedDate: editingTask.assignedDate,
                    status: editingTask.status,
                };
                return updatedTasks;
            });
            setEditingTask(null);
        }
    };

    const handleDeleteTask = (empCode, index) => {
        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            updatedTasks[empCode].splice(index, 1);
            if (updatedTasks[empCode].length === 0) {
                delete updatedTasks[empCode];
            }
            return updatedTasks;
        });
    };

    // Filter employees based on search input (Handle undefined properties)
    const filteredEmployees = employees.filter((emp) =>
        emp.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // **Filter Tasks based on search**
    const filteredTasks = Object.entries(tasks)
        .map(([empCode, empTasks]) => {
            const employee = employees.find((e) => String(e.employee_code) === String(empCode));

            // Filter tasks based on employee name, employee code, or task title
            const matchesEmployee =
                employee?.employee_name?.toLowerCase().includes(searchTask.toLowerCase()) ||
                empCode.toLowerCase().includes(searchTask.toLowerCase());

            const matchingTasks = empTasks.filter(task =>
                task.title.toLowerCase().includes(searchTask.toLowerCase())
            );

            // Include employees if either their name/code matches OR at least one task matches
            if (matchesEmployee || matchingTasks.length > 0) {
                return [empCode, matchingTasks.length > 0 ? matchingTasks : empTasks]; // Keep original tasks if no specific task matches
            }
            return null;
        })
        .filter(Boolean) // Remove null entries
        .reduce((acc, [empCode, empTasks]) => {
            acc[empCode] = empTasks;
            return acc;
        }, {});

    // Function to handle checkbox selection
    const handleStatusFilterChange = (status) => {
        setSelectedStatuses((prevStatuses) =>
            prevStatuses.includes(status)
                ? prevStatuses.filter((s) => s !== status)
                : [...prevStatuses, status]
        );
    };

    // Filter tasks based on selected status
    const filteredTasksByStatus = Object.entries(filteredTasks)
        .map(([empCode, empTasks]) => {
            const matchingTasks = empTasks.filter(task =>
                selectedStatuses.length === 0 || selectedStatuses.includes(task.status)
            );

            return matchingTasks.length > 0 ? [empCode, matchingTasks] : null;
        })
        .filter(Boolean)
        .reduce((acc, [empCode, empTasks]) => {
            acc[empCode] = empTasks;
            return acc;
        }, {});
    return (
        <div className="container">
            <h1>
                Hello, <span className="username">HR</span>, Assign Tasks to Employees
            </h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search employee by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Employee List */}
            <div className="employee-list">
                <h3>Employee List</h3>
                <div className="employee-list-table">
                    <table>
                        <thead>
                            <tr className="list-header">
                                <th>Employee Code</th>
                                <th>Employee Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id}>
                                        <td>{emp.employee_code || "N/A"}</td>
                                        <td>{emp.employee_name || "N/A"}</td>
                                        <td>
                                            <button onClick={() => openTaskModal(emp)}>Assign</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-results">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Assignment Popup */}
            {selectedEmployee && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Assign Task to {selectedEmployee.employee_name || "Employee"}</h3>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask({ ...newTask, title: e.target.value })
                            }
                        />
                        <textarea
                            placeholder="Task Details"
                            value={newTask.details}
                            onChange={(e) =>
                                setNewTask({ ...newTask, details: e.target.value })
                            }
                        ></textarea>
                        <button onClick={handleAssignTask}>Assign</button>
                        <button onClick={closeTaskModal} className="cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Assigned Tasks */}
            <div className="task-list">
                <div className="task-list-header">
                    <h3>Assigned Tasks</h3>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by employee name or Task"
                            value={searchTask}
                            onChange={(e) => setSearchTask(e.target.value)}
                        />
                    </div>
                    {/* Status Filter Checkboxes */}
                    <div className="status-filters">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes("Pending")}
                                onChange={() => handleStatusFilterChange("Pending")}
                            />
                            Pending
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes("In-Process")}
                                onChange={() => handleStatusFilterChange("In-Process")}
                            />
                            In-Process
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes("Complete")}
                                onChange={() => handleStatusFilterChange("Complete")}
                            />
                            Complete
                        </label>
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {employees.length > 0 && Object.entries(filteredTasks).length > 0 ? (
                        Object.entries(filteredTasksByStatus).map(([empCode, empTasks]) => {

                            const employee = employees.find((e) => String(e.employee_code) === String(empCode));
                            return (
                                <div style={{ width: '50%' }}>
                                    <div key={empCode} className="task-group">
                                        <div>
                                            <h4>{employee ? employee.employee_name : `Employee Code: ${empCode}`}</h4>

                                        </div>
                                        <div className="emp-task">
                                            {empTasks.map((task, index) => (
                                                <div key={index} className="task-card">
                                                    <div className="task-header">
                                                        <h3>Task: {task.title}</h3>
                                                        <div className="status">
                                                            <span className={`status-${task.status.toLowerCase()}`}>{task.status}</span>
                                                        </div>
                                                    </div>
                                                    <h5>{task.details}</h5>
                                                    <h5 className="assigned-date">Assigned On: {task.assignedDate}</h5>
                                                    <div className="task-actions">
                                                        <button onClick={() => handleEditTask(empCode, index)}>Edit</button>
                                                        <button onClick={() => handleDeleteTask(empCode, index)}>Delete</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No tasks assigned yet.</p>
                    )
                    }
                </div>
            </div>
            {editingTask && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Task</h3>
                        <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        />
                        <textarea
                            value={editingTask.details}
                            onChange={(e) => setEditingTask({ ...editingTask, details: e.target.value })}
                        ></textarea>
                        <button onClick={handleSaveTask}>Save</button>
                        <button onClick={() => setEditingTask(null)} className="cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToDoForEmployee;
