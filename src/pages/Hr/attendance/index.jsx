import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  Checkbox,
  ListItemText,
  ClickAwayListener,
  Popper,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import axios from "axios";
import config from "../../../config";

const backend_url = config.backend_url;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0); // Changed to 0-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [firms, setFirms] = useState([]);
  const [firmList, setFirmList] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0); // Added total records state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [tempFirms, setTempFirms] = useState([]);
  const anchorRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const getAllActorTypes = async () => {
    try {
      const res = await axios.get(
        `${backend_url}/actorTypesHierarchy/get-all-by-admin`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setFirmList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllActorTypes();
  }, []);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
    setTempFirms([...firms]);
  };

  const handleFirmSelect = (firm) => {
    const isSelected = tempFirms.includes(firm._id);
    if (isSelected) {
      setTempFirms(tempFirms.filter((id) => id !== firm._id));
    } else {
      setTempFirms([...tempFirms, firm._id]);
    }
  };

  const handleClearFirms = () => {
    setTempFirms([]);
  };

  const handleApplyFirms = () => {
    setFirms(tempFirms);
    setDropdownOpen(false);
  };

  const handleClickAway = () => {
    setDropdownOpen(false);
    setTempFirms(firms);
  };

  const getAttendanceCount = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/get-attendance-by-date/${selectedDate}`,
        {
          params: {
            firms,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAttendanceCount(response.data.attendanceCount);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  //get attendance
  const getAttendance = async () => {
    try {
      const res = await axios.get(
        `${backend_url}/get-latest-attendance-by-date`,
        {
          params: {
            date: selectedDate,
            page: page + 1, // Add 1 to convert to 1-based indexing for API
            limit: rowsPerPage,
            search: searchQuery,
            status: statusFilter,
            firms: firms,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAttendance(res.data.data);
      setTotalRecords(res.data.totalRecords || 0); // Set total records
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    getAttendanceCount();
    getAttendance();
  }, [selectedDate, page, rowsPerPage, searchQuery, statusFilter, firms]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setEditMode(false);
    setEditData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "success";
      case "absent":
        return "error";
      case "half day":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({
      status: selectedRecord.status,
      punchIn: selectedRecord.punchIn,
      punchOut: selectedRecord.punchOut,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${backend_url}/edit-attendance/${selectedRecord._id}`,
        editData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setEditMode(false);
      setEditData({});
      getAttendance();
      handleCloseDialog();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">
                {attendanceCount.halfDay +
                  attendanceCount.present +
                  attendanceCount.absent +
                  attendanceCount.leave +
                  attendanceCount.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Present
              </Typography>
              <Typography variant="h4">
                {attendanceCount.present + attendanceCount.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Leave
              </Typography>
              <Typography variant="h4">{attendanceCount.leave}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Half Day
              </Typography>
              <Typography variant="h4">{attendanceCount.halfDay}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Absent
              </Typography>
              <Typography variant="h4">{attendanceCount.absent}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="Select Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Half Day">Half-Day</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box>
                <Button
                  ref={anchorRef}
                  onClick={handleDropdownClick}
                  variant="outlined"
                  fullWidth
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    height: "56px",
                  }}
                >
                  {firms.length > 0 ? (
                    <span>
                      {firms.length} firm{firms.length > 1 ? "s" : ""} selected
                    </span>
                  ) : (
                    <span>Select Firms</span>
                  )}
                  {dropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Button>
                <Popper
                  open={dropdownOpen}
                  anchorEl={anchorRef.current}
                  placement="bottom-start"
                  transition
                  style={{ zIndex: 1300 }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper
                        sx={{
                          width: anchorRef.current?.clientWidth,
                          maxHeight: 400,
                          overflow: "hidden",
                          mt: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
                          <TextField
                            fullWidth
                            placeholder="Search firms..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                          {tempFirms.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Selected Firms
                              </Typography>
                              {firmList
                                .filter((firm) => tempFirms.includes(firm._id))
                                .map((firm) => (
                                  <Chip
                                    key={firm._id}
                                    label={firm.name}
                                    onDelete={() => handleFirmSelect(firm)}
                                    sx={{ m: 0.5 }}
                                  />
                                ))}
                            </Box>
                          )}
                          {firmList
                            .filter(
                              (firm) =>
                                !tempFirms.includes(firm._id) &&
                                firm.name
                                  .toLowerCase()
                                  .includes(dropdownSearch.toLowerCase())
                            )
                            .map((firm) => (
                              <Box
                                key={firm._id}
                                onClick={() => handleFirmSelect(firm)}
                                sx={{
                                  p: 1,
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "action.hover",
                                  },
                                }}
                              >
                                {firm.name}
                              </Box>
                            ))}
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            position: "sticky",
                            bottom: 0,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleClearFirms}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleApplyFirms}
                          >
                            Apply
                          </Button>
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </Box>
            </ClickAwayListener>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => {
                setSearchQuery("");
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setStatusFilter("");
                setFirms([]);
              }}
              sx={{ height: "56px" }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 450px)", // Adjust this value based on your needs
          overflow: "auto",
          "& .MuiTable-root": {
            minWidth: 650,
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Employee Name</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Employee Code</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                Employee Position
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Date</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Check In</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Check In Shop</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Check Out</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                Check Out Shop
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Total Hours</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
              <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                View Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.length > 0 ? (
              attendance.map((record) => (
                <TableRow key={record._id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.name}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.code}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.position}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(record.date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.punchIn
                      ? new Date(record.punchIn).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.punchInName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.punchOut
                      ? new Date(record.punchOut).toLocaleTimeString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.punchOutName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.hoursWorked || "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(record)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No recent activities
                </TableCell>
              </TableRow>
            )}
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
          labelDisplayedRows={({ from, to, count, page }) => {
            const totalPages = Math.ceil(count / rowsPerPage);
            return (
              <Typography component="span" variant="body2">
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Page {page + 1} of {totalPages}
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "none", md: "inline" }, ml: 1 }}
                >
                  ({from}-{to} of {count})
                </Box>
                <Box
                  component="span"
                  sx={{ display: { xs: "inline", sm: "none" } }}
                >
                  {page + 1}/{totalPages}
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

      {/* View Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attendance Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Employee Name:</strong> {selectedRecord.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedRecord.date).toISOString().split("T")[0]}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Check In:</strong>{" "}
                    {!editMode ? (
                      selectedRecord.punchIn ? (
                        new Date(selectedRecord.punchIn).toLocaleTimeString(
                          "en-IN",
                          { timeZone: "Asia/Kolkata" }
                        )
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <input
                        type="time"
                        value={
                          editData.punchIn
                            ? new Date(editData.punchIn).toLocaleTimeString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(
                            editData.punchIn || new Date()
                          );
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);
                          setEditData({
                            ...editData,
                            punchIn: newDate.toISOString(),
                          });
                        }}
                      />
                    )}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Check In Location:</strong>{" "}
                    {selectedRecord.punchInName || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Check Out:</strong>{" "}
                    {!editMode ? (
                      selectedRecord.punchOut ? (
                        new Date(selectedRecord.punchOut).toLocaleTimeString(
                          "en-IN",
                          { timeZone: "Asia/Kolkata" }
                        )
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <input
                        type="time"
                        value={
                          editData.punchOut
                            ? new Date(editData.punchOut).toLocaleTimeString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""
                        }
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(
                            editData.punchIn || new Date()
                          );
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);
                          setEditData({
                            ...editData,
                            punchIn: newDate.toISOString(),
                          });
                        }}
                      />
                    )}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Check Out Location:</strong>{" "}
                    {selectedRecord.punchOutName || "N/A"}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Total Hours:</strong>{" "}
                    {selectedRecord.hoursWorked || "N/A"}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong>{" "}
                    {!editMode ? (
                      <Chip
                        label={selectedRecord.status}
                        color={getStatusColor(selectedRecord.status)}
                        size="small"
                      />
                    ) : (
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={editData.status}
                          label="Status"
                          onChange={(e) =>
                            setEditData({ ...editData, status: e.target.value })
                          }
                        >
                          <MenuItem value="Present">Present</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Absent">Absent</MenuItem>
                          <MenuItem value="Half Day">Half Day</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Typography>
                </Grid>
                {selectedRecord.latitude && selectedRecord.longitude && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Location:</strong>
                    </Typography>
                    <iframe
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${selectedRecord.latitude},${selectedRecord.longitude}&z=16&output=embed`}
                      title="Google Map"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                    />
                  </Grid>
                )}
                {selectedRecord.punchInImage && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Check In Image:</strong>
                    </Typography>
                    <img
                      src={selectedRecord.punchInImage}
                      alt="Punch In"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Grid>
                )}
                {selectedRecord.punchOutImage && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Check Out Image:</strong>
                    </Typography>
                    <img
                      src={selectedRecord.punchOutImage}
                      alt="Punch Out"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!editMode ? (
            <>
              <Button onClick={handleEdit} color="primary">
                Edit
              </Button>
              <Button onClick={handleCloseDialog}>Close</Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} color="success" variant="contained">
                Save
              </Button>
              <Button onClick={() => setEditMode(false)} color="error">
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attendance;
