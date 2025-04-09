import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    cursor: 'pointer',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(135deg, #3B82F6 0%, #A78BFA 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', onClick }) => {
  const navigate = useNavigate();
  const handleClick = onClick || (() => navigate('/'));

  const iconSize = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem',
  };

  const textSize = {
    small: '1.25rem',
    medium: '1.5rem',
    large: '2rem',
  };

  return (
    <LogoContainer onClick={handleClick}>
      <InventoryIcon sx={{ fontSize: iconSize[size], color: 'primary.main' }} />
      <LogoText sx={{ fontSize: textSize[size] }}>StockWise</LogoText>
    </LogoContainer>
  );
};

export default Logo; 