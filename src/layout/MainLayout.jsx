import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemButton from '@mui/material/ListItemButton';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Dashboard, ExpandLess, ExpandMore } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BallotIcon from '@mui/icons-material/Ballot';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const storedData = JSON.parse(localStorage.getItem("user"));

  let accessPermissions = storedData?.role?.access_permission;
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

    // Handle open modal (triggered when the user clicks the logout button)
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    // Handle close modal without logging out
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    // Handle logout functionality
    const handleLogout = () => {
      // Remove token and user from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      // Redirect to the homepage or login page after logout
      navigate('/');
    };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedUserManagement, setIsExpandedUserManagement] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExpandUserManagement = () => {
    setIsExpandedUserManagement(!isExpandedUserManagement);
    
  };

  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Locus
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
                onClick={() => handleNavigation('/dashboard')}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 2,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
            {accessPermissions.includes("masterlist") && (
          <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={[
              {
                minHeight: 48,
                px: 2.5,
              },
              open
                ? {
                    justifyContent: 'initial',
                  }
                : {
                    justifyContent: 'center',
                  },
            ]}
            
            onClick={() => {
              handleNavigation('/dashboard/masterlist');
              toggleExpand();
            }}
          >
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                },
                open
                  ? {
                      mr: 2,
                    }
                  : {
                      mr: 'auto',
                    },
              ]}
            >
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="Masterlist"
              sx={[
                open
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                    },
              ]}
            />
            {open && ( <div>
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </div>
            )}
          </ListItemButton>
        </ListItem>
        )}
        {/* Child Items */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        
        {accessPermissions.includes("masterlist:companies:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/company')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <ApartmentIcon />
            </ListItemIcon>
            <ListItemText
              primary="Company"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("masterlist:business-units:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/business_unit')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <BusinessCenterIcon />
            </ListItemIcon>
            <ListItemText
              primary="Business Unit"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("masterlist:departments:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/department')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Department"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("masterlist:units:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/unit')}
          >
             <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <BallotIcon />
            </ListItemIcon>
            <ListItemText
              primary="Units"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("masterlist:subunits:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/sub_unit')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <ViewHeadlineIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sub Unit"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("masterlist:locations:sync") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/masterlist/locations')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <ShareLocationIcon />
            </ListItemIcon>
            <ListItemText
              primary="Locations"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        </Collapse>

        {/* user management */}
        {accessPermissions.includes("user-management") && (
          <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={[
              {
                minHeight: 48,
                px: 2.5,
              },
              open
                ? {
                    justifyContent: 'initial',
                  }
                : {
                    justifyContent: 'center',
                  },
            ]}
            
            onClick={() => {
              handleNavigation('/dashboard/user-management');
              toggleExpandUserManagement();
            }}
          >
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                },
                open
                  ? {
                      mr: 2,
                    }
                  : {
                      mr: 'auto',
                    },
              ]}
            >
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
              sx={[
                open
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                    },
              ]}
            />
            {open && ( <div>
            {isExpandedUserManagement ? <ExpandLess /> : <ExpandMore />}
            </div>
            )}
          </ListItemButton>
        </ListItem>
        )}
        {/* Child Items */}
        <Collapse in={isExpandedUserManagement} timeout="auto" unmountOnExit>
        
        {accessPermissions.includes("user-accounts:crud") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/user-management/user-accounts')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText
              primary="User Accounts"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        
        {accessPermissions.includes("role-management:crud") && (
          <ListItemButton
            sx={{
              pl: open ? 5 : 2.5,
            }}
            onClick={() => handleNavigation('/dashboard/user-management/role-management')}
          >
            <ListItemIcon
             sx={[
              {
                minWidth: 0,
                justifyContent: 'center',
              },
              open
                ? {
                    mr: 2,
                  }
                : {
                    mr: 'auto',
                  },
            ]}>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Role Management"
              sx={{
                opacity: open ? 1 : 0,
              }}
            />
          </ListItemButton>
        )}
        </Collapse>
        
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? 'initial' : 'center',
              }}
              onClick={handleOpenModal}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  mr: open ? 2 : 'auto',  // Align icon based on open state
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />

         {/* Confirmation Modal */}
      </Box>
    </Box>
    <Dialog open={openModal} onClose={handleCloseModal}>
    <DialogTitle>Are you sure you want to log out?</DialogTitle>
    <Divider />
    <DialogContent>
      <p>If you log out, you will need to log in again to access your account.</p>
    </DialogContent>
    <Divider />
    <DialogActions>
      <Button onClick={handleCloseModal} variant="contained" color="error">
        Cancel
      </Button>
      <Button onClick={handleLogout} variant="contained" color="success">
        Log Out
      </Button>
    </DialogActions>
  </Dialog>
</>
  );
}
