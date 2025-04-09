import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar: React.FC = () => {
  return (
    <TextField
      size="small"
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        width: 300,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default SearchBar; 