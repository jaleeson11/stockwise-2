import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/slices/categorySlice';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (categories.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No categories found.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Categories
        </Typography>
      </Box>

      <Paper>
        <List>
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText 
                  primary={category.name} 
                  secondary={
                    <Chip 
                      label={`${category.children?.length || 0} subcategories`} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  } 
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CategoryList; 