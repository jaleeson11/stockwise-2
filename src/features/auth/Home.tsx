import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '200px',
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h3" gutterBottom>
          Welcome to StockWise
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Your all-in-one inventory management solution
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Streamline your inventory management, track stock levels, and manage multiple sales channels from one platform.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <StyledButton
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Create Account
          </StyledButton>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Key Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {[
              'Real-time Inventory Tracking',
              'Multi-channel Integration',
              'Automated Stock Alerts',
              'Detailed Analytics',
              'Bulk Operations',
              'User Management'
            ].map((feature) => (
              <Paper
                key={feature}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  minWidth: '200px',
                }}
              >
                <Typography variant="body1">{feature}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Home; 