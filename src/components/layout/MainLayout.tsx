import React from 'react';
import { Box, CssBaseline, Drawer, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              top: { xs: 56, sm: 64 },
              height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' },
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Navigation />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          backgroundColor: 'background.default',
          mt: { xs: 7, sm: 8 },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 