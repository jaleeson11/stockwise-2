import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import productReducer from './slices/productSlice';
import integrationReducer from './slices/integrationSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import variantReducer from './slices/variantSlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    products: productReducer,
    categories: categoryReducer,
    variants: variantReducer,
    integrations: integrationReducer,
    orders: orderReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 