// src/components/CustomSnackbar.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';


const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snack);
    
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Alert onClose={handleClose} severity={severity}  sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
