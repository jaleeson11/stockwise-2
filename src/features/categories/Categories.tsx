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
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../store/slices/categorySlice';
import AddCategoryModal from './AddCategoryModal';

interface ValidationErrors {
  name?: string;
  parentId?: string;
}

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedCategory, setEditedCategory] = useState({
    name: '',
    parentId: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category: any) => {
    setEditingCategoryId(category.id);
    setEditedCategory({
      name: category.name,
      parentId: category.parentId || '',
    });
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setEditedCategory({
      name: '',
      parentId: '',
    });
    setValidationErrors({});
  };

  const handleSave = async (categoryId: string) => {
    try {
      await dispatch(updateCategory({
        id: categoryId,
        name: editedCategory.name,
        parentId: editedCategory.parentId || null,
      })).unwrap();
      setEditingCategoryId(null);
      setValidationErrors({});
    } catch (err) {
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { message?: string; errors?: ValidationErrors };
        if (errorObj.errors) {
          setValidationErrors(errorObj.errors);
        }
      }
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categories</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {editingCategoryId === category.id ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedCategory.name}
                      onChange={(e) => setEditedCategory(prev => ({ ...prev, name: e.target.value }))}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  {editingCategoryId === category.id ? (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={editedCategory.parentId}
                      onChange={(e) => setEditedCategory(prev => ({ ...prev, parentId: e.target.value }))}
                      error={!!validationErrors.parentId}
                      helperText={validationErrors.parentId}
                    >
                      <MenuItem value="">None (Top Level)</MenuItem>
                      {categories
                        .filter(c => c.id !== category.id)
                        .map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  ) : (
                    category.parentId 
                      ? categories.find(c => c.id === category.parentId)?.name || 'Unknown'
                      : '-'
                  )}
                </TableCell>
                <TableCell>
                  {editingCategoryId === category.id ? (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Save">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleSave(category.id)}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={handleCancel}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleEdit(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDelete(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddCategoryModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Box>
  );
};

export default Categories; 