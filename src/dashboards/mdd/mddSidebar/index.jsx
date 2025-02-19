  import React from "react";
  import { RiDashboardLine } from "react-icons/ri";
  import { TbTargetArrow } from "react-icons/tb";
  import { CgProfile } from "react-icons/cg";
  import { TfiLock } from "react-icons/tfi";
  import { FaBoxesPacking } from "react-icons/fa6";
  import { AiOutlineShop } from "react-icons/ai";
  import { RiOrganizationChart } from "react-icons/ri";
  import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
  import { PiInvoiceBold } from "react-icons/pi";
  import { FaRupeeSign } from "react-icons/fa";

  const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

  const MddSidebar = [
    { kind: "header", title: "MDD Panel" },
    { segment: "sales-dashboard", title: "Sales Dashboard", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    {segment: "orders", title: "Orders", icon: <FaBoxesPacking size={22} {...iconStyle}/>},
    {segment: "products", title: "Products", icon: <AiOutlineShop size={22} {...iconStyle}/>},
    
    {
      segment: "finance",
      title: "Finance Dashboard",
      icon: <FaRupeeSign size={22} {...iconStyle}/>,  
      children: [
        {segment: "payment-calculator", title: "Payment Calculator", icon: <PiInvoiceBold size={22} {...iconStyle}/>},
      ],
    },
    { segment: "obm", title: "OBM", icon: <RiOrganizationChart size={22} {...iconStyle}/> },
    { segment: "scheme-letters", title: "Scheme Letters", icon: <LiaFileInvoiceDollarSolid size={22} {...iconStyle}/> },
    { segment: "targets", title: "Targets", icon: <TbTargetArrow size={22} {...iconStyle}/> },
    { segment: "profile", title: "Profile", icon: <CgProfile size={22} {...iconStyle}/> },
    { segment: "logout", title: "Logout", icon: <TfiLock size={22} {...iconStyle}/> },
  ];

  export default MddSidebar;
