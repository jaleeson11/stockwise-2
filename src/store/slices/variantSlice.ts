import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { updateProductThunk, fetchProductById } from './productSlice';

interface Variant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface VariantState {
  variants: Variant[];
  selectedVariant: Variant | null;
  loading: boolean;
  error: string | null;
}

const initialState: VariantState = {
  variants: [],
  selectedVariant: null,
  loading: false,
  error: null,
};

// Create variant thunk
export const createVariant = createAsyncThunk(
  'variants/createVariant',
  async ({ productId, variantData }: { productId: string; variantData: Omit<Variant, 'id' | 'productId' | 'createdAt' | 'updatedAt'> }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/products/${productId}/variants`, variantData);
      const newVariant = response.data.data;
      
      // Fetch the latest product data to ensure we have all variants
      await dispatch(fetchProductById(productId)).unwrap();
      
      return newVariant;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create variant' });
    }
  }
);

// Fetch variants for a product
export const fetchProductVariants = createAsyncThunk(
  'variants/fetchProductVariants',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/variants`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch variants' });
    }
  }
);

const variantSlice = createSlice({
  name: 'variants',
  initialState,
  reducers: {
    setVariants: (state, action: PayloadAction<Variant[]>) => {
      state.variants = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedVariant: (state, action: PayloadAction<Variant>) => {
      state.selectedVariant = action.payload;
    },
    addVariant: (state, action: PayloadAction<Variant>) => {
      state.variants.push(action.payload);
    },
    updateVariant: (state, action: PayloadAction<Variant>) => {
      const index = state.variants.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.variants[index] = action.payload;
      }
    },
    deleteVariant: (state, action: PayloadAction<string>) => {
      state.variants = state.variants.filter(v => v.id !== action.payload);
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
      .addCase(createVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVariant.fulfilled, (state, action) => {
        state.variants.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.variants = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setVariants,
  setSelectedVariant,
  addVariant,
  updateVariant,
  deleteVariant,
  setLoading,
  setError,
} = variantSlice.actions;

export default variantSlice.reducer;