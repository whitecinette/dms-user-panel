import React from "react";
import { Stack, Typography } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { orange } from "@mui/material/colors";
import "./style.scss";

const CreditLimitSummary = ({ available, utilized, name, code }) => {
  const total = available + utilized;
  const percentage = total ? (utilized / total) * 100 : 0;

  const formatINR = (amount) =>
    amount?.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <Stack direction="row" alignItems="center" className="credit-limit-header">
        <div style={{ width: 48, height: 48 }}>
        <CircularProgressbar
            value={percentage}
            strokeWidth={10}
            styles={buildStyles({
            pathColor: "#FB8C00",       // Bright orange
            trailColor: "#E0E0E0",      // Lighter, visible gray
            textColor: "#212121",       // Black-ish
            pathTransitionDuration: 0.5,
            })}
        />
        </div>


        <Stack spacing={0} sx={{ ml: 1, textAlign: "right", minWidth: 200 }}>
        <Typography variant="h6" sx={{ color: "#FB8C00", fontWeight: 700, lineHeight: 1 }}>
            ₹ {formatINR(available)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "12px", color: "#666" }}>
            Available Credit Limit
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "12px", color: "#666" }}>
            Total Limit: ₹{formatINR(total)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "12px", color: "#555" }}>
            Utilized: ₹{formatINR(utilized)}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "11px", color: "#111", fontWeight: 500 }}>
            {name} | {code}
        </Typography>
        </Stack>

    </Stack>
  );
};

export default CreditLimitSummary;
