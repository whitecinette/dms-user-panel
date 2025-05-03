import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import "./style.scss";
import config from "../../../config";

const backend_url = config.backend_url;

const BeatMapping = () => {
  const [beatMappings, setBeatMappings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, done: 0, pending: 0 });

  useEffect(() => {
    setToDate(new Date().toISOString().split("T")[0]);
    setFromDate(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUserName(name);
    }
    if(fromDate && toDate){
      fetchBeatMappings();
    }
  }, [fromDate, toDate, status, searchTerm]);

  

  const fetchBeatMappings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backend_url}/get-weekly-beat-mapping-schedule-for-admin-by-code`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate: fromDate,
            endDate: toDate,
            status,
            search: searchTerm,
          },
        }
      );
      setBeatMappings(response.data.dealers);
      if (response.data.totalCounts && response.data.totalCounts.length > 0) {
        setCounts(response.data.totalCounts[0]);
      }
    } catch (error) {
      setBeatMappings([]);
      setCounts({ total: 0, done: 0, pending: 0 });
      console.error("Error fetching beat mappings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(beatMappings);
  }, [beatMappings]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "done":
        return "success";
      default:
        return "default";
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setToDate(new Date().toISOString().split("T")[0]);
    setFromDate(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0]);
    setStatus("");
  };

  if (loading) {
    return (
      <div className="beat-mapping-container">
        <div className="content-wrapper">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="beat-mapping-container">
      <div className="content-wrapper">

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#f5f5f5" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Beat Mappings
                </Typography>
                <Typography variant="h4">{counts.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#fff3e0" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4">{counts.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#e8f5e9" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Done
                </Typography>
                <Typography variant="h4">{counts.done}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className="filters-container">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetFilters}
                sx={{ height: "56px" }}
                fullWidth
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </div>

        {beatMappings.length === 0 ? (
          <Typography variant="h5" className="welcome-text">
            No beat mappings found
          </Typography>
        ) : (
          <div className="table-container">
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "calc(100vh - 400px)",
                overflow: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Dealer Code</TableCell>
                    <TableCell>Dealer Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Distance</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Taluka</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {beatMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>{mapping.code}</TableCell>
                      <TableCell>{mapping.name}</TableCell>
                      <TableCell>{mapping.position}</TableCell>
                      <TableCell>
                        {new Date(mapping.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(mapping.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{mapping.distance || "N/A"}</TableCell>
                      <TableCell>{mapping.district || "N/A"}</TableCell>
                      <TableCell>{mapping.taluka || "N/A"}</TableCell>
                      <TableCell>{mapping.zone || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={mapping.status}
                          color={getStatusColor(mapping.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatMapping;
