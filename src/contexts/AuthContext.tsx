import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/auth';
import { 
  loginSuccess, 
  logout, 
  refreshTokenSuccess, 
  refreshTokenFailure 
} from '../store/slices/authSlice';
import { RootState } from '../store';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const handleTokenRefresh = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(storedRefreshToken);
      
      // Update Redux state
      dispatch(refreshTokenSuccess({
        token: response.accessToken
      }));
      
      // Store new access token
      localStorage.setItem('accessToken', response.accessToken);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      dispatch(refreshTokenFailure());
      return false;
    }
  };

  useEffect(() => {
    // Check for existing tokens and validate them
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        
        if (!accessToken || !refreshToken || !userStr) {
          // If any of the required items are missing, clear everything
          dispatch(logout());
          return;
        }

        try {
          const refreshSuccess = await handleTokenRefresh();
          if (!refreshSuccess) {
            dispatch(logout());
          }
        } catch (refreshError) {
          console.error('Token refresh failed during initialization:', refreshError);
          dispatch(logout());
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // Update Redux state
      dispatch(loginSuccess({
        user: response.user,
        token: response.accessToken
      }));
      
      // Store tokens and user data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register(email, password, name);
      
      // Update Redux state
      dispatch(loginSuccess({
        user: response.user,
        token: response.accessToken
      }));
      
      // Store tokens and user data
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const value = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
    refreshToken: handleTokenRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 