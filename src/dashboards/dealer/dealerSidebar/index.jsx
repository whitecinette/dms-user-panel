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
  import { CgProfile } from "react-icons/cg";
  import { TfiLock } from "react-icons/tfi";
  import { LiaFileInvoiceDollarSolid } from "react-icons/lia";



  const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

  const DealerSidebar = [
    { kind: "header", title: "Dealer Panel" },
    { segment: "sales-dashboard", title: "Sales Dashboard", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    { segment: "scheme-letters", title: "Scheme Letters", icon: <LiaFileInvoiceDollarSolid size={22} {...iconStyle}/> },
    { segment: "targets", title: "Targets", icon: <TbTargetArrow size={22} {...iconStyle}/> },
    { segment: "profile", title: "Profile", icon: <CgProfile size={22} {...iconStyle}/> },
    { segment: "logout", title: "Logout", icon: <TfiLock size={22} {...iconStyle}/> },
  ];

  export default DealerSidebar;
