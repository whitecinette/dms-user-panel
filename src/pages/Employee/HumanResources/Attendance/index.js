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
import "./style.scss";

const backendUrl = config.backend_url;

const Attendance = () => {
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {localStorage.getItem("name")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
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
              color="primary"
              onClick={handleReset}
              fullWidth
              sx={{ height: "56px" }}
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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch IN Image</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch In</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch Out</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Punch Out Image</TableCell>
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
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.punchIn ? new Date(record.punchIn).toLocaleTimeString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    }) : "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchOut ? new Date(record.punchOut).toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      }) : "-"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.punchOutImage ? (
                        <img
                          src={record.punchOutImage}
                          alt="Punch Out"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: getStatusColor(record.status),
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {record.status || "Pending"}
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

export default Attendance;
