import React, { useEffect, useState } from "react";
import {
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import axios from "axios";
import config from "../../../config";
import { orange } from "@mui/material/colors";
import HeaderActions from "../../../components/HeaderAction";

const backend_url = config.backend_url; // Get backend URL from config

const DealerHeader = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${backend_url}/fetch-dealer-credit-limit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, []);

  // Helper to format credit limit
  const formatCredit = (amount) =>
    amount?.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
      <Stack
        spacing={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          ml: "auto",
          textAlign: "right",
          minWidth: 220,
        }}
      >
        <Typography variant="h5" sx={{ color: orange[600], fontWeight: 600 }}>
          ₹ {formatCredit(user?.creditLimit) || "0"}
        </Typography>
        <Typography
          variant="div"
          color="textSecondary"
          sx={{ fontSize: "12px" }}
        >
          Available Credit Limit
        </Typography>
        <Typography variant="div">
          {user?.name || "Dealer"} {user?.code ? `| ${user.code}` : ""}
        </Typography>
      </Stack>
      <Divider 
    orientation="vertical" 
    flexItem 
    sx={{ 
      mx: 2,
      height: '40px',
      alignSelf: 'center',
      backgroundColor: (theme) => theme.palette.divider 
    }} 
  />
      <HeaderActions/>
    </Stack>
  );
};

export default DealerHeader;
