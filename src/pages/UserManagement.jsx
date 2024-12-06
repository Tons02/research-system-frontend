import { Box, Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const UserManagement = () => {
  
  const storedData = JSON.parse(localStorage.getItem("user"));

  let accessPermissions = storedData?.role?.access_permission;

  return (
    <>
     <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" to="/">Home</Link>
        <Link color="inherit" to="/dashboard/user-management">User Management</Link>
      </Breadcrumbs>
      <Box
       sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2, // Optional: spacing between items
        justifyContent: "center", // Adjust alignment
      }}
      >
      {accessPermissions.includes("user-accounts:crud") && (
      <Card destination="user-accounts" icon={<GroupIcon />} title="Users" subtitle="Adding users based on the Sedar System and Ymir API."/>
      )}
      {accessPermissions.includes("masterlist:business-units:sync") && (
      <Card destination="role-management" icon={<ManageAccountsIcon />} title="Role Management" subtitle="Used for adding roles and permissions to users"/>
      )}
      </Box>
      </>
      
  )
}

export default UserManagement
