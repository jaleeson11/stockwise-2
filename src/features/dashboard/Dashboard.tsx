import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { Inventory as InventoryIcon, ShoppingCart, Sync, Assessment } from '@mui/icons-material';
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Products Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">{totalProducts}</Typography>
          </Paper>
        </Grid>

        {/* Low Stock Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h4">{lowStockItems}</Typography>
          </Paper>
        </Grid>

        {/* Connected Platforms Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Connected Platforms
            </Typography>
            <Typography variant="h4">{connectedPlatforms}</Typography>
          </Paper>
        </Grid>

        {/* Total Sales Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography color="textSecondary" gutterBottom>
              Total Sales
            </Typography>
            <Typography variant="h4">
              ${totalSales.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 