import React from 'react';
import { CircularProgress, Backdrop, Box } from '@mui/material';
import { styled } from '@mui/system';

const Overlay = styled(Backdrop)(({ theme }) => ({
  color: '#fff',
  zIndex: theme.zIndex.drawer + 999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LoadingOverlay = ({ loading, children }) => {
  return (
    <Box position="relative">
      {children}
      <Overlay open={loading}>
        <CircularProgress color="inherit" />
      </Overlay>
    </Box>
  );
};

export default LoadingOverlay;
