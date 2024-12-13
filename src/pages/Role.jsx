import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Breadcrumbs, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, Menu, MenuItem, OutlinedInput, Paper, Select, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
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
  const [viewAccessPermission, setViewAccessPermission] = useState(false);
  const [restoreRole, setRestoreRole] = useState(false);
  const [activeMenuRow, setActiveMenuRow] = useState(null); 
  


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
   console.log(data)

    try {
      const response = await addRole(data).unwrap();  
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
    // Map row.access_permission to checked state
    const newChecked = Array(11).fill(false); // Assuming you have 11 checkboxes

    row.access_permission.forEach((permission) => {
      const index = Object.values(permissionsMap).indexOf(permission);
      if (index > -1) {
        newChecked[index] = true;
      }
    });

    setChecked(newChecked);
    setValue('access_permission', row.access_permission);
    
    reset(row); // Reset the form with new data
    console.log(row);
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedID(row.id);
    setOpenDeleteDialog(true);
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
  const handleClickDrowpDown = (event, row) => {
    setActiveMenuRow(row.id); 
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropDown = () => {
    setAnchorEl(null);
  };

  
  const [checked, setChecked] = useState(Array(11).fill(false));

  const handleSelectAllRole = (event) => {
    const isChecked = event.target.checked;
    setChecked(Array(11).fill(isChecked)); // Set all checkboxes to the same value
  };

  
  const handleClose = () => {
    setViewAccessPermission(false);
    setRestoreRole(false);
    setSelectedID(null)
    setOpenDialog(false);
    setOpenUpdateDialog(false);
    setOpenDeleteDialog(false);
    setChecked(Array(11).fill(false));
  };


  const permissionsMap = {
    0: "dashboard",
    1: "masterlist",
    2: "masterlist:companies:sync",
    3: "masterlist:business-units:sync",
    4: "masterlist:departments:sync",
    5: "masterlist:units:sync",
    6: "masterlist:subunits:sync",
    7: "masterlist:locations:sync",
    8: "user-management",
    9: "user-accounts:crud",
    10: "role-management:crud",
  };

  const handleCheckboxChange = (index, parentIndex) => (event) => {
    const isChecked = event.target.checked;
    const newChecked = [...checked];
    newChecked[index] = isChecked;
  
    // Handle child dependencies
    if (index === 1 && !isChecked) { // Masterlist
      for (let i = 2; i <= 7; i++) {
        newChecked[i] = false;
      }
    }
  
    if (index === 8 && !isChecked) { // User Management
      for (let i = 9; i <= 10; i++) {
        newChecked[i] = false;
      }
    }
  
    // Update access_permission array based on newChecked
    const newAccessPermission = Object.keys(permissionsMap)
      .filter((key) => newChecked[key])
      .map((key) => permissionsMap[key]);
  
    setChecked(newChecked);
    setValue('access_permission', newAccessPermission);
    console.log(newAccessPermission);
  };


  // Hide children unless their parent is selected
  const renderChild = (parentIndex, children) => {
    return checked[parentIndex] ? (
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {children}
      </Box>
    ) : null;
  };

  

  return (
    <>
     <Typography variant="h4" gutterBottom>
       Role
     </Typography>
     <Breadcrumbs aria-label="breadcrumb">
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
          sx={{ width: 300}} />
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
                <TableCell align="center"><RemoveRedEyeIcon onClick={() => { setViewAccessPermission(true); handleEdit(row);  }}/></TableCell>
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
                  onClick={(event) => handleClickDrowpDown(event, row)} 
                  />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={activeMenuRow === row.id && open}
                    onClose={handleCloseDropDown}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                     {
                  status === "active" ? (
                    <Box>
                    <MenuItem onClick={() => { handleCloseDropDown(); handleEdit(row); }}>Edit</MenuItem>
                    <MenuItem onClick={() => { handleCloseDropDown(); handleDeleteClick(row); }}>Archived</MenuItem> 
                    </Box>
                  ):(
                    <MenuItem onClick={() => { handleCloseDropDown(); handleDeleteClick(row); setRestoreRole(true); }}>Restore</MenuItem>
                   
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

    {/* Create Role Dialog Dialog */}
    <Dialog open={openDialog} fullWidth maxWidth="sm">
        <DialogTitle> Create New Role</DialogTitle>
        <form onSubmit={handleSubmit(handleCreateRole)}>
        <Divider />
        <DialogContent>
            <TextField 
              {...register('name')} 
              label="Name" 
              margin="dense" 
              fullWidth
              error={!!errors.name} 
              helperText={errors.name?.message} 
            />
            
       {errors.access_permission && (
        <Typography color="error">{errors.access_permission.message}</Typography>
      )}
         <Box>
        
         <Box
            sx={{
              border: '1px solid #a6a6a6', // Enclose CSS values in quotes
              borderRadius: '10px', // Use camelCase for CSS property names
              paddingLeft: '10px',
              paddingRight: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
      {/* Select Role */}
      <FormControlLabel
        label="Select Role"
        control={
          <Checkbox
            {...register('access_permission')}
            checked={checked.every((val) => val)} // All checked
            indeterminate={
              !checked.every((val) => val) && checked.some((val) => val)
            } // Some but not all are checked
            onChange={handleSelectAllRole}
          />
        }
      />
      {/* Dashboard */}
      <FormControlLabel
        label="Dashboard"
        control={
          <Checkbox
            checked={checked[0]}
            onChange={handleCheckboxChange(0)}
          />
        }
      />

      {/* Masterlist */}
      <FormControlLabel
        label="Masterlist"
        control={
          <Checkbox
            checked={checked[1]}
            onChange={handleCheckboxChange(1)}
          />
        }
      />
      {renderChild(1, (
        <>
        <Box
       sx={{
        flexDirection: 'column', // Use camelCase for CSS properties
        position: 'relative',
        minWidth: 0,
        padding: 0,
        margin: 0,
        border: '1px solid #a6a6a6af', // Proper syntax for border value
        verticalAlign: 'top',
        width: '100%',
        borderRadius: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '10px',
        marginBottom: '15px',
      }}      
      >
          <FormControlLabel
            label="Companies"
            control={
              <Checkbox
                checked={checked[2]}
                onChange={handleCheckboxChange(2, 1)}
              />
            }
          />
          <FormControlLabel
            label="Business Units"
            control={
              <Checkbox
                checked={checked[3]}
                onChange={handleCheckboxChange(3, 1)}
              />
            }
          />
          <FormControlLabel
            label="Department"
            control={
              <Checkbox
                checked={checked[4]}
                onChange={handleCheckboxChange(4, 1)}
              />
            }
          />
           <FormControlLabel
            label="Units"
            control={
              <Checkbox
                checked={checked[5]}
                onChange={handleCheckboxChange(5, 1)}
              />
            }
          />
          <FormControlLabel
            label="Sub Units"
            control={
              <Checkbox
                checked={checked[6]}
                onChange={handleCheckboxChange(6, 1)}
              />
            }
          />
           <FormControlLabel
            label="Locations"
            control={
              <Checkbox
                checked={checked[7]}
                onChange={handleCheckboxChange(7, 1)}
              />
            }
          />
          </Box>
        </>
      ))}

      {/* User Management */}
      <FormControlLabel
        label="User Management"
        control={
          <Checkbox
            checked={checked[8]}
            onChange={handleCheckboxChange(8)}
          />
        }
      />
      {renderChild(8, (
        <>
        
        <Box
       sx={{
        flexDirection: 'column', // Use camelCase for CSS properties
        position: 'relative',
        minWidth: 0,
        padding: 0,
        margin: 0,
        border: '1px solid #a6a6a6af', // Proper syntax for border value
        verticalAlign: 'top',
        width: '100%',
        borderRadius: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '10px',
        marginBottom: '15px',
      }}      
      >
          <FormControlLabel
            label="User Accounts"
            control={
              <Checkbox
                checked={checked[9]}
                onChange={handleCheckboxChange(9, 8)}
              />
            }
          />
          <FormControlLabel
            label="Role Management"
            control={
              <Checkbox
                checked={checked[10]}
                onChange={handleCheckboxChange(10, 8)}
              />
            }
          />
          </Box>
        </>
      ))}
      </Box>
    </Box>
        </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => handleClose()} color="error" variant="contained">Cancel</Button>
            <Button type="submit" color="success" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

       {/* Update Role Dialog */}
       <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="sm">
       <DialogTitle>
        {viewAccessPermission ? "Access Permission" : "Update Role"}
      </DialogTitle>
        <form onSubmit={handleSubmit(handleUpdateRole)}>
        <Divider />
        <DialogContent>
              <TextField 
            disabled={viewAccessPermission}
                {...register('name')} 
                label="Name" 
                margin="dense" 
                fullWidth
                error={!!errors.name} 
                helperText={errors.name?.message} 
              />
          {errors.access_permission && (
        <Typography color="error">{errors.access_permission.message}</Typography>
      )}
         <Box>
        
         <Box
            sx={{
              border: '1px solid #a6a6a6', // Enclose CSS values in quotes
              borderRadius: '10px', // Use camelCase for CSS property names
              paddingLeft: '10px',
              paddingRight: '10px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
      {/* Select Role */}
      <FormControlLabel
        label="Select Role"
        control={
          <Checkbox
            disabled={viewAccessPermission}
            {...register('access_permission')}
            checked={checked.every((val) => val)} // All checked
            indeterminate={
              !checked.every((val) => val) && checked.some((val) => val)
            } // Some but not all are checked
            onChange={handleSelectAllRole}
          />
        }
      />
      {/* Dashboard */}
      <FormControlLabel
        label="Dashboard"
        control={
          <Checkbox
            disabled={viewAccessPermission}
            checked={checked[0]}
            onChange={handleCheckboxChange(0)}
          />
        }
      />

      {/* Masterlist */}
      <FormControlLabel
        label="Masterlist"
        control={
          <Checkbox
            disabled={viewAccessPermission}
            checked={checked[1]}
            onChange={handleCheckboxChange(1)}
          />
        }
      />
      {renderChild(1, (
        <>
        <Box
       sx={{
        flexDirection: 'column', // Use camelCase for CSS properties
        position: 'relative',
        minWidth: 0,
        padding: 0,
        margin: 0,
        border: '1px solid #a6a6a6af', // Proper syntax for border value
        verticalAlign: 'top',
        width: '100%',
        borderRadius: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '10px',
        marginBottom: '15px',
      }}      
      >
          <FormControlLabel
            label="Companies"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[2]}
                onChange={handleCheckboxChange(2, 1)}
              />
            }
          />
          <FormControlLabel
            label="Business Units"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[3]}
                onChange={handleCheckboxChange(3, 1)}
              />
            }
          />
          <FormControlLabel
            label="Department"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[4]}
                onChange={handleCheckboxChange(4, 1)}
              />
            }
          />
           <FormControlLabel
            label="Units"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[5]}
                onChange={handleCheckboxChange(5, 1)}
              />
            }
          />
          <FormControlLabel
            label="Sub Units"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[6]}
                onChange={handleCheckboxChange(6, 1)}
              />
            }
          />
           <FormControlLabel
            label="Locations"
            control={
              <Checkbox
                disabled={viewAccessPermission} 
                checked={checked[7]}
                onChange={handleCheckboxChange(7, 1)}
              />
            }
          />
          </Box>
        </>
      ))}

      {/* User Management */}
      <FormControlLabel
        label="User Management"
        control={
          <Checkbox
            disabled={viewAccessPermission}
            checked={checked[8]}
            onChange={handleCheckboxChange(8)}
          />
        }
      />
      {renderChild(8, (
        <>
        
        <Box
       sx={{
        flexDirection: 'column', // Use camelCase for CSS properties
        position: 'relative',
        minWidth: 0,
        padding: 0,
        margin: 0,
        border: '1px solid #a6a6a6af', // Proper syntax for border value
        verticalAlign: 'top',
        width: '100%',
        borderRadius: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '10px',
        marginBottom: '15px',
      }}      
      >
          <FormControlLabel
            label="User Accounts"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[9]}
                onChange={handleCheckboxChange(9, 8)}
              />
            }
          />
          <FormControlLabel
            label="Role Management"
            control={
              <Checkbox
                disabled={viewAccessPermission}
                checked={checked[10]}
                onChange={handleCheckboxChange(10, 8)}
              />
            }
          />
          </Box>
        </>
      ))}
      </Box>
    </Box>
        </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => handleClose()} color="error" variant="contained">{viewAccessPermission ? "Close" : "Cancel"}</Button>
            {viewAccessPermission ? "" : <Button type="submit" color="success" variant="contained">Update</Button>}
            
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={openDeleteDialog}>
        <DialogTitle>{restoreRole ? "Restore" : "Archived"}</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to {restoreRole ? "restore" : "archived"} this record?</Typography>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => handleClose()} variant="contained" color="error">Cancel</Button>
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