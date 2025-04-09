import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { createVariant } from '../../store/slices/variantSlice';

interface VariantFormProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

interface VariantFormData {
  sku: string;
  attributes: Record<string, string>;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
  };
}

const VariantForm: React.FC<VariantFormProps> = ({ open, onClose, productId, productName }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<VariantFormData>({
    sku: '',
    attributes: {},
    inventory: {
      quantity: 0,
      lowStockThreshold: 0,
    },
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    try {
      await dispatch(createVariant({ productId, variantData: formData })).unwrap();
      handleClose();
    } catch (error: any) {
      if (error.errors) {
        setValidationErrors(error.errors);
      } else {
        setError(error.message || 'Failed to create variant');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      sku: '',
      attributes: {},
      inventory: {
        quantity: 0,
        lowStockThreshold: 0,
      },
    });
    setValidationErrors({});
    setError(null);
    onClose();
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }));
    // Clear validation error for the attribute when it's changed
    setValidationErrors(prev => ({
      ...prev,
      [`attributes.${key}`]: undefined,
    }));
  };

  const handleInventoryChange = (field: keyof VariantFormData['inventory'], value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [field]: numValue,
      },
    }));
    // Clear validation error for the inventory field when it's changed
    setValidationErrors(prev => ({
      ...prev,
      [`inventory.${field}`]: undefined,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Variant for {productName}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, sku: e.target.value }));
                  setValidationErrors(prev => ({ ...prev, sku: undefined }));
                }}
                error={!!validationErrors.sku}
                helperText={validationErrors.sku}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attributes
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Size"
                  value={formData.attributes.size || ''}
                  onChange={(e) => handleAttributeChange('size', e.target.value)}
                  error={!!validationErrors['attributes.size']}
                  helperText={validationErrors['attributes.size']}
                />
                <TextField
                  label="Color"
                  value={formData.attributes.color || ''}
                  onChange={(e) => handleAttributeChange('color', e.target.value)}
                  error={!!validationErrors['attributes.color']}
                  helperText={validationErrors['attributes.color']}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Inventory
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={formData.inventory.quantity}
                    onChange={(e) => handleInventoryChange('quantity', e.target.value)}
                    error={!!validationErrors['inventory.quantity']}
                    helperText={validationErrors['inventory.quantity']}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Low Stock Threshold"
                    type="number"
                    value={formData.inventory.lowStockThreshold}
                    onChange={(e) => handleInventoryChange('lowStockThreshold', e.target.value)}
                    error={!!validationErrors['inventory.lowStockThreshold']}
                    helperText={validationErrors['inventory.lowStockThreshold']}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Variant
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VariantForm; 