import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Variant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
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