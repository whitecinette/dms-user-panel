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
import Attendance from "./components/employee/attendance";
import PaySlipByEmployee from "./components/employee/paySlip";
import ProductList from "./components/dealer/products";

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
          {/* ===========h.D.s========= */}
          {/* <Route path="/get-attendance" element={<Attendance />} /> */}
          <Route path="/get-pay-slip-by-emp" element={<PaySlipByEmployee />} />
          <Route path="/products-for-dealers" element={<ProductList />} />
   
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
