import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import IntegrationIcon from '@mui/icons-material/Extension';
import OrdersIcon from '@mui/icons-material/Receipt';
import ReportsIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import CategoryIcon from '@mui/icons-material/Category';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Products', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Integrations', icon: <IntegrationIcon />, path: '/integrations' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      width: 250,
      pt: 2,
    }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : 'text.secondary',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Navigation; 