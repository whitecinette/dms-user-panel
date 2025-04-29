import * as React from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import company_logo from "../../../company-logo.png";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { RiDashboardLine, RiTimeLine, RiCoupon3Line } from "react-icons/ri";
import { FaUserCheck, FaUsersLine } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { TfiLock, TfiAnnouncement } from "react-icons/tfi";
import { CiMapPin } from "react-icons/ci";
import { GiHumanPyramid } from "react-icons/gi";
import Attendance from "../../../pages/Hr/attendance";
import Payroll from "../../../pages/Hr/payroll/index.jsx";
import { LuListTodo } from "react-icons/lu";
import AttendanceDetails from "../../../pages/Hr/attendance/AttendanceDetails";
import ToDoForEmployee from "../../../pages/Hr/toDo";
import Profile from "../../../pages/Hr/Profile";
import HolidayPage from "../../../pages/Hr/Dashboard/holidayPage";
import Report from "../../../pages/Hr/report";
import DealersAccounts from "../../../pages/Hr/accounts";
import HRRecruitment from "../../../pages/Hr/RecruitmentPage";
import Vouchers from "../../../pages/Hr/vouchers";
import Logout from "../../../components/logout";
import Dashboard from "../../../pages/Hr/Dashboard";
import Announcements from "../../../pages/Hr/Announcements";
import Timeline from "../../../pages/Hr/Timeline";
import Employees from "../../../pages/Hr/Dashboard/employees";
import BeatMapping from "../../../pages/Hr/BeatMapping";
// import Payroll from "../../../components/payroll";
const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

const HumanResourceSidebar = [
  { kind: "header", title: "Human Resource" },
  {
    segment: "hr/dashboard/",
    title: "Dashboard",
    icon: <RiDashboardLine size={22} {...iconStyle} />,
  },
  {
    segment: "hr/attendance",
    title: "Attendance",
    icon: <FaUserCheck size={22} {...iconStyle} />,
  },
  // =====hDs=====
  {
    segment: "hr/vouchers",
    title: "Vouchers",
    icon: <RiCoupon3Line size={22} {...iconStyle} />,
  },
  // =====hDs=====
  {
    segment: "hr/timeline",
    title: "Timeline",
    icon: <RiTimeLine size={22} {...iconStyle} />,
  },
  {
    segment: "hr/beat-mapping",
    title: "Beat Mapping",
    icon: <CiMapPin size={22} {...iconStyle} />,
  },
  // =====hDs=====
  {
    segment: "hr/announcements",
    title: "Announcements",
    icon: <TfiAnnouncement size={22} {...iconStyle} />,
  },
  {
    segment: "hr/hr-recruitment",
    title: "HR-Recruitment",
    icon: <GiHumanPyramid size={22} {...iconStyle} />,
  },
  {
    segment: "hr/employees-payroll",
    title: "Payroll",
    icon: <GiTakeMyMoney size={22} {...iconStyle} />,
  },
  {
    segment: "hr/hr-profile",
    title: "Profile",
    icon: <CgProfile size={22} {...iconStyle} />,
  },
  {
    segment: "hr/employees-todo",
    title: "ToDo",
    icon: <LuListTodo size={22} {...iconStyle} />,
  },
  // =====hDs=====
  {
    segment: "logout",
    title: "Logout",
    icon: <TfiLock size={22} {...iconStyle} />,
  },
];

function HumanResource(props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Create a router object for AppProvider that integrates with React Router
  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(path),
  };

  return (
    <AppProvider
      navigation={HumanResourceSidebar}
      branding={{
        logo: <img src={company_logo} alt="MUI logo" />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      session={user}
    >
      <DashboardLayout slots={{ sidebarFooter: () => null }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          {/* ========hDs====== */}
          <Route
            path="attendance-detail/:employeeCode"
            element={<AttendanceDetails />}
          />
          <Route path="employees-data" element={<Employees />} />
          <Route path="employees-payroll" element={<Payroll />} />
          <Route path="employees-todo" element={<ToDoForEmployee />} />
          <Route path="hr-profile" element={<Profile />}></Route>
          <Route path="holiday" element={<HolidayPage />}></Route>
          <Route path="announcements" element={<Announcements />}></Route>
          <Route path="report" element={<Report />}></Route>
          <Route path="hr-recruitment" element={<HRRecruitment />}></Route>
          <Route path="dealers-accounts" element={<DealersAccounts />}></Route>
          <Route path="vouchers" element={<Vouchers />}></Route>
          <Route path="timeline" element={<Timeline />}></Route>
          <Route path="beat-mapping" element={<BeatMapping />}></Route>
          <Route path="logout" element={<Logout />}></Route>
          {/* ========hDs====== */}

          {/* <Route path="/payroll" element={<Payroll />}></Route> */}
          {/* <Route path="/timeline" element={<Timeline />}></Route> */}
          {/* <Route path="/beat-mapping" element={<BeatMapping />}></Route> */}
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}

HumanResource.propTypes = {
  window: PropTypes.func,
};

export default HumanResource;
