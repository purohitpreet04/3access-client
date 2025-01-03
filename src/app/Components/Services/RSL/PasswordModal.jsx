import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordModal = ({ open, handleClose, deleteProperty }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const deleteId = query.get('delete'); // Replace 'paramName' with the actual parameter name you want to retrieve
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = () => {
        // Handle password submission logic here
        if (password === '') {
            dispatch(showSnackbar({ message: 'Please enter password', severity: 'error' }))
            return
        }
        deleteProperty(deleteId, password);
        // handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter your password to proceed.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => { setShowPassword(!showPassword) }} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordModal;