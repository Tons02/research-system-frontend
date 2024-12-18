import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useGetSubUnitsQuery, useSyncSubUnitsMutation } from '../redux/slices/apiSlice';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import {  useLazyGetYmirSubUnitsQuery } from '../redux/slices/apiYmir';

const SubUnit = () => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [openDialog, setOpenDialog] = useState(false);


  // Fetch Sub Unit with RTK Query hook
  const { data: subUnits, isLoading: isSubUnitLoading, isError: isSubUnitError, refetch: subUnitsRefetch } = useGetSubUnitsQuery({ search, page: page + 1, per_page: rowsPerPage, status  });

  // The trigger function for lazy query and response state
  const [trigger, { data: ymirSubUnits, isLoading: isYmirLoading, isError: isYmirError, }] = useLazyGetYmirSubUnitsQuery();
  const [syncSubUnits] = useSyncSubUnitsMutation();

  const handleSyncUnits = () => {
    trigger()
      .unwrap() // Ensure to extract the response
      .then(response => {
        const ymirSubUnits = response?.result;
  
        if (!ymirSubUnits || ymirSubUnits.length === 0) {
          throw new Error("No units data found to sync.");
        }
  
        const payload = {
        sub_units: ymirSubUnits.map(sub_unit => ({
            sync_id: sub_unit.id,
            sub_unit_code: sub_unit.code,
            sub_unit_name: sub_unit.name,
            unit_id: sub_unit.department_unit.id,
            updated_at: dayjs(sub_unit.updated_at).format('YYYY-MM-DD HH:mm:ss'),
            deleted_at: sub_unit.deleted_at ? dayjs(sub_unit.deleted_at).format('YYYY-MM-DD HH:mm:ss') : null
          }))
        };
  
        // Return the syncSubUnits call to maintain promise chaining
        return syncSubUnits(payload).unwrap();
      })
      .then(syncResponse => {
        // Trigger refetch and show success notification
        subUnitsRefetch();
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: syncResponse?.message,
          severity: "success",
        });
      })
      .catch(error => {
        // Handle errors from either trigger or syncSubUnits
        console.error('Error syncing sub units:', error?.message);
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
    subUnitsRefetch()
  } else {
    setStatus("active");
    subUnitsRefetch()
  }
};
  return (
    <>
     <Typography variant="h4" gutterBottom>
      Sub Units
     </Typography>
     <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/dashboard/masterlist">Masterlist</Link>
        <Link color="inherit" href="/dashboard/masterlist/sub-units">Sub Units</Link>
      </Breadcrumbs>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() =>  setOpenDialog(true)}
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
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 300 }} />
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto'}}>
      <Table  sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">Sub Unit Code</TableCell>
            <TableCell align="center">Sub Unit Name</TableCell>
            <TableCell align="center">Unit</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isSubUnitLoading ? (
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
          ) : isSubUnitError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={6} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            subUnits?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" scope="row">{row.sync_id}</TableCell>
                <TableCell align="center">{row.sub_unit_code}</TableCell>
                <TableCell align="center">{row.sub_unit_name}</TableCell>
                <TableCell align="center">{row.unit?.unit_name}</TableCell>
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
          count={subUnits?.data?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>

    <Dialog open={openDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to SYNC the data?</Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="error">Cancel</Button>
          <Button onClick={handleSyncUnits} color="success" variant="contained"  disabled={isYmirLoading} // Disable the button while loading
            startIcon={isYmirLoading && <CircularProgress size={20} />} >{isYmirLoading ? "" : "Yes"}</Button>
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

export default SubUnit;
