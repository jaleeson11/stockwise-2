import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { 
  Inventory as InventoryIcon, 
  ShoppingCart, 
  Sync, 
  Assessment,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchIntegrations } from '../../store/slices/integrationSlice';
import { fetchOrders } from '../../store/slices/orderSlice';
import { RootState } from '../../store/store';
import { PlatformConnection } from '../../store/slices/integrationSlice';
import { Order } from '../../store/slices/orderSlice';
import { InventoryItem } from '../../store/slices/inventorySlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  
  const { items: inventoryItems, loading: inventoryLoading } = 
    useAppSelector((state: RootState) => state.inventory);
  const { products, loading: productsLoading } = 
    useAppSelector((state: RootState) => state.products);
  const { connections, loading: integrationsLoading } = 
    useAppSelector((state: RootState) => state.integrations);
  const { orders, loading: ordersLoading } = 
    useAppSelector((state: RootState) => state.orders);
    
  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchProducts());
    dispatch(fetchIntegrations());
    dispatch(fetchOrders());
  }, [dispatch]);
  
  const isLoading = inventoryLoading || productsLoading || integrationsLoading || ordersLoading;
  
  // Calculate dashboard metrics
  const totalProducts = products.length;
  
  const lowStockItems = inventoryItems.filter((item: InventoryItem) => {
    // If item quantity is less than threshold but not zero
    return item.quantity > 0 && item.quantity <= item.lowStockThreshold;
  }).length;
  
  const connectedPlatforms = connections.filter(
    (platform: PlatformConnection) => platform.status === 'connected'
  ).length;
  
  const totalSales = orders.reduce((total: number, order: Order) => total + order.totalAmount, 0);

  if (isLoading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary' 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }) => (
    <Paper 
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: theme.palette[color].main,
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        color: `${color}.main`,
      }}>
        {icon}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            ml: 1,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<InventoryIcon sx={{ fontSize: 24 }} />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={<WarningIcon sx={{ fontSize: 24 }} />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Connected Platforms"
            value={connectedPlatforms}
            icon={<Sync sx={{ fontSize: 24 }} />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={`$${totalSales.toFixed(2)}`}
            icon={<TrendingUpIcon sx={{ fontSize: 24 }} />}
            color="success"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 