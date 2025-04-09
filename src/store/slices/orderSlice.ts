import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  platformConnectionId: string;
  externalOrderId: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    platformConnectionId: '1', // Shopify connection
    externalOrderId: 'SHOP-123',
    orderDate: new Date().toISOString(),
    status: 'pending',
    totalAmount: 129.99,
    items: [
      {
        id: 'item1',
        productId: 'p1',
        variantId: 'v1',
        quantity: 2,
        price: 64.99,
      }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    platformConnectionId: '2', // Amazon connection
    externalOrderId: 'AMZ-456',
    orderDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'processing',
    totalAmount: 49.99,
    items: [
      {
        id: 'item2',
        productId: 'p2',
        variantId: 'v2',
        quantity: 1,
        price: 49.99,
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    platformConnectionId: '3', // eBay connection
    externalOrderId: 'EBAY-789',
    orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'shipped',
    totalAmount: 75.98,
    items: [
      {
        id: 'item3',
        productId: 'p3',
        variantId: 'v3',
        quantity: 2,
        price: 37.99,
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockOrders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch orders'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedOrder: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
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
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setOrders,
  setSelectedOrder,
  addOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer; 