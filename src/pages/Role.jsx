import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, Menu, MenuItem, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { RoleSchema } from '../validations/validation';
import { useAddRoleMutation, useArchivedRoleMutation, useGetRoleQuery, useUpdateRoleMutation } from '../redux/slices/apiSlice';
import dayjs from 'dayjs';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Role = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [selectedID, setSelectedID] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    inputError,
    setValue
  } = useForm({
    defaultValues: {
      name:"",
      access_permission:[], 

    },
    resolver: yupResolver(RoleSchema),
  });


  // Fetch users with RTK Query hook
  const { data: role, isLoading, isError, error, refetch } = useGetRoleQuery({ search, page: page + 1, per_page: rowsPerPage, status});

  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [archiveRole] = useArchivedRoleMutation();

  function cleanPointer(pointer) {
    return pointer?.replace(/^\//, ""); // Removes the leading '/'
  }
  
  // Handle Create Role
  const handleCreateRole = async (data) => {
    try {
      const response = await addRole(data).unwrap();  // Using RTK Query's unwrap method for response handling
      console.log('Role created:', response);
      setOpenDialog(false);
      refetch();
      reset();
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.log(error?.data?.errors)
      error?.data?.errors.map((inputError, index) => setError(cleanPointer(inputError?.source?.pointer), { type: 'message', message: inputError?.detail }))
      setSnackbar({
        open: true,
        message: 'Please Double Check your input',
        severity: "error",
      });
    }
  };

  // Handle Update Role
  const handleUpdateRole = async (data) => {

    try {
      const response = await updateRole({ ...data, id: selectedID }).unwrap();
      console.log('role updated:', response);
      refetch();
      setOpenUpdateDialog(false);
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      setSnackbar({
        open: true,
        message: error?.message || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

   // Handle Delete/Archive Role
   const handleDeleteRole = async () => {
   
    try {
      const response = await archiveRole({ id: selectedID }).unwrap();
      console.log('Role archived:', response);
      setOpenDeleteDialog(false);
      refetch();
      setSnackbar({
        open: true,
        message: response?.message,
        severity: "success",
      });
    } catch (errors) {
      console.error('Error archiving role:', errors?.data?.errors?.[0]?.detail);
      setSnackbar({
        open: true,
        message: errors?.data?.errors?.[0]?.detail || 'An unexpected error occurred',
        severity: "error",
      });
    }
  };

  const handleCreate = () => {
    reset({
      name: "",
      access_permission: [],
    });
    setOpenDialog(true);
  };
  


  const handleEdit = (row) => {
    setSelectedID(row.id);
    reset(row);
    console.log(row)
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedID(row.id);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setSelectedID(null)
    setOpenDeleteDialog(false);
  };


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
      refetch()
    } else {
      setStatus("active");
      refetch()
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickDrowpDown = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropDown = () => {
    setAnchorEl(null);
  };


  const accessPermission = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];



  return (
    <>
     <Typography variant="h4" gutterBottom>
       Role
     </Typography>
     <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: 2 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/dashboard/masterlist">User Management</Link>
        <Link color="inherit" href="/dashboard/masterlist/company">Role</Link>
      </Breadcrumbs>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleCreate()}
          sx={{ marginLeft: 'auto' }}
        >
          ADD
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
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Access Permission</TableCell>
            <TableCell align="center">Created At</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If loading, show skeleton loader */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell align="center" component="th" scope="row">
                  <Skeleton width="80%" />
                </TableCell>
                <TableCell align="center">
                  <Skeleton width="60%" />
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
              </TableRow>
            ))
          ) : isError ? (
            // If error, show error message
            <TableRow>
              <TableCell colSpan={6} align="center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            // Once data is loaded, render the rows
            role?.data?.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" scope="row">{row.id}</TableCell>
                <TableCell component="th" align="center" scope="row">{row.name}</TableCell>
                <TableCell align="center"><RemoveRedEyeIcon /></TableCell>
                <TableCell align="center">{dayjs(row.created_at).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="center">
                {row.deleted_at === null ? (
                      "Active"
                    ) : (
                     "Inactive"
                    )}
                </TableCell>
                <TableCell align="center" sx={{ padding: '5px', gap:2 }}>
                  <MoreVertIcon 
                  onClick={handleClickDrowpDown}
                  />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseDropDown}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                     {
                  status === "active" ? (
                    <>
                    <MenuItem onClick={() => { handleCloseDropDown(); handleEdit(row); }}>Edit</MenuItem>
                    <MenuItem onClick={() => { handleCloseDropDown(); handleDeleteClick(row); }}>Archived</MenuItem> 
                    </>
                  ):(
                    <MenuItem onClick={handleCloseDropDown}>Restore</MenuItem>
                   
                  )}
                 
                  </Menu>
              
              
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
          count={role?.data?.data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>

    {/* Create Sugar Monitoring Dialog */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle> Daily Sugar input</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateRole)}>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                {...register('name')} 
                label="Name" 
                margin="dense" 
                fullWidth
                error={!!errors.name} 
                helperText={errors.name?.message} 
              />
            </Grid>
            <Grid item xs={6}>
            
            </Grid>
          </Grid>
          <TextField 
            {...register('access_permission')} 
            label="Access Permission" 
            fullWidth 
            margin="dense" 
            error={!!errors.access_permission} 
            helperText={errors.access_permission?.message} 
          />
        </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

       {/* Update Daily Sugar Dialog */}
       <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Daily Sugar</DialogTitle>
        <form onSubmit={handleSubmit(handleUpdateRole)}>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                {...register('name')} 
                label="Name" 
                margin="dense" 
                fullWidth
                error={!!errors.name} 
                helperText={errors.name?.message} 
              />
            </Grid>
            <Grid item xs={6}>
            
            </Grid>
          </Grid>
          <TextField 
            {...register('access_permission')} 
            label="Access Permission" 
            fullWidth 
            margin="dense" 
            error={!!errors.access_permission} 
            helperText={errors.access_permission?.message} 
          />
        </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to archive this record?</Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="error">Cancel</Button>
          <Button onClick={handleDeleteRole} color="success" variant="contained">Yes</Button>
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

export default Role