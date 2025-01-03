
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { signOutTenant } from '@app/API/Tenant';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from '@app/CommonComponents/SignatureCanvas';
import moment from 'moment';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';

const SignOutModal = ({ open, data, handleClose, refetch }) => {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            isPresent: false,
            signOutDate: new Date().toISOString().split('T')[0],
        },
        validate: (values) => {
            const errors = {};
            if (!values.signature && values.isPresent === true) {
                errors.signature = 'Required';
                dispatch(showSnackbar({ message: 'Signature is required', severity: 'error' }));
            }
            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            dispatch(
                signOutTenant({
                    ...data,
                    isPresent: values?.isPresent,
                    withOutMail: values?.withOutMail,
                    signOutDate: moment(values?.signOutDate).toISOString(),
                    signature: values?.signature,
                    navigate: navigation,
                })

            ).then(() => {
                refetch(); // Trigger a refresh of tenant data
                resetForm();
            });
            handleClose();
            // Add logic to sign out the user
        },
    });


    const { values, setFieldValue, handleChange, errors, handleSubmit, resetForm } = formik;


    const handleSignOut = (withOutMail) => {

    }

    return (
        <Dialog
            open={open}
            onClose={() => { handleClose(); resetForm(); }}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            <DialogTitle id="dialog-title" align='center'>Sign Out</DialogTitle>
            <DialogContent>

                <Typography variant="body2" align='center' sx={{ px: 2 }}>Please enter Signout date</Typography>
                <Box p={2}>
                    <TextField
                        name="signOutDate"
                        // label="Sign Out Date"
                        type="date"
                        fullWidth
                        value={values?.signOutDate || new Date().toISOString().split('T')[0]}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={errors && errors.signOutDate}
                        helperText={errors.signOutDate}
                        inputProps={{
                            // min: minDate,
                            max: new Date().toISOString().split('T')[0], // Prevent future dates
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={values.isPresent}
                                onChange={(e) => {
                                    setFieldValue(`isPresent`, e.target.checked);
                                    if (!e.target.checked) {
                                        setFieldValue('isPresent', false);
                                    }
                                }}
                                name="isPresent"
                                color="primary"
                            />
                        }
                        label="Tenant present? (If Yes, Signature will be required)"
                    />
                    {values.isPresent && (
                        <SignatureCanvas
                            // errors={errors}
                            name='signature'
                            setFieldValue={setFieldValue}
                            onSave={(sign) => setFieldValue("signature", sign)}
                            value={values.signature}
                        />
                    )
                    }
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => { handleClose(); resetForm(); }} sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button onClick={() => { setFieldValue('withOutMail', false); handleSubmit() }} variant="contained" color="primary">
                    Sign Out
                </Button>
                <Button onClick={() => { setFieldValue('withOutMail', true); handleSubmit() }} variant="contained" color="warning">
                    Sign Out Without Mail
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignOutModal;
