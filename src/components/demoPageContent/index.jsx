import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const DemoPageContent = ({ pathname }) => {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h5">Dashboard content for {pathname}</Typography>
    </Box>
  );
};

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default DemoPageContent;
