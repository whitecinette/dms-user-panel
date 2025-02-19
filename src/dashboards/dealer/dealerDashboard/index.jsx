import * as React from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DelaerSidebar from "../dealerSidebar";
import { useAuth } from "../../../context/AuthContext";
import DemoPageContent from "../../../components/demoPageContent";
import { createTheme } from "@mui/material/styles";
import company_logo from "../../../company-logo.png";

const demoTheme = createTheme({
  palette: {
    mode: "light", // ✅ Force light mode
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
        md: 960, // Change md to a valid breakpoint
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "rgba(249, 64, 8, 0.62) !important", // ✅ Change hamburger color (orange)
          },
        },
      },
    },
  });

function DealerDashboard(props) {
  const { user } = useAuth();
  const { window } = props;
  const [pathname, setPathname] = React.useState("/dashboard");

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={DelaerSidebar}
      branding={{
        logo: <img src={company_logo} alt="MUI logo" />,
        title: '',
        homeUrl: '/toolpad/core/introduction',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      session={user}
    >
      <DashboardLayout slots={{ sidebarFooter: () => null }}>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DealerDashboard.propTypes = {
  window: PropTypes.func,
};

export default DealerDashboard;
