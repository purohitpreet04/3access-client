import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Typography } from '@mui/material';

const OccupiedRoomModal = ({ open, handleClose, message }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon color="info" sx={{ fontSize: 30 }} />
            <Typography variant="h6" component="div">
              Occupied Room
            </Typography>
          </Box>
        </DialogTitle>
  
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText variant="body1" color="text.secondary" sx={{ mt: 1, fontSize:20 }}>
            {message}
          </DialogContentText>
        </DialogContent>
  
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="contained" color="primary" size="large">
            OK!
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default OccupiedRoomModal;