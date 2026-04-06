import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import Logout from "./components/logout";
import PrivateRoute from "./components/PrivateRoute";
import EmailVerifyPage from "./components/EmailVerifyPage";
import PaySlipByEmployee from "./pages/Employee/paySlip";
import DynamicSidebarLayout from "./components/dynamic/DynamicSidebarLayout";
import { clearAuthStorage } from "./utils/authStorage";

// OLD IMPORTS (kept commented for later use)
// import EmployeeDashboard from "./dashboards/employee/employeeDashboard";
// import DealerDashboard from "./dashboards/dealer/dealerDashboard";
// import MddDashboard from "./dashboards/mdd/mddDashboard";
// import HumanResource from "./dashboards/humanResource/hrSidebar";
// import SidebarEmployee from "./dashboards/employee/employeeSidebar";
// import SidebarDealer from "./dashboards/dealer/dealerSidebar";
// import SidebarMdd from "./dashboards/mdd/mddSidebar";

function App() {
  const RoleRedirect = () => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" replace />;

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = tokenPayload.exp * 1000;

      if (new Date(expiryTime) < Date.now()) {
        clearAuthStorage();
        return <Navigate to="/login" replace />;
      }

      return <Navigate to="/app" replace />;
    } catch (error) {
      clearAuthStorage();
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/verify-email" element={<EmailVerifyPage />} />

          <Route
            path="/app/*"
            element={
              <PrivateRoute
                roles={["employee", "dealer", "mdd", "hr", "admin", "super_admin"]}
                element={<DynamicSidebarLayout />}
              />
            }
          />

          {/*
          <Route
            path="/employee/dashboard/*"
            element={
              <PrivateRoute
                roles={["employee"]}
                element={<SidebarEmployee />}
              />
            }
          />
          <Route
            path="/dealer/*"
            element={
              <PrivateRoute roles={["dealer"]} element={<SidebarDealer />} />
            }
          />
          <Route
            path="/mdd/*"
            element={
              <PrivateRoute roles={["mdd"]} element={<SidebarMdd />} />
            }
          />
          <Route
            path="/hr/*"
            element={
              <PrivateRoute roles={["hr"]} element={<HumanResource />} />
            }
          />
          */}

          <Route path="/get-pay-slip-by-emp" element={<PaySlipByEmployee />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;