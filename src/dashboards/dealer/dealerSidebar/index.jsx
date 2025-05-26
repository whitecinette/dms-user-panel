import React from "react";
import { RiDashboardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { TfiLock } from "react-icons/tfi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
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
import { LuClipboardList } from "react-icons/lu";
import { MdOutlineShoppingBag } from "react-icons/md";
import DealerHeader from "../dealerHeader";
import { createTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { SlCalculator } from "react-icons/sl";
import Calculator from "../../../pages/Dealer/Calculator";

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

const DealerSidebar = [
  { kind: "header", title: "Dealer Panel" },
  {
    segment: "dealer/dashboard",
    title: "Dashboard",
    icon: <RiDashboardLine size={22} {...iconStyle} />,
  },
  // {
  //   segment: "dealer/products",
  //   title: "Products",
  //   icon: <MdOutlineShoppingBag size={22} {...iconStyle} />,
  // },
  // {
  //   segment: "dealer/orders",
  //   title: "Order",
  //   icon: <LuClipboardList size={22} {...iconStyle} />,
  // },
  {
    segment: "dealer/scheme-letters",
    title: "Scheme Letters",
    icon: <LiaFileInvoiceDollarSolid size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/targets",
    title: "Targets",
    icon: <TbTargetArrow size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/calculator",
    title: "Calculator",
    icon: <SlCalculator size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/profile",
    title: "Profile",
    icon: <CgProfile size={22} {...iconStyle} />,
  },
  {
    segment: "dealer/logout",
    title: "Logout",
    icon: <TfiLock size={22} {...iconStyle} />,
  },
];
// Toolbar Actions Component
function ToolbarActions() {
  return <DealerHeader />;
}

function SidebarDealer(props) {
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
      navigation={DealerSidebar}
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
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="scheme-letters" element={<SchemeLetters />} />
          <Route path="targets" element={<Targets />} />
          {/* <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} /> */}
          <Route path="calculator" element={<Calculator />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
}

SidebarDealer.propTypes = {
  window: PropTypes.func,
};
export default SidebarDealer;
