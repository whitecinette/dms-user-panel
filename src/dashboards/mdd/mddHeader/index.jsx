import React, { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";

const MddHeader = () => {
  const [name, setName] = useState("Distributor");
  const [code, setCode] = useState("Code")


  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedCode = localStorage.getItem("code");
    if (storedName) setName(storedName);
    if (storedCode) setCode(storedCode);
  }, []);

  const dummyCreditLimit = 55678776;

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
          ₹ {formatCredit(dummyCreditLimit)}
        </Typography>
        <Typography
          variant="div"
          color="textSecondary"
          sx={{ fontSize: "12px" }}
        >
          Available Credit Limit
        </Typography>
        <Typography variant="div">
          {name} | {code}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default MddHeader;
