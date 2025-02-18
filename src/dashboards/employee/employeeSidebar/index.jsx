import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssessmentIcon from "@mui/icons-material/Assessment";

const EmployeeSidebar = [
  { kind: "header", title: "Employee Panel" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "performance", title: "Performance", icon: <AssessmentIcon /> },
  { segment: "profile", title: "Profile", icon: <AssignmentIndIcon /> },
];

export default EmployeeSidebar;
