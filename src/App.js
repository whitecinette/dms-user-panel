import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import EmployeeDashboard from "./dashboards/employee/employeeDashboard";
import DealerDashboard from "./dashboards/dealer/dealerDashboard";
import { AuthProvider } from "./context/AuthContext";
import MddDashboard from "./dashboards/mdd/mddDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
          <Route path="/dealer/dashboard/*" element={<DealerDashboard />} />
          <Route path="/mdd/dashboard/*" element={<MddDashboard />} />         
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
