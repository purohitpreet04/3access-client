import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const useConfirmModal = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [resolvePromise, setResolvePromise] = useState(null);

  const confirm = (message, customOptions = {}) => {
    return new Promise((resolve) => {
      setOptions({ message, ...customOptions });
      setResolvePromise(() => resolve);
      setOpen(true);
    });
  };

  const handleClose = (result) => {
    if (resolvePromise) resolvePromise(result);
    setOpen(false);
  };

  const ConfirmModal = () => (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>{options.title || 'Confirm'}</DialogTitle>
      <DialogContent>
        <Typography>{options.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose(false)}
          color="secondary"
          variant="outlined"
        >
          {options.cancelText || 'Cancel'}
        </Button>
        <Button
          onClick={() => handleClose(true)}
          color="primary"
          variant="contained"
        >
          {options.confirmText || 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { confirm, ConfirmModal };
};

export default useConfirmModal;
