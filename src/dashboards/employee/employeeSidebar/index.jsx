import React, { useState, useEffect } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { SlGraph } from "react-icons/sl";
import { RiDashboardLine } from "react-icons/ri";
import PropTypes, { element } from "prop-types";
import { TbMap2 } from "react-icons/tb";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { CiMoneyBill } from "react-icons/ci";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { TbTargetArrow } from "react-icons/tb";
import { CiLock } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import company_logo from "../../../company-logo.png";
import { TfiLock } from "react-icons/tfi";
import { useAuth } from "../../../context/AuthContext";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { IoFingerPrintOutline, IoLocation } from "react-icons/io5";
import PunchInAndPunchOut from "../../../pages/Employee/PunchInAndPunchOut";
import Logout from "../../../components/logout";
import Attendance from "../../../pages/Employee/HumanResources/Attendance";
import Vouchers from "../../../pages/Employee/HumanResources/Vouchers";
import Announcements from "../../../pages/Employee/HumanResources/Announcements";
import PaySlipByEmployee from "../../../pages/Employee/HumanResources/Payslip";
import SalesDashboard from "../../../pages/Employee/SalesDashboard";
import Extraction from "../../../pages/Employee/Extraction";
import Pulse from "../../../pages/Employee/Pulse";
import BeatMapping from "../../../pages/Employee/BeatMapping";
import Targets from "../../../pages/Employee/Targets";
import Profile from "../../../pages/Employee/Profile";
import GeoTagging from "../../../pages/Employee/GeoTag";


const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

function SidebarEmployee(props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setEmployeeName(name || "");
  }, []);

  // Create a router object for AppProvider that integrates with React Router
  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(path),
  };

  const position = localStorage.getItem("position");
  let EmployeeSidebar = [];

  if (position === "asm") {
    EmployeeSidebar = [
      { kind: "header", title: `Employee Panel ` },
      {
        segment: "employee/dashboard",
        title: "Sales Dashboard",
        icon: <RiDashboardLine size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/extraction",
        title: "Extraction",
        icon: <BsGraphUpArrow size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/pulse",
        title: "Pulse",
        icon: <SlGraph size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/beat-mapping",
        title: "Beat Mapping",
        icon: <TbMap2 size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/geoTagging",
        title: "Geo Tagging",
        icon: <IoLocation size={22} {...iconStyle} />,
      },

      // HR Section with Dropdown
      {
        segment: "employee/dashboard/hr",
        title: "Human Resources",
        icon: <MdOutlineManageAccounts size={22} {...iconStyle} />,
        children: [
          {
            segment: "attendance",
            title: "Attendance",
            icon: <LuClipboardList size={22} {...iconStyle} />,
            link: "attendance", // ✅ Corrected link property
          },
          {
            segment: "payslip",
            title: "Payslip",
            icon: <MdOutlineAccountBalanceWallet size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/payslip",
          },
          {
            segment: "vouchers",
            title: "Vouchers",
            icon: <CiMoneyBill size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/vouchers",
          },
          {
            segment: "announcements",
            title: "Announcements",
            icon: <HiOutlineSpeakerphone size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/announcements",
          },
        ],
      },
      {
        segment: "employee/dashboard/targets",
        title: "Targets",
        icon: <TbTargetArrow size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/punchInAndOut",
        title: "Punch In/Out",
        icon: <IoFingerPrintOutline size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/profile",
        title: "Profile",
        icon: <CgProfile size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/logout",
        title: "Logout",
        icon: <TfiLock size={22} {...iconStyle} />,
      },
    ];
  }else{
    EmployeeSidebar = [
      { kind: "header", title: `Employee Panel ` },
      {
        segment: "employee/dashboard",
        title: "Sales Dashboard",
        icon: <RiDashboardLine size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/extraction",
        title: "Extraction",
        icon: <BsGraphUpArrow size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/pulse",
        title: "Pulse",
        icon: <SlGraph size={22} {...iconStyle} />,
      },
      // {
      //   segment: "employee/dashboard/beat-mapping",
      //   title: "Beat Mapping",
      //   icon: <TbMap2 size={22} {...iconStyle} />,
      // },
      {
        segment: "employee/dashboard/geoTagging",
        title: "Geo Tagging",
        icon: <IoLocation size={22} {...iconStyle} />,
      },

      // HR Section with Dropdown
      {
        segment: "employee/dashboard/hr",
        title: "Human Resources",
        icon: <MdOutlineManageAccounts size={22} {...iconStyle} />,
        children: [
          {
            segment: "attendance",
            title: "Attendance",
            icon: <LuClipboardList size={22} {...iconStyle} />,
            link: "attendance", // ✅ Corrected link property
          },
          {
            segment: "payslip",
            title: "Payslip",
            icon: <MdOutlineAccountBalanceWallet size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/payslip",
          },
          {
            segment: "vouchers",
            title: "Vouchers",
            icon: <CiMoneyBill size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/vouchers",
          },
          {
            segment: "announcements",
            title: "Announcements",
            icon: <HiOutlineSpeakerphone size={22} {...iconStyle} />,
            link: "/employee/dashboard/hr/announcements",
          },
        ],
      },
      {
        segment: "employee/dashboard/targets",
        title: "Targets",
        icon: <TbTargetArrow size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/punchInAndOut",
        title: "Punch In/Out",
        icon: <IoFingerPrintOutline size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/profile",
        title: "Profile",
        icon: <CgProfile size={22} {...iconStyle} />,
      },
      {
        segment: "employee/dashboard/logout",
        title: "Logout",
        icon: <TfiLock size={22} {...iconStyle} />,
      },
    ];
  }

  return (
    <AppProvider
      navigation={EmployeeSidebar}
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
          <Route path="/" element={<SalesDashboard />} />
          <Route path="/extraction" element={<Extraction />} />
          <Route path="/beat-mapping" element={<BeatMapping />} />
          <Route path="hr">
            <Route path="attendance" element={<Attendance />} />
            <Route path="payslip" element={<PaySlipByEmployee />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="announcements" element={<Announcements />} />
            {/* <Route path="vouchers" element={<PaySlipByEmployee />} />
            <Route path="announcements" element={<PaySlipByEmployee />} /> */}
          </Route>
          {/* <Route path="employee/dashboard/logout" element={<Logout />} /> */}
          <Route path="profile" element={<Profile />} />
          <Route path="targets" element={<Targets />} />
          <Route path="pulse" element={<Pulse />} />
          <Route path="punchInAndOut" element={<PunchInAndPunchOut />} />
          <Route path="geoTagging" element={<GeoTagging />} />
          <Route path="logout" element={<Logout />} />
          {/* <Route path="extraction" element={<Extraction />} /> */}
          {/* <Route path="payroll" element={<Payroll />}></Route> */}
          {/* <Route path="vouchers" element={<Vouchers />}></Route> */}
          {/* <Route path="timeline" element={<Timeline />}></Route> */}
          {/* <Route path="beat-mapping" element={<BeatMapping />}></Route> */}
          {/* <Route path="announcements" element={<Announcements />}></Route> */}
          {/* <Route path="/profile" element={<Profile />}></Route> */}
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}

SidebarEmployee.propTypes = {
  window: PropTypes.func,
};
export default SidebarEmployee;
