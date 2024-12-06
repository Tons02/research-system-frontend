import { Box, Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BallotIcon from '@mui/icons-material/Ballot';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

const Masterlist = () => {
  
  const storedData = JSON.parse(localStorage.getItem("user"));

  let accessPermissions = storedData?.role?.access_permission;

  return (
    <>
     <Typography variant="h4" gutterBottom>
        Masterlist
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" to="/">Home</Link>
        <Link color="inherit" to="/dashboard/masterlist">Masterlist</Link>
      </Breadcrumbs>
      <Box
       sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2, // Optional: spacing between items
        justifyContent: "center", // Adjust alignment
      }}
      >
      {accessPermissions.includes("masterlist:companies:sync") && (
      <Card destination="company" icon={<ApartmentIcon />} title="Company" subtitle="Synching of Company Masterlist from Ymir to Lotus"/>
      )}
      {accessPermissions.includes("masterlist:business-units:sync") && (
      <Card destination="business_unit" icon={<BusinessCenterIcon />} title="Business Unit" subtitle="Synching of Business Unit Masterlist from Ymir to Lotus"/>
      )}
      {accessPermissions.includes("masterlist:departments:sync") && (
      <Card destination="department" icon={<AccountTreeIcon />} title="Departments" subtitle="Synching of Departments Masterlist from Ymir to Lotus"/>
      )}
      {accessPermissions.includes("masterlist:units:sync") && (
      <Card destination="unit" icon={<BallotIcon />} title="Units" subtitle="Synching of Units Masterlist from Ymir to Lotus"/>
      )}
      {accessPermissions.includes("masterlist:subunits:sync") && (
      <Card destination="subUnit" icon={<ViewHeadlineIcon/>} title="Sub Units" subtitle="Synching of Sub Units Masterlist from Ymir to Lotus"/>
      )}
      {accessPermissions.includes("masterlist:locations:sync") && (
      <Card destination="location" icon={<ShareLocationIcon/>} title="Locations" subtitle="Synching of Locations Masterlist from Ymir to Lotus"/>
      )}
      </Box>
      </>
      
  )
}

export default Masterlist
