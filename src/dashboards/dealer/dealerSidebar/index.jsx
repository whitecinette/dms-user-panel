  import React from "react";
  import { RiDashboardLine } from "react-icons/ri";
  import { TbTargetArrow } from "react-icons/tb";
  import { CgProfile } from "react-icons/cg";
  import { TfiLock } from "react-icons/tfi";
  import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { Route, Routes } from "react-router-dom";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import PropTypes from "prop-types";
import company_logo from "../../../company-logo.png";
import { useAuth } from "../../../context/AuthContext";
import ProductList from "../../../components/dealer/products";
import OrderOfDealers from "../../../components/dealer/orders";
  const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

  const DealerSidebar = [
    { kind: "header", title: "Dealer Panel" },
    { segment: "dealer/dashboard/products", title: "Products", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    { segment: "dealer/dashboard/orders", title: "Order", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    { segment: "dealer/dashboard/sales-dashboard", title: "Sales Dashboard", icon: <RiDashboardLine size={22} {...iconStyle} /> },
    { segment: "dealer/dashboard/scheme-letters", title: "Scheme Letters", icon: <LiaFileInvoiceDollarSolid size={22} {...iconStyle}/> },
    { segment: "dealer/dashboard/targets", title: "Targets", icon: <TbTargetArrow size={22} {...iconStyle}/> },
    { segment: "dealer/dashboard/profile", title: "Profile", icon: <CgProfile size={22} {...iconStyle}/> },
    { segment: "logout", title: "Logout", icon: <TfiLock size={22} {...iconStyle}/> },
  ];

  function SidebarDealer(props) {
   const { user } = useAuth();
 
   return (
     <AppProvider
       navigation={DealerSidebar}
       branding={{
         logo: <img src={company_logo} alt="MUI logo" />,
         title: "",
         homeUrl: "/toolpad/core/introduction",
       }}
     >
       <DashboardLayout slots={{ sidebarFooter: () => null }}>
         <Routes>
           <Route path="products" element={<ProductList />} />
           <Route path="orders" element={<OrderOfDealers />} />
         </Routes>
       </DashboardLayout>
     </AppProvider>
   );
 }
 
 SidebarDealer.propTypes = {
   window: PropTypes.func,
 };
   export default SidebarDealer;
