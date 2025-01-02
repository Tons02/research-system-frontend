import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useGetLocationsQuery, useSyncLocationsMutation } from '../redux/slices/apiSlice';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import {  useLazyGetYmirLocationsQuery } from '../redux/slices/apiYmir';
import Link from '@mui/material/Link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Dashboard } from '@mui/icons-material';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';

const Location = () => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); 
  const [isViewMode, setIsViewMode] = useState(false);
  const [localSearch, setLocalSearch] = useState("");


  // Fetch Locations with RTK Query hook
  const { data: locations, isLoading: isLocationsLoading, isError: isLocationsError, refetch: locationsRefetch } = useGetLocationsQuery({ search, page: page + 1, per_page: rowsPerPage, status  });

  // The trigger function for lazy query and response state
  const [trigger, { data: ymirLocations, isLoading: isYmirLoading, isError: isYmirError, }] = useLazyGetYmirLocationsQuery();
  const [syncLocations] = useSyncLocationsMutation();

  const handleSyncLocations = () => {
    trigger()
      .unwrap() // Ensure to extract the response
      .then(response => {
        const ymirLocations = response?.result;
  
        if (!ymirLocations || ymirLocations.length === 0) {
          throw new Error("No locations data found to sync.");
        }
  
        const payload = {
          locations: ymirLocations.map(location => ({
            sync_id: location.id,
            location_code: location.code,
            location_name: location.name,
            sub_units: location.sub_units.map(sub_unit => sub_unit.id),
            updated_at: dayjs(location.updated_at).format('YYYY-MM-DD HH:mm:ss'),
            deleted_at: location.deleted_at ? dayjs(location.deleted_at).format('YYYY-MM-DD HH:mm:ss') : null
          }))
        };
  
        // Return the syncLocations call to maintain promise chaining
        return syncLocations(payload).unwrap();
      })
      .then(syncResponse => {
        // Trigger refetch and show success notification
        locationsRefetch();
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: syncResponse?.message,
          severity: "success",
        });
      })
      .catch(error => {
        // Handle errors from either trigger or syncLocations
        console.error('Error syncing Locations:', error?.message);
        setSnackbar({
          open: true,
          message: error?.data?.errors?.[0]?.detail || error.message || 'An unexpected error occurred',
          severity: "error",
        });
      })
  };
  

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "info",
});

const handleSearchChange = (event) => {
  setSearch(event.target.value);  // Update the search state when typing
};

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Reset to first page when changing rows per page
};

const handleChangeStatus = (event) => {
  // Update status based on checkbox state
  if (event.target.checked) {
    setStatus("inactive");
    locationsRefetch()
  } else {
    setStatus("active");
    locationsRefetch()
  }
};
  return (
    <>
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom:1 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <Dashboard sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          color="inherit"
          href="/dashboard/masterlist"
        >
        <ListAltIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Masterlist
        </Link>
        <Typography
          sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
        >
          <ShareLocationIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Locations
        </Typography>
      </Breadcrumbs>
       <Typography variant="h4">
       Locations
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() =>  {
            setOpenDialog(true) 
            setIsViewMode(false)
        }
    }
          sx={{ marginLeft: 'auto' }}
        >
          Sync
        </Button>
      </Box>

    <TableContainer component={Paper}  sx={{ 
      borderTop: '1px solid #ccc',
      maxHeight: 650,
    minHeight: 450,
    display: 'flex',
    flexDirection: 'column' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 1.5}} // Adding padding here
      >
        <FormControlLabel
          control={<Checkbox color="success" onChange={handleChangeStatus} />}
          label="Archived" />
        <TextField
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SearchIcon sx={{ fontSize: 18 }} />
              Search
            </Box>
          }
          variant="outlined"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(e.target.value); 
              console.log("Search term:", e.target.value);
            }
          }}
          sx={{
            width: 250,
            height: 50,
            marginTop: 1,
            marginRight: 1,
            backgroundColor: "#f5f5f5", // Light gray background
            borderRadius: "15px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              height: 50,
              "& fieldset": {
                borderColor: "#5a6872", // Border color
              },
              "&:hover fieldset": {
                borderColor: "#5a6872",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto'}}>
      <Table  sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">Locations Code</TableCell>
            <TableCell align="center">Locations Name</TableCell>
            <TableCell align="center">Sub Units</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isLocationsLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell align="center" component="th" scope="row">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="70%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="60%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="90%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="70%" />
                </TableCell>
              </TableRow>
            ))
          ) : isLocationsError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={6} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            locations?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" scope="row">{row.sync_id}</TableCell>
                <TableCell align="center">{row.location_code}</TableCell>
                <TableCell align="center">{row.location_name}</TableCell>
                <TableCell align="center">
                <RemoveRedEyeIcon 
                    onClick={() => { 
                    setSelectedRow(row); // Store the clicked row's data in state
                    setIsViewMode(true); // Set mode to "View" for the dialog
                    setOpenDialog(true); // Open the dialog
                    }} 
                />
                </TableCell>
                <TableCell align="center">{dayjs(row.created_at).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="center">
                {row.deleted_at === null ? (
                      "Active"
                    ) : (
                     "Inactive"
                    )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1,  borderTop: '1px solid #ccc' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={locations?.data?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>

    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{
        '& .MuiDialog-paper': {
            width: '400px', 
            maxWidth: '500px', 
            height: 'auto', 
        },
    }}>
    <DialogTitle>{isViewMode ? "Sub Units" : "Confirmation"}</DialogTitle>
    <Divider />
    <DialogContent>
        {isViewMode ? (
        <Typography>
           {selectedRow?.sub_unit && selectedRow.sub_unit.length > 0 ? (
        <Typography 
          component="div" 
          sx={{ display: 'flex', flexWrap: 'wrap', gap: .5 }}
        >
          {selectedRow.sub_unit.map((sub, index) => (
            <Typography 
              key={index} 
              sx={{
                backgroundColor: 'grey.200',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.875rem', // Optional font styling
                marginBottom: '4px', // Spacing for each row if wrapped
              }}
            >
              {sub.sub_unit_name}
            </Typography>
          ))}
        </Typography>
      ) : (
        <Typography>No sub-units available</Typography>
      )}
        </Typography>
        ) : (
        <Typography>Are you sure you want to SYNC the data?</Typography>
        )}
    </DialogContent>
    <Divider />
    <DialogActions>
        <Button 
        onClick={() => {
            setOpenDialog(false);
          }}          
        variant="contained" 
        color="error"
        >
        {isViewMode ? "Close" : "Cancel"}
        </Button>

        {!isViewMode && (
        <Button 
            onClick={handleSyncLocations} 
            color="success" 
            variant="contained" 
            disabled={isYmirLoading}
            startIcon={isYmirLoading && <CircularProgress size={20} />}
        >
            {isYmirLoading ? "" : "Yes"}
        </Button>
        )}
    </DialogActions>
    </Dialog>


       {/* Snackbar */}
       <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}     
        </Alert>
      </Snackbar>
     
    </>
  )
}

export default Location;
