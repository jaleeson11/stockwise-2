import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import MainLayout from './components/layout/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './routes';
import { CircularProgress, Box } from '@mui/material';
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import Integrations from './features/integrations/Integrations';
import Orders from './features/orders/Orders';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import Categories from './features/categories/Categories';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <MainLayout>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
