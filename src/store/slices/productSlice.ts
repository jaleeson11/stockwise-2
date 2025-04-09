import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Inventory {
  id: string;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  productId: string;
  attributes: Record<string, string>;
  inventory?: Inventory;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching products from http://localhost:3001/api/products...');
      const response = await axios.get('http://localhost:3001/api/products');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      // The API returns { success, data, pagination }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log('Products fetched successfully:', response.data.data);
        return response.data.data;
      }
      
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error fetching products:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch products'
      );
    }
  }
);

// Async thunk for creating a product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      console.log('Creating product with data:', productData);
      const response = await axios.post('http://localhost:3001/api/products', productData);
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error creating product:', error);
      if (axios.isAxiosError(error)) {
        console.error('Validation errors:', error.response?.data?.errors);
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('Failed to create product');
    }
  }
);

// Async thunk for updating a product
export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/products/${id}`, productData);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error updating product:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('Failed to update product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProducts,
  setSelectedProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer; 