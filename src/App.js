import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import EmployeeDashboard from "./dashboards/employee/employeeDashboard";
import DealerDashboard from "./dashboards/dealer/dealerDashboard";
import { AuthProvider } from "./context/AuthContext";
import MddDashboard from "./dashboards/mdd/mddDashboard";
import HumanResource from "./dashboards/humanResource/hrSidebar";
import SidebarEmployee from "./dashboards/employee/employeeSidebar";
import SidebarDealer from "./dashboards/dealer/dealerSidebar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee/dashboard/*" element={<SidebarEmployee />} />
          <Route path="/dealer/dashboard/*" element={<SidebarDealer />} />
          <Route path="/mdd/dashboard/*" element={<MddDashboard />} />    
          <Route path = "/*" element ={<HumanResource /> } />     
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
