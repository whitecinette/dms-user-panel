import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Button,
  LinearProgress,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useNavigate } from "react-router-dom";

function formatGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatToday() {
  const now = new Date();
  return now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DashboardHome() {
  const navigate = useNavigate();

  // Replace these with real values from auth/user state
  const userName = "Jitendra";
  const userRole = "asm";
  const companyName = "SiddhaCorp.01";

  // Replace this with real attendance status from API
  const hasPunchedIn = true;

  // Replace this with real metric if you already have it
  const attendanceDaysPresent = 5;
  const attendanceDaysTotal = 5;
  const attendancePercent = 100;

  const greeting = formatGreeting();
  const today = formatToday();

  const handlePunchCardClick = () => {
    navigate("/employee/punch-in-out");
    // change this route as per your project
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        background:
          "linear-gradient(180deg, #F7F9FC 0%, #F3F6FB 100%)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack spacing={2.25}>
        {/* Top mobile-like header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <IconButton
              size="small"
              sx={{
                bgcolor: "white",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
              }}
            >
              <MenuRoundedIcon sx={{ color: "#2563EB" }} />
            </IconButton>

            <Stack spacing={0.2}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#94A3B8", fontWeight: 700, lineHeight: 1 }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#0F172A", fontWeight: 700, lineHeight: 1.1 }}
              >
                {today}
              </Typography>
            </Stack>
          </Stack>

          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 800,
              border: "1px solid #DBEAFE",
            }}
          >
            <PersonRoundedIcon fontSize="small" />
          </Avatar>
        </Stack>

        {/* Greeting hero card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #5B7CFA 0%, #6A7CF6 45%, #7C69F8 100%)",
            color: "white",
            position: "relative",
            boxShadow: "0 18px 40px rgba(91,124,250,0.28)",
          }}
        >
          <CardContent sx={{ p: 2.2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  size="small"
                  label={userRole}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.16)",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: 99,
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  size="small"
                  label={hasPunchedIn ? "Punched In" : "Not Punched In"}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.16)",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: 99,
                  }}
                />
                <Chip
                  size="small"
                  label={companyName}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.16)",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: 99,
                  }}
                />
              </Stack>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 26, sm: 30 },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 0.5,
                  }}
                >
                  {greeting}, {userName} 👋
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 500,
                  }}
                >
                  Track progress, close gaps, and stay smarter every day
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Attendance summary */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: "#F8FAFC",
            border: "1px solid #E5E7EB",
            boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#E8F7EE",
                  color: "#16A34A",
                  flexShrink: 0,
                }}
              >
                <CalendarMonthRoundedIcon />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{ fontSize: 15, fontWeight: 800, color: "#111827" }}
                >
                  Attendance
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#6B7280",
                    mb: 1,
                  }}
                >
                  {attendanceDaysPresent} / {attendanceDaysTotal} Days Present •{" "}
                  {attendancePercent.toFixed(1)}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={attendancePercent}
                  sx={{
                    height: 7,
                    borderRadius: 999,
                    bgcolor: "#E5E7EB",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg, #16A34A 0%, #22C55E 100%)",
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Quick action: only Punch In / Out for now */}
        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#111827",
              mb: 0.5,
            }}
          >
            Hi, {userName}
          </Typography>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "#6B7280",
              fontWeight: 500,
              mb: 1.5,
            }}
          >
            Fast access to your attendance action
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={handlePunchCardClick}
                elevation={0}
                sx={{
                  cursor: "pointer",
                  borderRadius: 4,
                  border: "1px solid #E5E7EB",
                  bgcolor: "white",
                  transition: "all 0.22s ease",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 16px 32px rgba(37,99,235,0.12)",
                    borderColor: "#BFDBFE",
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={1.6}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: hasPunchedIn ? "#FEF2F2" : "#ECFDF3",
                        color: hasPunchedIn ? "#DC2626" : "#16A34A",
                      }}
                    >
                      {hasPunchedIn ? (
                        <LogoutRoundedIcon />
                      ) : (
                        <FingerprintRoundedIcon />
                      )}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#111827",
                          mb: 0.5,
                        }}
                      >
                        Punch In / Out
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: "#6B7280",
                          fontWeight: 500,
                          lineHeight: 1.45,
                        }}
                      >
                        {hasPunchedIn
                          ? "You are punched in. Tap here to check out when your work is done."
                          : "Start your attendance flow with selfie and location verification."}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={
                        hasPunchedIn ? (
                          <LogoutRoundedIcon />
                        ) : (
                          <AccessTimeFilledRoundedIcon />
                        )
                      }
                      sx={{
                        mt: 0.5,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 800,
                        py: 1.2,
                        background: hasPunchedIn
                          ? "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)"
                          : "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
                        boxShadow: hasPunchedIn
                          ? "0 10px 20px rgba(220,38,38,0.20)"
                          : "0 10px 20px rgba(22,163,74,0.20)",
                        "&:hover": {
                          background: hasPunchedIn
                            ? "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)"
                            : "linear-gradient(135deg, #15803D 0%, #16A34A 100%)",
                        },
                      }}
                    >
                      {hasPunchedIn ? "Go to Punch Out" : "Go to Punch In"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Optional small info card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: "#EFF6FF",
            border: "1px solid #DBEAFE",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#DBEAFE",
                  color: "#2563EB",
                  flexShrink: 0,
                }}
              >
                <DashboardRoundedIcon fontSize="small" />
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: 14, fontWeight: 800, color: "#1E3A8A" }}
                >
                  Attendance tip
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    color: "#334155",
                    fontWeight: 500,
                    mt: 0.4,
                    lineHeight: 1.5,
                  }}
                >
                  Use punch in/out with proper selfie and active GPS for accurate attendance marking.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default DashboardHome;