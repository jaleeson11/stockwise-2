import React, { useState } from 'react';
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
import { createCategory } from '../../store/slices/categorySlice';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  parentId?: string;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = 
    useAppSelector((state) => state.categories);
  
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for the field being changed
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      console.log('Submitting form data:', formData);
      const result = await dispatch(createCategory({
        name: formData.name,
        parentId: formData.parentId || null,
      })).unwrap();
      console.log('Category created successfully:', result);
      onClose();
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      if (err.errors) {
        console.error('Validation errors:', err.errors);
        setValidationErrors(err.errors);
      } else if (err.details) {
        console.error('Error details:', err.details);
        setError(`Error: ${err.details}`);
      } else if (err.message) {
        console.error('Error message:', err.message);
        setError(err.message);
      } else {
        console.error('Unknown error:', err);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
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
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!validationErrors.name}
              helperText={validationErrors.name || "Enter a name for the category"}
            />
            {categoriesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <TextField
                select
                label="Parent Category"
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                fullWidth
                error={!!validationErrors.parentId}
                helperText={validationErrors.parentId || "Optional: Select a parent category"}
              >
                <MenuItem value="">None (Top Level)</MenuItem>
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
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategoryModal; 