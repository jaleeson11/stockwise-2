import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProductById } from '../../store/slices/productSlice';
import { fetchProductVariants } from '../../store/slices/variantSlice';
import VariantForm from '../variants/VariantForm';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  
  const { selectedProduct, loading: productLoading, error: productError } = 
    useAppSelector((state) => state.products);
  const { items: variants, loading: variantsLoading, error: variantsError } = 
    useAppSelector((state) => state.variants);
  
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      dispatch(fetchProductVariants(productId));
    }
  }, [dispatch, productId]);
  
  if (productLoading || variantsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (productError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {productError}
      </Alert>
    );
  }
  
  if (!selectedProduct) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Product not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Details
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Name
                </Typography>
                <Typography variant="body1">{selectedProduct.name}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  SKU
                </Typography>
                <Typography variant="body1">{selectedProduct.sku}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedProduct.description}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">{selectedProduct.category?.name || 'Uncategorized'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedProduct.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Variants
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsVariantFormOpen(true)}
              >
                Add Variant
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            {variantsError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {variantsError}
              </Alert>
            )}
            
            {variants.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No variants found for this product.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {variants.map((variant) => (
                  <Box
                    key={variant.id}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {Object.entries(variant.attributes)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {variant.sku}
                      </Typography>
                      {variant.inventory && (
                        <Chip
                          label={`Qty: ${variant.inventory.quantity}`}
                          size="small"
                          color={
                            variant.inventory.quantity > variant.inventory.lowStockThreshold
                              ? 'success'
                              : variant.inventory.quantity === 0
                              ? 'error'
                              : 'warning'
                          }
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <VariantForm
        open={isVariantFormOpen}
        onClose={() => setIsVariantFormOpen(false)}
        productId={selectedProduct.id}
        productName={selectedProduct.name}
      />
    </Box>
  );
};

export default ProductDetail; 