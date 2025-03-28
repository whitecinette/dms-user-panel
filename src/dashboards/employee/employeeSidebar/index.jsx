import React from "react";
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
import { Link, Route, Routes } from "react-router-dom";
import PaySlipByEmployee from "../../../components/employee/paySlip";
import Attendance from "../../../components/employee/attendance";
const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };
const EmployeeSidebar = [
  { kind: "header", title: "Employee Panel" },
  {
    segment: "employee/dashboard/sales-dashboard",
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
function SidebarEmployee(props) {
  const { user } = useAuth();
  return (
    <AppProvider
      navigation={EmployeeSidebar}
      branding={{
        logo: <img src={company_logo} alt="MUI logo" />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
    >
      <DashboardLayout slots={{ sidebarFooter: () => null }}>
        <Routes>
          
          <Route path="employee/dashboard/sales-dashboard" />
          <Route path="hr">
            <Route path="attendance" element={<Attendance />} />
            <Route path="payslip" element={<PaySlipByEmployee />} />
            {/* <Route path="vouchers" element={<PaySlipByEmployee />} />
            <Route path="announcements" element={<PaySlipByEmployee />} /> */}
          </Route>
          {/* <Route path="employee/dashboard/logout" element={<Logout />} /> */}
          <Route path="pulse" element={<Attendance />} />
          
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
