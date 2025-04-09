import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface InventoryItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: 'p1',
    variantId: 'v1',
    quantity: 100,
    lowStockThreshold: 20,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    productId: 'p2',
    variantId: 'v2',
    quantity: 15,
    lowStockThreshold: 25,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    productId: 'p3',
    variantId: 'v3',
    quantity: 0,
    lowStockThreshold: 10,
    updatedAt: new Date().toISOString(),
  },
];

// Async thunk for fetching inventory
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockInventory;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch inventory'
      );
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedItem: (state, action: PayloadAction<InventoryItem>) => {
      state.selectedItem = action.payload;
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.updatedAt = new Date().toISOString();
      }
    },
    updateThreshold: (state, action: PayloadAction<{ id: string; threshold: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.lowStockThreshold = action.payload.threshold;
        item.updatedAt = new Date().toISOString();
      }
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
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setItems,
  setSelectedItem,
  updateQuantity,
  updateThreshold,
  setLoading,
  setError,
} = inventorySlice.actions;

export default inventorySlice.reducer; 