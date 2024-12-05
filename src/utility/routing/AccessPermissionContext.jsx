import React from "react";
import { Typography, Box } from "@mui/material";
// import AccessDenied from "../../assets/validations/403.png";

const AccessPermissionContext = ({ permission, children }) => {
  const storedData = JSON.parse(localStorage.getItem("user"));

  // Declare accessPermissions outside the block
  let accessPermissions = [];

  if (storedData.userType === "admin") {
    accessPermissions = ["admin", "user"]; // Array of permissions for admin
  } else {
    accessPermissions = ["user"]; // Array of permissions for user
  }

  if (!accessPermissions?.includes(permission)) {
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
        <h1>Access Denied</h1>
      </Box>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AccessPermissionContext;