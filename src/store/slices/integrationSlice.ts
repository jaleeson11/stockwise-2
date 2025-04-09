import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PlatformConnection {
  id: string;
  userId: string;
  platformType: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  createdAt: string;
}

interface IntegrationState {
  connections: PlatformConnection[];
  selectedConnection: PlatformConnection | null;
  loading: boolean;
  error: string | null;
}

const initialState: IntegrationState = {
  connections: [],
  selectedConnection: null,
  loading: false,
  error: null,
};

// Mock data for integrations
const mockIntegrations: PlatformConnection[] = [
  {
    id: '1',
    userId: 'user1',
    platformType: 'shopify',
    status: 'connected',
    lastSync: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    platformType: 'amazon',
    status: 'disconnected',
    lastSync: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    platformType: 'ebay',
    status: 'error',
    lastSync: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    createdAt: new Date().toISOString(),
  },
];

// Async thunk for fetching integrations
export const fetchIntegrations = createAsyncThunk(
  'integrations/fetchIntegrations',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return mockIntegrations;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to fetch integrations'
      );
    }
  }
);

// Async thunk for syncing a platform
export const syncPlatform = createAsyncThunk(
  'integrations/syncPlatform',
  async (platformId: string, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find the platform in mock data
      const platform = mockIntegrations.find(p => p.id === platformId);
      if (!platform) {
        throw new Error('Platform not found');
      }
      
      // Update last sync time
      platform.lastSync = new Date().toISOString();
      platform.status = 'connected';
      
      return platform;
    } catch (error) {
      console.error('Error syncing platform:', error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : 'Failed to sync platform'
      );
    }
  }
);

const integrationSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<PlatformConnection[]>) => {
      state.connections = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedConnection: (state, action: PayloadAction<PlatformConnection>) => {
      state.selectedConnection = action.payload;
    },
    addConnection: (state, action: PayloadAction<PlatformConnection>) => {
      state.connections.push(action.payload);
    },
    updateConnection: (state, action: PayloadAction<PlatformConnection>) => {
      const index = state.connections.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.connections[index] = action.payload;
      }
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(c => c.id !== action.payload);
    },
    updateConnectionStatus: (state, action: PayloadAction<{ id: string; status: 'connected' | 'disconnected' | 'error' }>) => {
      const connection = state.connections.find(c => c.id === action.payload.id);
      if (connection) {
        connection.status = action.payload.status;
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
      .addCase(fetchIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
        state.error = null;
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(syncPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncPlatform.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.connections.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(syncPlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setConnections,
  setSelectedConnection,
  addConnection,
  updateConnection,
  removeConnection,
  updateConnectionStatus,
  setLoading,
  setError,
} = integrationSlice.actions;

export default integrationSlice.reducer; 