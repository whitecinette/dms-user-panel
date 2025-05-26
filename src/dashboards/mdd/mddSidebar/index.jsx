import React from "react";
import { TfiLock } from "react-icons/tfi";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import PropTypes from "prop-types";
import company_logo from "../../../company-logo.png";
import { useAuth } from "../../../context/AuthContext";
import Products from "../../../pages/Dealer/Products";
import Orders from "../../../pages/Dealer/Orders";
import Logout from "../../../components/logout";
import SalesDashboard from "../../../pages/Dealer/SalesDashboard";
import Profile from "../../../pages/Dealer/Profile";
import SchemeLetters from "../../../pages/Dealer/SchemeLetters";
import Targets from "../../../pages/Dealer/Targets";
import MddHeader from "../mddHeader";
import { createTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import Calculator from "../../../pages/Dealer/Calculator";
import FinanceDashboard from "../../../pages/Mdd/financeDashboard";

import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineShoppingBag, MdOutlinePayments } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbTargetArrow } from "react-icons/tb";
import { SlCalculator } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { BsFileEarmarkArrowDown, BsFileEarmarkArrowUp } from "react-icons/bs";
import { PiSirenLight } from "react-icons/pi";
import { GiReceiveMoney } from "react-icons/gi";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import CreditNotes from "../../../pages/Mdd/creditNotes";

const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

const demoTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "rgba(249, 64, 8, 0.62) !important",
        },
      },
    },
  },
});

const MddSidebar = [
  { kind: "header", title: "Distributor Panel" },
 {
    segment: "dealer/dashboard",
    title: "Dashboard",
    icon: <RiDashboardLine size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/products",
    title: "Products",
    icon: <MdOutlineShoppingBag size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/orders",
    title: "Order",
    icon: <LuClipboardList size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/credit-notes",
    title: "Credit Notes",
    icon: <BsFileEarmarkArrowDown size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/purchase-history",
    title: "Purchase History",
    icon: <TbTargetArrow size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/pending-payments",
    title: "Pending Payments",
    icon: <MdOutlinePayments size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/debit-notes",
    title: "Debit Notes",
    icon: <BsFileEarmarkArrowUp size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/doa-claims",
    title: "DOA Claims",
    icon: <PiSirenLight size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/cn-working",
    title: "CN Working",
    icon: <GiReceiveMoney size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/marketing-invoices",
    title: "Marketing Invoices",
    icon: <HiOutlineSpeakerphone size={22} {...iconStyle} />,
  },
  {
    segment: "mdd/logout",
    title: "Logout",
    icon: <TfiLock size={22} {...iconStyle} />,
  },
];
// Toolbar Actions Component
function ToolbarActions() {
  return <MddHeader />;
}

function SidebarMdd(props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { window } = props;

  // Create a router object for AppProvider that integrates with React Router
  const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(path),
  };

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={MddSidebar}
      branding={{
        logo: <img src={company_logo} alt="MUI logo" />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={user}
    >
      <DashboardLayout
        slots={{
          toolbarActions: ToolbarActions,
          sidebarFooter: () => null,
        }}
      >
        <Routes>
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="credit-notes" element={<CreditNotes /> } />
          <Route path="purchase-history" element={<CreditNotes /> } />
          <Route path="pending-payments" element={<CreditNotes /> } />
          <Route path="debit-notes" element={<CreditNotes /> } />
          <Route path="doa-claims" element={<CreditNotes /> } />
          <Route path="cn-working" element={<CreditNotes /> } />
          <Route path="marketing-invoices" element={<CreditNotes /> } />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}

SidebarMdd.propTypes = {
  window: PropTypes.func,
};
export default SidebarMdd;
