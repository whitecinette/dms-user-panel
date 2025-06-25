import * as React from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import company_logo from "../../../company-logo.png";
import { CgNotes } from "react-icons/cg";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { RiDashboardLine, RiTimeLine, RiCoupon3Line } from "react-icons/ri";
import { FaUserCheck, FaUsersLine } from "react-icons/fa6";
import { LiaRouteSolid } from "react-icons/lia";
import { GiTakeMyMoney } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { TfiLock, TfiAnnouncement } from "react-icons/tfi";
import { CiMapPin } from "react-icons/ci";
import { GiHumanPyramid } from "react-icons/gi";
import Attendance from "../../../pages/Hr/attendance";
import Payroll from "../../../pages/Hr/Payroll";
import { LuListTodo } from "react-icons/lu";
import { MdOutlineModeOfTravel } from "react-icons/md";
import ToDoForEmployee from "../../../pages/Hr/ToDo";
import Profile from "../../../pages/Hr/Profile";
import HolidayPage from "../../../pages/Hr/Dashboard/holidayPage";
import Report from "../../../pages/Hr/report";
import DealersAccounts from "../../../pages/Hr/accounts";
import HRRecruitment from "../../../pages/Hr/RecruitmentPage";
import Vouchers from "../../../pages/Hr/Vouchers";
import Logout from "../../../components/logout";
import Dashboard from "../../../pages/Hr/Dashboard";
import Announcements from "../../../pages/Hr/Announcements";
import Timeline from "../../../pages/Hr/Timeline";
import Employees from "../../../pages/Hr/Dashboard/employees";
import BeatMapping from "../../../pages/Hr/BeatMapping";
import LeaveApplication from "../../../pages/Hr/leaveApplication";
import TravelExpenses from "../../../pages/Hr/TravelExpenses";
import RoutesPlan from "../../../pages/Hr/RoutePlan";
import NotificationAlert from "../../../components/NotificationAlert"
import HeaderActions from "../../../components/HeaderAction";

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
  {
    segment: "hr/leaveApplication",
    title: "Leave Attendance",
    icon: <CgNotes size={22} {...iconStyle} />,
  },
  {
    segment: "hr/travelExpenses",
    title: "Travel Expenses",
    icon: <MdOutlineModeOfTravel size={22} {...iconStyle} />,
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
    segment: "hr/routePlan",
    title: "Route Plan",
    icon: <LiaRouteSolid size={22} {...iconStyle} />,
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
    segment: "hr/employees-todo",
    title: "ToDo",
    icon: <LuListTodo size={22} {...iconStyle} />,
  },
  // {
  //   segment: "hr/hr-profile",
  //   title: "Profile",
  //   icon: <CgProfile size={22} {...iconStyle} />,
  // },

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

       <DashboardLayout slots={{ sidebarFooter: () => null, toolbarActions: HeaderActions }}>
        <NotificationAlert/>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaveApplication" element={<LeaveApplication/>}/>
          <Route path="travelExpenses" element={<TravelExpenses/>}/>
          <Route path="routePlan" element={<RoutesPlan/>}/>
          {/* ========hDs====== */}
          {/* <Route
            path="attendance-detail/:employeeCode"
            element={<AttendanceDetails />}
          /> */}
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
