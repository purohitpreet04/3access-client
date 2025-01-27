// src/components/CustomSnackbar.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { hideSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
const CustomSnackbar = ({ children }) => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snack);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  useEffect(() => {
    if (open) {
      enqueueSnackbar(message, { variant: severity });
    }
  }, [open])



  const handleClick = () => enqueueSnackbar('I love snacks.');
  return (
    <SnackbarProvider 
    maxSnack={5}
      
    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    action={(key) => (
      <IconButton size="small" onClick={() => SnackbarProvider.closeSnackbar(key)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    )}
    >
      {children}
    </SnackbarProvider>
    // <Snackbar
    //   open={open}
    //   autoHideDuration={3000}
    //   onClose={handleClose}
    //   anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    // >
    //   <Alert onClose={handleClose} severity={severity}  sx={{ width: '100%' }}>
    //     {message}
    //   </Alert>
    // </Snackbar>
  );
};

export default CustomSnackbar;
