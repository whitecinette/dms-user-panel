import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from "@mui/material";

const backendUrl = config.backend_url;

const HRAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);

  const statusOptions = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
    { value: "Pending", label: "Pending" },
    { value: "Half Day", label: "Half Day" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "#28a745";
      case "absent":
        return "#dc3545";
      case "pending":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/get-attandance`, {
        params: {
          status: statusFilter,
          startDate: startDate,
          endDate: endDate,
          page: page + 1,
          limit: rowsPerPage,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(response);
      setAttendanceData(response.data.data);
      if (response.data.pagination) {
        setTotalRecords(response.data.pagination.totalRecords || 0);
        setPage((response.data.pagination.currentPage || 1) - 1);
        setRowsPerPage(response.data.pagination.pageSize || 5);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch attendance data. Please try again later.");
      setAttendanceData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setPage(0);
  };

  const getTotalPages = (total, rowsPerPage) => {
    return rowsPerPage > 0 ? Math.max(1, Math.ceil(total / rowsPerPage)) : 1;
  };

  const getDisplayedRows = (page, rowsPerPage, total) => {
    if (total === 0) return { from: 0, to: 0 };
    const from = page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, total);
    return { from, to };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate, statusFilter, page, rowsPerPage]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: "linear-gradient(145deg, #f6f8fa 0%, #ffffff 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              size="small"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              onClick={handleReset}
              fullWidth
              size="small"
              sx={{
                height: "40px",
                mt: 0.5,
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                color: "#4a5568",
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background:
                    "linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)",
                  borderColor: "#cbd5e0",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : attendanceData.length === 0 ? (
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>No attendance records found</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
            <Table
              stickyHeader
              sx={{
                "& .MuiTableHead-root": {
                  "& .MuiTableCell-root": {
                    background:
                       "#f1f3f5",
                    color: "#2c3e50",
                    fontWeight: 600,
                    borderBottom: "2px solid #dee2e6",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                    "&:first-of-type": {
                      borderTopLeftRadius: "8px",
                    },
                    "&:last-child": {
                      borderTopRightRadius: "8px",
                    },
                  },
                },
                "& .MuiTableBody-root": {
                  "& .MuiTableRow-root": {
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                    "& .MuiTableCell-root": {
                      padding: "8px 16px",
                      borderBottom: "1px solid #edf2f7",
                    },
                  },
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Punch In Image
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch In</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch Out</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Punch Out Image
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(record.date).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchInImage ? (
                        <img
                          src={record.punchInImage}
                          alt="Punch In"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "scale(1.1)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() =>
                            window.open(record.punchInImage, "_blank")
                          }
                        />
                      ) : (
                        <span style={{ color: "#a0aec0", fontStyle: "italic" }}>
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchIn
                        ? new Date(record.punchIn).toLocaleTimeString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchOut
                        ? new Date(record.punchOut).toLocaleTimeString(
                            "en-IN",
                            {
                              timeZone: "Asia/Kolkata",
                            }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchOutImage ? (
                        <img
                          src={record.punchOutImage}
                          alt="Punch In"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                              transform: "scale(1.1)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() =>
                            window.open(record.punchInImage, "_blank")
                          }
                        />
                      ) : (
                        <span style={{ color: "#a0aec0", fontStyle: "italic" }}>
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        "& .status-badge": {
                          padding: "6px 12px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          transition: "all 0.2s ease",
                          display: "inline-block",
                          "&.present": {
                            background: "#e3fcef",
                            color: "#0a6634",
                            "&:hover": { background: "#d1f7e4" },
                          },
                          "&.absent": {
                            background: "#ffe9e9",
                            color: "#cc1818",
                            "&:hover": { background: "#ffd7d7" },
                          },
                          "&.pending": {
                            background: "#fff4e5",
                            color: "#b76e00",
                            "&:hover": { background: "#ffe8cc" },
                          },
                        },
                      }}
                    >
                      <span
                        className={`status-badge ${record.status?.toLowerCase()}`}
                      >
                        {record.status || "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={() => {
                const totalPages = getTotalPages(totalRecords, rowsPerPage);
                const { from, to } = getDisplayedRows(
                  page,
                  rowsPerPage,
                  totalRecords
                );
                return (
                  <Typography component="span" variant="body2">
                    <Box
                      component="span"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      Page {totalRecords === 0 ? 0 : page + 1} of {totalPages}
                    </Box>
                    <Box
                      component="span"
                      sx={{ display: { xs: "none", md: "inline" }, ml: 1 }}
                    >
                      ({from}-{to} of {totalRecords})
                    </Box>
                    <Box
                      component="span"
                      sx={{ display: { xs: "inline", sm: "none" } }}
                    >
                      {totalRecords === 0 ? 0 : page + 1}/{totalPages}
                    </Box>
                  </Typography>
                );
              }}
              labelRowsPerPage={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Rows per page:
                </Typography>
              }
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "white",
                zIndex: 2,
                "& .MuiTablePagination-selectLabel": {
                  display: { xs: "none", sm: "block" },
                },
                "& .MuiTablePagination-displayedRows": {
                  margin: { xs: 0, sm: "auto" },
                },
                "& .MuiTablePagination-actions": {
                  marginLeft: { xs: 0, sm: "auto" },
                },
              }}
            />
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default HRAttendance;
