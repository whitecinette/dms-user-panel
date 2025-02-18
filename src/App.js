import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import EmployeeDashboard from "./dashboards/employee/employeeDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
