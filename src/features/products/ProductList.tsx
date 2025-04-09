import React, { useEffect, useState } from 'react';
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
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Tooltip,
  Collapse,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProducts, updateProductThunk, Product } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import AddProductModal from './AddProductModal';

interface ValidationErrors {
  sku?: string;
  name?: string;
  description?: string;
  categoryId?: string;
}

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  
  const productState = useAppSelector((state) => state.products);
  const categoryState = useAppSelector((state) => state.categories);
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Reset modal state when route changes
  useEffect(() => {
    setIsAddModalOpen(false);
    setEditingProductId(null);
    setEditedProduct({});
    setValidationErrors({});
    setExpandedProductId(null);
  }, [location.pathname]);

  // Debug logging
  console.log('Product State:', productState);
  console.log('Products type:', typeof productState.products);
  console.log('Products value:', productState.products);
  
  const getCategoryName = (categoryId: string) => {
    if (!categoryState.categories) return 'Uncategorized';
    const category = categoryState.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const handleRowClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleEditClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setEditingProductId(product.id);
    setEditedProduct({
      sku: product.sku,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId
    });
    setValidationErrors({});
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProductId(null);
    setEditedProduct({});
    setValidationErrors({});
  };

  const handleSaveEdit = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      await dispatch(updateProductThunk({ id: productId, productData: editedProduct })).unwrap();
      setEditingProductId(null);
      setEditedProduct({});
      setValidationErrors({});
    } catch (error: any) {
      if (error.errors) {
        setValidationErrors(error.errors);
      }
    }
  };

  const handleFieldChange = (field: keyof Product, value: string) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for the field when it's changed
    setValidationErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleVariantExpand = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const formatVariantAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  if (productState.loading || categoryState.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productState.error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {productState.error}
      </Alert>
    );
  }

  if (categoryState.error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {categoryState.error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      {(!productState.products || !Array.isArray(productState.products) || productState.products.length === 0) ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No products found.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Variants</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productState.products.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow hover>
                    <TableCell>
                      {editingProductId === product.id ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editedProduct.sku || ''}
                          onChange={(e) => handleFieldChange('sku', e.target.value)}
                          error={!!validationErrors.sku}
                          helperText={validationErrors.sku}
                        />
                      ) : (
                        product.sku
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProductId === product.id ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editedProduct.name || ''}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          error={!!validationErrors.name}
                          helperText={validationErrors.name}
                        />
                      ) : (
                        product.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingProductId === product.id ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          value={editedProduct.categoryId || ''}
                          onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                          error={!!validationErrors.categoryId}
                          helperText={validationErrors.categoryId}
                        >
                          {categoryState.categories?.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Chip 
                          label={getCategoryName(product.categoryId)} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={`${product.variants?.length || 0} variants`}
                          size="small"
                          color="default"
                          variant="outlined"
                          onClick={(e) => handleVariantExpand(e, product.id)}
                          sx={{ cursor: 'pointer' }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleVariantExpand(e, product.id)}
                        >
                          {expandedProductId === product.id ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {editingProductId === product.id ? (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Save changes">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => handleSaveEdit(e, product.id)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={handleCancelEdit}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleEditClick(e, product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  {editingProductId === product.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Description"
                          value={editedProduct.description || ''}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          error={!!validationErrors.description}
                          helperText={validationErrors.description}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expandedProductId === product.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                          {product.variants && product.variants.length > 0 ? (
                            <Stack spacing={1}>
                              {product.variants.map((variant) => (
                                <Paper 
                                  key={variant.id} 
                                  variant="outlined" 
                                  sx={{ p: 1 }}
                                >
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="body2" sx={{ minWidth: 100 }}>
                                      {variant.sku}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {formatVariantAttributes(variant.attributes)}
                                    </Typography>
                                    {variant.inventory && (
                                      <Chip
                                        size="small"
                                        label={`Qty: ${variant.inventory.quantity}`}
                                        color={
                                          variant.inventory.quantity > variant.inventory.lowStockThreshold
                                            ? 'success'
                                            : variant.inventory.quantity === 0
                                            ? 'error'
                                            : 'warning'
                                        }
                                      />
                                    )}
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No variants found for this product.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddProductModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </Box>
  );
};

export default ProductList; 