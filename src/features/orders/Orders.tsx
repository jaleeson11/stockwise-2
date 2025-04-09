import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const Orders: React.FC = () => {
  // Placeholder data
  const orders = [
    {
      id: 'ORD001',
      platform: 'Shopify',
      date: '2024-04-08T10:30:00Z',
      status: 'Processing',
      total: 149.99,
      items: 3,
    },
    {
      id: 'ORD002',
      platform: 'Amazon',
      date: '2024-04-08T09:15:00Z',
      status: 'Shipped',
      total: 89.99,
      items: 1,
    },
    {
      id: 'ORD003',
      platform: 'eBay',
      date: '2024-04-08T08:45:00Z',
      status: 'Completed',
      total: 199.99,
      items: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.platform}</TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{order.items}</TableCell>
                <TableCell align="right">
                  ${order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Orders; 