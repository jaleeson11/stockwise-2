import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8',
      light: '#4285F4',
      dark: '#1557B0',
    },
    secondary: {
      main: '#00B2A9',
      light: '#00D3C7',
      dark: '#00897F',
    },
    success: {
      main: '#36B37E',
    },
    warning: {
      main: '#FFAB00',
    },
    error: {
      main: '#FF5630',
    },
    info: {
      main: '#00B8D9',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#495057',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 150ms ease',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'transform 250ms ease, box-shadow 250ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#212529',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E9ECEF',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
  },
});

export default theme; 