import * as React from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import company_logo from "../../../company-logo.png";
import { Routes, Route } from "react-router-dom";
import { RiDashboardLine ,RiTimeLine,RiCoupon3Line } from "react-icons/ri";
import { FaUserCheck, FaUsersLine } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { TfiLock ,TfiAnnouncement} from "react-icons/tfi";
import { CiMapPin } from "react-icons/ci";
import Attendance from "../../../components/humanResourceCom/attendance";
import Dashboard from "../dashboardLayout";
import Payroll from "../../../components/humanResourceCom/payroll";
import { LuListTodo } from "react-icons/lu";
import Employees from "../employees";
import AttendanceDetails from "../../../components/humanResourceCom/attendance/AttendanceDetails";
import ToDoForEmployee from "../toDo";
// import Payroll from "../../../components/payroll";
const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

const HumanResourceSidebar = [
  { kind: "header", title: "Human Resource" },
  { segment: "hr-dashboard", title: "Dashboard", icon: <RiDashboardLine size={22} {...iconStyle} /> },
  { segment: "attendance", title: "Attendance", icon: <FaUserCheck size={22} {...iconStyle} /> },
  { segment: "vouchers", title: "Vouchers", icon: <RiCoupon3Line size={22} {...iconStyle} /> },
  { segment: "timeline", title: "Timeline", icon: <RiTimeLine size={22} {...iconStyle} /> },
  { segment: "beat-mapping", title: "Beat Mapping", icon: <CiMapPin size={22} {...iconStyle} /> },
  { segment: "announcements", title: "Announcements", icon: <TfiAnnouncement size={22} {...iconStyle} /> },
  { segment: "profile", title: "Profile", icon: <CgProfile size={22} {...iconStyle} /> },
  { segment: "logout", title: "Logout", icon: <TfiLock size={22} {...iconStyle} /> },
  // =====hDs=====
  { segment: "employees-todo", title: "ToDo", icon: <LuListTodo size={22} {...iconStyle} /> },
  { segment: "employees-payroll", title: "Payroll", icon: <GiTakeMyMoney size={22} {...iconStyle} /> },
  // =====hDs=====
];

function HumanResource(props) {
  const { user } = useAuth();

  return (
    <AppProvider
      navigation={HumanResourceSidebar}
      branding={{
        logo: <img src={company_logo} alt="MUI logo" />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
    >
      <DashboardLayout slots={{ sidebarFooter: () => null }}>
        <Routes>
          <Route path="/hr-dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          {/* ========hDs====== */}
          <Route path="/attendance-detail/:employeeCode" element={<AttendanceDetails />} />
          <Route path="/employees-data" element={<Employees />} />
          <Route path="/employees-payroll" element={<Payroll />} />
          <Route path="/employees-todo" element={<ToDoForEmployee />} />
          {/* ========hDs====== */}

          {/* <Route path="/payroll" element={<Payroll />}></Route> */}
          {/* <Route path="/vouchers" element={<Vouchers />}></Route> */}
          {/* <Route path="/timeline" element={<Timeline />}></Route> */}
          {/* <Route path="/beat-mapping" element={<BeatMapping />}></Route> */}
          {/* <Route path="/announcements" element={<Announcements />}></Route> */}
          {/* <Route path="/profile" element={<Profile />}></Route> */}
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}

HumanResource.propTypes = {
  window: PropTypes.func,
};

export default HumanResource;
