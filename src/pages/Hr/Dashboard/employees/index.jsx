import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Search as SearchIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import "./style.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
const backend_url = config.backend_url;

function Employees() {
  const [employeesData, setEmployeesData] = useState([]);
  const [page, setPage] = useState(0); // 0-based for MUI TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [firm, setFirms] = useState([]);
  const [firmList, setFirmList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [tempFirms, setTempFirms] = useState([]);
  const anchorRef = React.useRef(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch all firms for filter
  useEffect(() => {
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
        setFirmList([]);
      }
    };
    getAllActorTypes();
  }, []);

  // Update fetchEmployees to use search and firms
  const fetchEmployees = async (page, limit) => {
    try {
      const response = await axios.get(`${backend_url}/get-emp-for-hr`, {
        params: {
          page: page + 1,
          limit,
          search: searchQuery,
          firm,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data && Array.isArray(response.data.data)) {
        setEmployeesData(response.data.data);
        setTotalRecords(response.data.totalRecords || 0);
      } else {
        setEmployeesData([]);
        setTotalRecords(0);
      }
    } catch (err) {
      setEmployeesData([]);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchEmployees(page, rowsPerPage);
  }, [page, rowsPerPage, searchQuery, firm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  // Firm dropdown handlers
  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
    setTempFirms([...firm]);
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
    setTempFirms(firm);
  };

  // Save handler for editing employee
  const handleSave = async (id) => {
    setSaving(true);
    try {
      await axios.put(`${backend_url}/edit-actorcode/${id}`, editValues, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setEditRowId(null);
      fetchEmployees(page, rowsPerPage); // Refresh data
    } catch (err) {
      // Optionally show an error message
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="employees-page">
      <div className="employees-container">
        <div className="header">
          <h2>Employee List</h2>
        </div>
        {/* Search and Firm Filter UI */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search Input */}
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
            sx={{ minWidth: 220, maxWidth: 350 }}
          />

          {/* Firm Filter */}
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ minWidth: 220, maxWidth: 300, position: "relative" }}>
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
                endIcon={dropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
              >
                {firm.length > 0 ? (
                  <span>
                    {firm.length} firm{firm.length > 1 ? "s" : ""} selected
                  </span>
                ) : (
                  <span>Select Firms</span>
                )}
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
        </Box>
        {/* Table and Pagination as before */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "calc(100vh - 300px)", // Adjust this value based on your needs
            overflow: "auto",
            "& .MuiTable-root": {
              minWidth: 650,
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Employee Name
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Employee Code
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Position</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Role</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Status</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeesData.length > 0 ? (
                employeesData.map((record) => (
                  <TableRow key={record._id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {editRowId === record._id ? (
                        <TextField
                          value={editValues.code}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              code: e.target.value,
                            })
                          }
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        record.code
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {editRowId === record._id ? (
                        <TextField
                          value={editValues.position}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              position: e.target.value,
                            })
                          }
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        record.position
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.role}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {editRowId === record._id ? (
                        <Select
                          value={editValues.status}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              status: e.target.value,
                            })
                          }
                          size="small"
                          sx={{ minWidth: 100 }}
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      ) : (
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                          variant="outlined"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                            fontSize: "0.95em",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {editRowId === record._id ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            sx={{ mr: 1 }}
                            disabled={saving}
                            onClick={() => handleSave(record._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={saving}
                            onClick={() => setEditRowId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setEditRowId(record._id);
                            setEditValues({
                              ...record,
                            });
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
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
      </div>
    </div>
  );
}

export default Employees;
