import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  parentId: string | null;
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
      console.log('Fetching categories...');
      const response = await axios.get('http://localhost:3001/api/categories');
      console.log('Categories API response:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch categories'
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
      });
  },
});

export const {
  setCategories,
  setSelectedCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError,
} = categorySlice.actions;

export default categorySlice.reducer; 