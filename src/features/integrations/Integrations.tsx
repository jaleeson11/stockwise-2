import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Sync as SyncIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchIntegrations, syncPlatform } from '../../store/slices/integrationSlice';
import { RootState } from '../../store/store';

const Integrations: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connections, loading, error } = useAppSelector((state: RootState) => state.integrations);

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  const handleSync = (platformId: string) => {
    dispatch(syncPlatform(platformId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPlatformName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading && connections.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Integrations
      </Typography>

      <Grid container spacing={3}>
        {connections.map((platform) => (
          <Grid item xs={12} md={4} key={platform.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{formatPlatformName(platform.platformType)}</Typography>
                  <Chip
                    label={platform.status}
                    color={getStatusColor(platform.status)}
                    size="small"
                  />
                </Box>

                {platform.lastSync && (
                  <Typography variant="body2" color="text.secondary">
                    Last synced: {new Date(platform.lastSync).toLocaleString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                  {platform.status === 'connected' ? (
                    <>
                      <Button
                        startIcon={<SyncIcon />}
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => handleSync(platform.id)}
                      >
                        Sync Now
                      </Button>
                      <Button
                        startIcon={<SettingsIcon />}
                        variant="outlined"
                        size="small"
                      >
                        Settings
                      </Button>
                    </>
                  ) : (
                    <Button
                      startIcon={<LinkIcon />}
                      variant="contained"
                      size="small"
                      fullWidth
                    >
                      Connect
                    </Button>
                  )}
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Integrations; 