import React, { useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts } from '../../store/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';

const VariantList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { products, loading: productsLoading, error: productsError } = 
    useAppSelector((state: RootState) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Function to format variant attributes for display
  const formatAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  // Function to get stock status
  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const };
    if (quantity <= threshold) return { label: 'Low Stock', color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  if (productsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {productsError}
      </Alert>
    );
  }

  // Flatten all variants into a single array
  const allVariants = products.flatMap(product => 
    (product.variants || []).map(variant => ({
      ...variant,
      productName: product.name,
      productSku: product.sku
    }))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Variants
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/variants/new')}
        >
          Add Variant
        </Button>
      </Box>

      {allVariants.length === 0 ? (
        <Alert severity="info">No variants found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Variant SKU</TableCell>
                <TableCell>Attributes</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allVariants.map((variant) => {
                const stockStatus = variant.inventory 
                  ? getStockStatus(variant.inventory.quantity, variant.inventory.lowStockThreshold)
                  : { label: 'No Stock Info', color: 'default' as const };

                return (
                  <TableRow
                    key={variant.id}
                    hover
                    onClick={() => navigate(`/variants/${variant.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {variant.productName}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary">
                        SKU: {variant.productSku}
                      </Typography>
                    </TableCell>
                    <TableCell>{variant.sku}</TableCell>
                    <TableCell>{formatAttributes(variant.attributes)}</TableCell>
                    <TableCell>
                      {variant.inventory ? variant.inventory.quantity : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default VariantList; 