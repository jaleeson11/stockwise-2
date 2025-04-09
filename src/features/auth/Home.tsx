import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SyncIcon from '@mui/icons-material/Sync';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { keyframes } from '@mui/system';
import Logo from '../../components/common/Logo';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(4),
  left: theme.spacing(4),
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: theme.spacing(8),
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const DashboardIllustration = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 600,
  height: 400,
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
  },
}));

const ChartIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[4],
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  zIndex: 1,
}));

const DataPoint = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: theme.palette.success.main,
  boxShadow: `0 0 20px ${theme.palette.success.main}`,
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
  zIndex: 1,
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <InventoryIcon fontSize="large" />,
      title: 'Real-time Inventory',
      description: 'Track your stock levels in real-time across all locations',
    },
    {
      icon: <AnalyticsIcon fontSize="large" />,
      title: 'Smart Analytics',
      description: 'Get insights with powerful analytics and reporting tools',
    },
    {
      icon: <SyncIcon fontSize="large" />,
      title: 'Multi-channel Sync',
      description: 'Seamlessly sync with multiple sales channels',
    },
    {
      icon: <NotificationsIcon fontSize="large" />,
      title: 'Automated Alerts',
      description: 'Stay informed with smart stock level notifications',
    },
    {
      icon: <StorageIcon fontSize="large" />,
      title: 'Bulk Operations',
      description: 'Efficiently manage large inventory updates',
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'Team Management',
      description: 'Control access with role-based permissions',
    },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <HeroSection>
        <LogoContainer>
          <Logo size="medium" />
        </LogoContainer>
        <Container maxWidth="lg" sx={{ pt: { xs: 4, sm: 6 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Smart Inventory Management
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                Streamline your operations with our powerful inventory management platform
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap' }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Get Started
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
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative', height: 400 }}>
              <ChartIcon sx={{ top: '20%', left: '20%' }}>
                <TrendingUpIcon fontSize="large" />
              </ChartIcon>
              <ChartIcon sx={{ top: '40%', right: '20%', animationDelay: '0.5s' }}>
                <BarChartIcon fontSize="large" />
              </ChartIcon>
              <ChartIcon sx={{ bottom: '20%', left: '30%', animationDelay: '1s' }}>
                <TimelineIcon fontSize="large" />
              </ChartIcon>
              <DataPoint sx={{ top: '30%', left: '40%' }} />
              <DataPoint sx={{ top: '50%', right: '30%', animationDelay: '0.5s' }} />
              <DataPoint sx={{ bottom: '30%', left: '50%', animationDelay: '1s' }} />
              <DataPoint sx={{ bottom: '40%', right: '40%', animationDelay: '1.5s' }} />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Powerful Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 