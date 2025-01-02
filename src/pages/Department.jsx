import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useGetDepartmentsQuery, useSyncDepartmentsMutation } from '../redux/slices/apiSlice';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import {  useLazyGetYmirDepartmentsQuery } from '../redux/slices/apiYmir';
import { Dashboard } from '@mui/icons-material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SearchIcon from '@mui/icons-material/Search';

const Department = () => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [openDialog, setOpenDialog] = useState(false);
  const [localSearch, setLocalSearch] = useState("");


  // Fetch Department with RTK Query hook
  const { data: departments, isLoading: isDepartmentLoading, isError: isDepartmentError, refetch: departmentRefetch } = useGetDepartmentsQuery({ search, page: page + 1, per_page: rowsPerPage, status  });

  // The trigger function for lazy query and response state
  const [trigger, { data: ymirDepartments, isLoading: isYmirLoading, isError: isYmirError, }] = useLazyGetYmirDepartmentsQuery();
  const [syncDepartments] = useSyncDepartmentsMutation();

  const handleSyncDepartments = () => {
    trigger()
      .unwrap() // Ensure to extract the response
      .then(response => {
        const ymirDepartments = response?.result;
  
        if (!ymirDepartments || ymirDepartments.length === 0) {
          throw new Error("No department data found to sync.");
        }
  
        const payload = {
        departments: ymirDepartments.map(department => ({
            sync_id: department.id,
            department_name: department.name,
            department_code: department.code,
            business_unit_id: department.business_unit.id,
            updated_at: dayjs(department.updated_at).format('YYYY-MM-DD HH:mm:ss'),
            deleted_at: department.deleted_at ? dayjs(department.deleted_at).format('YYYY-MM-DD HH:mm:ss') : null
          }))
        };
  
        // Return the syncDepartments call to maintain promise chaining
        return syncDepartments(payload).unwrap();
      })
      .then(syncResponse => {
        // Trigger refetch and show success notification
        departmentRefetch();
        setOpenDialog(false);
        setSnackbar({
          open: true,
          message: syncResponse?.message,
          severity: "success",
        });
      })
      .catch(error => {
        // Handle errors from either trigger or syncDepartments
        console.error('Error syncing department:', error?.message);
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
          <AccountTreeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Departments
        </Typography>
      </Breadcrumbs>
     <Typography variant="h4" gutterBottom>
       Departments
     </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() =>  setOpenDialog(true)}
          sx={{ marginLeft: 'auto', borderRadius: "10px", }}
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
            <TableCell align="center">Department Code</TableCell>
            <TableCell align="center">Department Name</TableCell>
            <TableCell align="center">Business Unit</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isDepartmentLoading ? (
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
          ) : isDepartmentError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={6} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            departments?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" scope="row">{row.sync_id}</TableCell>
                <TableCell align="center">{row.department_code}</TableCell>
                <TableCell align="center">{row.department_name}</TableCell>
                <TableCell align="center">{row.business_unit.business_unit_name}</TableCell>
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
          count={departments?.data?.total || 0}
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
          <Button onClick={handleSyncDepartments} color="success" variant="contained"  disabled={isYmirLoading} // Disable the button while loading
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

export default Department;
