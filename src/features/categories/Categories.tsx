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
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchCategories } from '../../store/slices/categorySlice';

const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Parent Category</TableCell>
              <TableCell>Products Count</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                hover
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.parentId 
                    ? categories.find(c => c.id === category.parentId)?.name || 'Unknown'
                    : '-'}
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Categories; 