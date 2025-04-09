import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = 
    useAppSelector((state) => state.categories);
  
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  // Only fetch categories if they haven't been loaded yet
  useEffect(() => {
    if (open && !categories && !categoriesLoading && !categoriesError) {
      dispatch(fetchCategories());
    }
  }, [dispatch, open, categories, categoriesLoading, categoriesError]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        sku: '',
        name: '',
        description: '',
        categoryId: '',
      });
      setError(null);
      setValidationErrors({});
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for the field being changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setLoading(true);

    try {
      await dispatch(createProduct(formData)).unwrap();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create product');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '50vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle>Add New Product</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {categoriesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {categoriesError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              fullWidth
              error={!!validationErrors.sku}
              helperText={validationErrors.sku || "Unique product identifier"}
            />
            <TextField
              required
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
            {categoriesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <TextField
                required
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                error={!!validationErrors.categoryId || categoriesError !== null}
                helperText={validationErrors.categoryId || (categoriesError ? 'Failed to load categories' : 'Select a category')}
              >
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading || categoriesLoading || categoriesError !== null}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal; 