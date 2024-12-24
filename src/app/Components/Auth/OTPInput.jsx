import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Grid,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import API from 'Constance';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';

const RegisterRoot = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url('/assets/images/logos/bg-1.jpeg')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    maxWidth: 400,
    width: '90%',
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
}));

const MUIOptInput = () => {
    const { id, token } = useParams();
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', or 'error'
    const dispatch = useDispatch();

    useEffect(() => {
        if (id && token) {
            verifyUserBylink(id, token);
        }
    }, [id, token]);

    const verifyUserBylink = async (id, token) => {
        try {
            setLoading(true);
            const res = await API.get('/api/auth/verify-user', { params: { token, _id: id } });
            if (res.data.isVerified) {
                setVerificationStatus('success');
                dispatch(showSnackbar({ message: res?.data?.message, severity:  res?.data?.severity }));
            } else {
                setVerificationStatus('error');
                dispatch(showSnackbar({ message: 'Verification failed!', severity: 'error' }));
            }
        } catch (error) {
            setVerificationStatus('error');
            dispatch(showSnackbar({ message: error?.response?.data?.message || 'Error while verifying user!', severity: 'error' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterRoot>
            <DynamicTitle title='User Varification' />
            <StyledPaper>
                {loading ? (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress />
                        <Typography variant="h6" mt={2}>
                            Verifying your account...
                        </Typography>
                    </Box>
                ) : verificationStatus === 'success' ? (
                    <Box>
                        <Typography variant="h4" color="primary">
                            Account Verified Successfully!
                        </Typography>
                        <Typography variant="body1" mt={2}>
                            You can now log in to your account.
                        </Typography>
                        <Button

                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            <Link to="/auth/login">
                                Go to Login
                            </Link>
                        </Button>
                    </Box>
                ) : verificationStatus === 'error' ? (
                    <Box>
                        <Typography variant="h4" color="error">
                            Verification Failed
                        </Typography>
                        <Typography variant="body1" mt={2}>
                            There was an issue verifying your account. Please try again or contact support.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => verifyUserBylink(id, token)}
                            sx={{ mt: 2 }}
                        >
                            Retry Verification
                        </Button>
                    </Box>
                ) : (
                    <Typography variant="h6">
                        Awaiting verification process...
                    </Typography>
                )}
            </StyledPaper>
        </RegisterRoot>
    );
};

export default MUIOptInput;
