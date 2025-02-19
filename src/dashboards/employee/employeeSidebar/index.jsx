  import React from "react";
  import { BsGraphUpArrow } from "react-icons/bs";
  import { SlGraph } from "react-icons/sl";
  import { RiDashboardLine } from "react-icons/ri";
  import { TbMap2 } from "react-icons/tb";
  import { MdOutlineAccountBalanceWallet } from "react-icons/md";
  import { MdOutlineManageAccounts } from "react-icons/md";
  import { LuClipboardList } from "react-icons/lu";
  import { CiMoneyBill } from "react-icons/ci";
  import { HiOutlineSpeakerphone } from "react-icons/hi";
  import { TbTargetArrow } from "react-icons/tb";
  import { CiLock } from "react-icons/ci";
  import { CgProfile } from "react-icons/cg";
  import { TfiLock } from "react-icons/tfi";


  const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

  const EmployeeSidebar = [
    { kind: "header", title: "Employee Panel" },
    { segment: "sales-dashboard", title: "Sales Dashboard", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    { segment: "extraction", title: "Extraction", icon: <BsGraphUpArrow size={22} {...iconStyle}/> },
    { segment: "pulse", title: "Pulse", icon: <SlGraph size={22} {...iconStyle}/> },
    { segment: "beat-mapping", title: "Beat Mapping", icon: <TbMap2 size={22} {...iconStyle}/> },
    

    // HR Section with Dropdown
    {
      segment: "hr",
      title: "Human Resources",
      icon: <MdOutlineManageAccounts size={22} {...iconStyle}/>,  
      children: [
        {
          segment: "attendance",
          title: "Attendance",
          icon: <LuClipboardList size={22} {...iconStyle}/>,
        },
        {
          segment: "payslip",
          title: "Payslip",
          icon: <MdOutlineAccountBalanceWallet size={22} {...iconStyle}/>,
        },
        {
          segment: "vouchers",
          title: "Vouchers",
          icon: <CiMoneyBill size={22} {...iconStyle}/>,
        },
        {
          segment: "announcements",
          title: "Announcements",
          icon: <HiOutlineSpeakerphone size={22} {...iconStyle}/>,
        },
      ],
    },
    { segment: "targets", title: "Targets", icon: <TbTargetArrow size={22} {...iconStyle}/> },
    { segment: "profile", title: "Profile", icon: <CgProfile size={22} {...iconStyle}/> },
    { segment: "logout", title: "Logout", icon: <TfiLock size={22} {...iconStyle}/> },
  ];

  export default EmployeeSidebar;
