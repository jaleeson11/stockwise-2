import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const Settings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: false,
    lowStockAlerts: true,
    orderNotifications: true,
    syncNotifications: true,
  });

  const handleChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked,
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Stack spacing={3}>
        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Notifications"
                secondary="Configure your notification preferences"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <Stack spacing={2} sx={{ width: '100%', py: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleChange('pushNotifications')}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.lowStockAlerts}
                      onChange={handleChange('lowStockAlerts')}
                    />
                  }
                  label="Low Stock Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.orderNotifications}
                      onChange={handleChange('orderNotifications')}
                    />
                  }
                  label="Order Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.syncNotifications}
                      onChange={handleChange('syncNotifications')}
                    />
                  }
                  label="Sync Status Notifications"
                />
              </Stack>
            </ListItem>
          </List>
        </Paper>

        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="User Management"
                secondary="Manage user accounts and permissions"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="Security"
                secondary="Configure security settings and API keys"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText
                primary="Regional Settings"
                secondary="Configure timezone and currency preferences"
              />
            </ListItem>
          </List>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Settings; 