import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, useTheme } from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon, 
  AccountCircle 
} from '@mui/icons-material';
import SearchBar from '../common/SearchBar';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ 
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2, 
            display: { md: 'none' },
            color: 'text.primary',
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          StockWise
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
        }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <SearchBar />
          </Box>
          
          <IconButton 
            color="inherit"
            sx={{ color: 'text.primary' }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton 
            color="inherit"
            sx={{ color: 'text.primary' }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 