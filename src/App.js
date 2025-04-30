import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import Home from "./pages/home";
import Login from "./pages/login";
import EmployeeDashboard from "./dashboards/employee/employeeDashboard";
import DealerDashboard from "./dashboards/dealer/dealerDashboard";
import { AuthProvider } from "./context/AuthContext";
import MddDashboard from "./dashboards/mdd/mddDashboard";
import HumanResource from "./dashboards/humanResource/hrSidebar";
import SidebarEmployee from "./dashboards/employee/employeeSidebar";
import SidebarDealer from "./dashboards/dealer/dealerSidebar";
import PaySlipByEmployee from "./pages/Employee/paySlip";
import ProductList from "./components/dealer/products";
import Logout from "./components/logout";




function App() {
  const PrivateRoute = ({ element, roles = [] }) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" replace />;

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = tokenPayload.exp * 1000;
      const role = localStorage.getItem("role");

      if (new Date(expiryTime) < Date.now()) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }

      if (roles.length && !roles.includes(role)) {
        return <Navigate to={`/${role}/dashboard`} replace />; // or show a 403 page
      }

      return element;
    } catch (error) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  };

  const RoleRedirect = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return <Navigate to="/login" replace />;

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = tokenPayload.exp * 1000;

      if (new Date(expiryTime) < Date.now()) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
      }

      switch (role) {
        case "employee":
          return <Navigate to="/employee/dashboard" replace />;
        case "dealer":
          return <Navigate to="/dealer/dashboard" replace />;
        case "mdd":
          return <Navigate to="/mdd/dashboard" replace />;
        case "hr":
          return <Navigate to="/hr/dashboard" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    } catch (error) {
      localStorage.removeItem("token");
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
              <PrivateRoute roles={["mdd"]} element={<MddDashboard />} />
            }
          />
          <Route
            path="/hr/*"
            element={
              <PrivateRoute roles={["hr"]} element={<HumanResource />} />
            }
          />
          {/* ===========h.D.s========= */}
          <Route path="/get-pay-slip-by-emp" element={<PaySlipByEmployee />} />
          <Route path="/products-for-dealers" element={<ProductList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
