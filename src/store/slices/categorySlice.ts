import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
  parent?: Category;
}

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error('Invalid response format from API');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch categories'
      );
    }
  }
);

// Async thunk for creating a category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: { name: string; parentId: string | null }, { rejectWithValue }) => {
    try {
      console.log('Sending category data to server:', categoryData);
      
      const response = await axios.post('http://localhost:3001/api/categories', categoryData);
      console.log('Server response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      throw new Error('Invalid response format from API');
    } catch (error: any) {
      console.error('Error in createCategory thunk:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        response: error?.response
      });
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create category'
      );
    }
  }
);

// Async thunk for updating a category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }: { id: string; name: string; parentId: string | null }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/categories/${id}`, categoryData);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      throw new Error('Invalid response format from API');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to update category'
      );
    }
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/categories/${categoryId}`);
      if (response.data && response.data.success) {
        return categoryId;
      }
      throw new Error('Invalid response format from API');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to delete category'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(c => c.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCategories,
  setSelectedCategory,
  addCategory,
  updateCategory: updateCategoryAction,
  deleteCategory: deleteCategoryAction,
  setLoading,
  setError,
} = categorySlice.actions;

export default categorySlice.reducer; 