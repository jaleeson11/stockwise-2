import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
} from '@mui/material';
import {
  Assessment,
  Inventory as InventoryIcon,
  TrendingUp,
  Warning,
} from '@mui/icons-material';

const Reports: React.FC = () => {
  const reports = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Current stock levels and inventory valuation',
      icon: <InventoryIcon sx={{ fontSize: 40 }} color="primary" />,
    },
    {
      id: 'sales',
      title: 'Sales Analysis',
      description: 'Sales trends and performance metrics',
      icon: <TrendingUp sx={{ fontSize: 40 }} color="success" />,
    },
    {
      id: 'low-stock',
      title: 'Low Stock Alert',
      description: 'Products near or below threshold levels',
      icon: <Warning sx={{ fontSize: 40 }} color="warning" />,
    },
    {
      id: 'performance',
      title: 'Platform Performance',
      description: 'Sales performance across different platforms',
      icon: <Assessment sx={{ fontSize: 40 }} color="info" />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card>
              <CardContent>
                <Stack spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  {report.icon}
                  <Typography variant="h6" component="h2" align="center">
                    {report.title}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ minHeight: 40 }}
                >
                  {report.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button variant="contained" size="small">
                  Generate Report
                </Button>
                <Button variant="outlined" size="small">
                  View History
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reports; 