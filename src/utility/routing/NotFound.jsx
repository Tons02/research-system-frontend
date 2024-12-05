import { Box } from "@mui/material";
import React from "react";
import AccessDenied from "../../assets/img/validations/404.png";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        flex: 1,
      }}
    >
      <img src={AccessDenied} style={{ width: 500, height: "auto" }} />
    </Box>
  );
};

export default NotFound;