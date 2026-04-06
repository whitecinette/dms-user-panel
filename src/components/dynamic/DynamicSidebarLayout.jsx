import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import { useAuth } from "../../context/AuthContext";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import "./dynamicSidebar.scss";
import { clearAuthStorage } from "../../utils/authStorage";

import { RiDashboardLine } from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { SlGraph } from "react-icons/sl";
import { TbMap2, TbTargetArrow } from "react-icons/tb";
import { MdOutlineAccountBalanceWallet, MdOutlineManageAccounts } from "react-icons/md";
import { LuClipboardList, LuChartBar, LuFileText, LuFileUp } from "react-icons/lu";
import { CiMoneyBill } from "react-icons/ci";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoFingerPrintOutline, IoLocation } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TfiLock } from "react-icons/tfi";

import company_logo from "../../company-logo.png";
import HeaderActions from "../../components/HeaderAction";
import SalesDashboard from "../../pages/Employee/SalesDashboard";
import Extraction from "../../pages/Employee/Extraction";
import Pulse from "../../pages/Employee/Pulse";
import BeatMapping from "../../pages/Employee/BeatMapping";
import Targets from "../../pages/Employee/Targets";
import Profile from "../../pages/Employee/Profile";
import GeoTagging from "../../pages/Employee/GeoTag";
import PunchInAndPunchOut from "../../pages/Employee/PunchInAndPunchOut";
import Attendance from "../../pages/Employee/HumanResources/Attendance";
import Vouchers from "../../pages/Employee/HumanResources/Vouchers";
import Announcements from "../../pages/Employee/HumanResources/Announcements";
import PaySlipByEmployee from "../../pages/Employee/HumanResources/Payslip";

const backend_url = config.backend_url;
const iconStyle = { color: "rgba(249, 64, 8, 0.62)" };

function DynamicSidebarLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navigation, setNavigation] = useState([]);

  const position = (localStorage.getItem("position") || "").toLowerCase();

  const router = {
    pathname: location.pathname.replace(/^\/app\/?/, ""),
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      const rawPath = String(path || "").trim();

      let normalizedPath = rawPath;

      // already correct
      if (rawPath.startsWith("/app/")) {
        normalizedPath = rawPath;
      }
      // login/logout or other top-level paths you want untouched
      else if (rawPath === "/login" || rawPath === "/logout" || rawPath === "/") {
        normalizedPath = rawPath;
      }
      // old-style absolute paths coming from Toolpad/sidebar
      else if (rawPath.startsWith("/")) {
        normalizedPath = `/app${rawPath}`;
      }
      // relative Toolpad segments
      else {
        normalizedPath = `/app/${rawPath.replace(/^\/+/, "")}`;
      }

      if (normalizedPath.includes("/logout")) {
        clearAuthStorage();
        window.location.replace("/login");
        return;
      }

      navigate(normalizedPath);
    },
  };

  const webRouteMap = useMemo(() => {
    const isAsmLike = ["asm", "tse", "so"].includes(position);

    return {
      dashboard: "/app/employee/dashboard",
      sales_dashboard: "/app/employee/dashboard",
      sales_dashboard_new: "/app/employee/dashboard",

      extraction_add: "/app/employee/dashboard/extraction",
      extraction_report: "/app/employee/dashboard/extraction",
      extraction_status: "/app/employee/dashboard/extraction",
      extraction_status_new: "/app/employee/dashboard/extraction",

      route_plan: "/app/employee/dashboard/beat-mapping",
      market_overview: "/app/employee/dashboard/beat-mapping",
      market_beats: "/app/employee/dashboard/beat-mapping",
      market_coverage_mark: isAsmLike
        ? "/app/employee/dashboard/beat-mapping"
        : "/app/employee/dashboard/beat-mapping",

      attendance: "/app/employee/dashboard/hr/attendance",
      bill_upload: "/app/employee/dashboard/hr/vouchers",
      vouchers: "/app/employee/dashboard/hr/vouchers",
      payslip: "/app/employee/dashboard/hr/payslip",
      announcements: "/app/employee/dashboard/hr/announcements",

      geo_tagging: "/app/employee/dashboard/geoTagging",
      geotagging: "/app/employee/dashboard/geoTagging",
      punch_in_out: "/app/employee/dashboard/punchInAndOut",
      pulse: "/app/employee/dashboard/pulse",
      targets: "/app/employee/dashboard/targets",
      profile: "/app/employee/dashboard/profile",
      logout: "/app/employee/dashboard/logout",
    };
  }, [position]);

  const mapBackendIconToWebIcon = (iconName) => {
    switch (iconName) {
      case "layoutDashboard":
        return <RiDashboardLine size={22} {...iconStyle} />;
      case "barChart2":
        return <LuChartBar size={22} {...iconStyle} />;
      case "database":
        return <BsGraphUpArrow size={22} {...iconStyle} />;
      case "map":
      case "route":
      case "briefcase":
        return <TbMap2 size={22} {...iconStyle} />;
      case "users":
        return <MdOutlineManageAccounts size={22} {...iconStyle} />;
      case "calendarCheck2":
      case "clipboardList":
        return <LuClipboardList size={22} {...iconStyle} />;
      case "fileText":
        return <LuFileText size={22} {...iconStyle} />;
      case "fileUp":
        return <LuFileUp size={22} {...iconStyle} />;
      case "mapPin":
        return <IoLocation size={22} {...iconStyle} />;
      case "fingerprint":
        return <IoFingerPrintOutline size={22} {...iconStyle} />;
      case "user":
        return <CgProfile size={22} {...iconStyle} />;
      case "target":
        return <TbTargetArrow size={22} {...iconStyle} />;
      case "megaphone":
        return <HiOutlineSpeakerphone size={22} {...iconStyle} />;
      case "receipt":
      case "ticket":
        return <CiMoneyBill size={22} {...iconStyle} />;
      case "logOut":
        return <TfiLock size={22} {...iconStyle} />;
      default:
        return <RiDashboardLine size={22} {...iconStyle} />;
    }
  };

  const transformSidebar = (items = []) => {
    return items
      .map((item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        if (hasChildren) {
          const transformedChildren = item.children
            .map((child) => {
              const mappedPath = webRouteMap[child.route];
              if (!mappedPath) return null;

              return {
                segment: mappedPath.replace("/app/", ""),
                title: child.name,
                icon: mapBackendIconToWebIcon(child.icon),
              };
            })
            .filter(Boolean);

          if (!transformedChildren.length) return null;

          return {
            segment: `group-${(item.name || "menu").toLowerCase().replace(/\s+/g, "-")}`,
            title: item.name,
            icon: mapBackendIconToWebIcon(item.icon),
            children: transformedChildren,
          };
        }

        const mappedPath = webRouteMap[item.route];
        if (!mappedPath) return null;

        return {
          segment: mappedPath.replace("/app/", ""),
          title: item.name,
          icon: mapBackendIconToWebIcon(item.icon),
        };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${backend_url}/app/sidebar`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const backendSidebar = response?.data?.sidebar || [];
        const transformed = transformSidebar(backendSidebar);

        transformed.unshift({
          kind: "header",
          title: "User Panel",
        });

        transformed.push({
          segment: "employee/dashboard/logout",
          title: "Logout",
          icon: <TfiLock size={22} {...iconStyle} />,
        });

        setNavigation(transformed);
      } catch (err) {
        const status = err?.response?.status;
        const code = err?.response?.data?.error;

        if (status === 401 || status === 403 || code === "SESSION_INVALID") {
          clearAuthStorage();
          window.location.replace("/login");
          return;
        }

        console.error("Dynamic sidebar fetch failed:", err);
      }
    };

    fetchSidebar();
  }, [position]);

  return (
    <AppProvider
      navigation={navigation}
      branding={{
        logo: <img src={company_logo} alt="Company logo" />,
        title: "",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      session={user}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => null,
          toolbarActions: HeaderActions,
        }}
      >
        <RoutesRenderer />
      </DashboardLayout>
    </AppProvider>
  );
}

function RoutesRenderer() {
  const location = useLocation();

if (
  location.pathname === "/app/employee/dashboard" ||
  location.pathname === "/app/employee/dashboard/"
) {
  return <PunchInAndPunchOut />;
}

  if (location.pathname === "/app/employee/dashboard/extraction") {
    return <Extraction />;
  }

  if (location.pathname === "/app/employee/dashboard/beat-mapping") {
    return <BeatMapping />;
  }

  if (location.pathname === "/app/employee/dashboard/hr/attendance") {
    return <Attendance />;
  }

  if (location.pathname === "/app/employee/dashboard/hr/payslip") {
    return <PaySlipByEmployee />;
  }

  if (location.pathname === "/app/employee/dashboard/hr/vouchers") {
    return <Vouchers />;
  }

  if (location.pathname === "/app/employee/dashboard/hr/announcements") {
    return <Announcements />;
  }

  if (location.pathname === "/app/employee/dashboard/profile") {
    return <Profile />;
  }

  if (location.pathname === "/app/employee/dashboard/targets") {
    return <Targets />;
  }

  if (location.pathname === "/app/employee/dashboard/pulse") {
    return <Pulse />;
  }

  if (location.pathname === "/app/employee/dashboard/punchInAndOut") {
    return <PunchInAndPunchOut />;
  }

  if (location.pathname === "/app/employee/dashboard/geoTagging") {
    return <GeoTagging />;
  }

  if (location.pathname === "/app/employee/dashboard/logout") {
    clearAuthStorage();
    window.location.replace("/login");
    return null;
  }

  return <SalesDashboard />;
}

export default DynamicSidebarLayout;