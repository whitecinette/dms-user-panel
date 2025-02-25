import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config";
import Table from "../../table";

const backend_url = config.backend_url;

const Payroll = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${backend_url}/salary-details`);
      console.log("Fetched data:", response.data.data); 
      setSalaries(response.data.data || []); 
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch salaries");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Table data={salaries} />
      )}
    </div>
  );
};

export default Payroll;
