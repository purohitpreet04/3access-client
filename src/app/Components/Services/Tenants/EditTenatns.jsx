import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    MenuItem,
    Grid,
    Typography,
    IconButton
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { getDate } from '@app/Utils/utils';
import API from 'Constance';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const validationSchema = Yup.object({

    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    tenantContactNumber: Yup.string().required('Required'),
    dateOfBirth: Yup.date().required('Required'),
    nationalInsuranceNumber: Yup.string().required('Required'),

});

const EditTenantModal = ({ open, setOpen, editdata, setEditdata, refetch }) => {
    // const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); setEditdata({}) };
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const { user } = useSelector(state => state.auth)
    // console.log(editdata)
    const initialValues = { ...editdata };



    return (
        <>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Edit Tenants</Typography>
                        <IconButton onClick={() => handleClose()}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                        Please fill in the information below. The field labels marked with * are required input fields.
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            const modifyVal = { ...values }
                            // console.log(modifyVal)
                            // return
                            try {
                                dispatch(setIsLoading({ data: true }))
                                const res = await API.post('/api/tenents/addtenants', modifyVal)
                                if (res.data.success === true) {
                                    // resetForm()
                                    handleClose();
                                }
                                if (refetch) {
                                    refetch()
                                }
                                // navigation('/desh')
                                handleClose();
                                dispatch(setIsLoading({ data: false }))
                            } catch (error) {
                                console.log(error)
                                dispatch(setIsLoading({ data: false }))
                                dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add tenants details", severity: "error" }))
                            }
                        }}
                        enableReinitialize={true}
                    >
                        {({ errors, touched, values, handleSubmit, handleChange }) => (
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Field
                                            name="title_before_name"
                                            onChange={handleChange}
                                            as={TextField}
                                            select
                                            fullWidth
                                            value={values?.title_before_name}
                                            label="Title Before Name"
                                            variant="outlined"
                                        >
                                            <MenuItem value='Mr'>Mr.</MenuItem>
                                            <MenuItem value='Ms'>Ms.</MenuItem>
                                            <MenuItem value='Mrs'>Mrs.</MenuItem>
                                            <MenuItem value='Miss'>Miss.</MenuItem>
                                        </Field>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="tenantContactNumber"
                                            as={TextField}
                                            label="Tenant Contact Number *"
                                            fullWidth
                                            error={touched.tenantContactNumber && Boolean(errors.tenantContactNumber)}
                                            helperText={touched.tenantContactNumber && errors.tenantContactNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="firstName"
                                            as={TextField}
                                            label="First Name *"
                                            fullWidth
                                            error={touched.firstName && Boolean(errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="tenantEmail"
                                            as={TextField}
                                            label="Tenant Email"
                                            fullWidth
                                            value={values.tenantEmail}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="middleName"
                                            as={TextField}
                                            label="Middle Name"
                                            fullWidth
                                            value={values.middleName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="dateOfBirth"
                                            as={TextField}
                                            label="Date of Birth *"
                                            type="date"
                                            fullWidth
                                            value={values?.dateOfBirth ? new Date(values.dateOfBirth).toISOString().split('T')[0] : ''}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                                            helperText={touched.dateOfBirth && errors.dateOfBirth}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="lastName"
                                            as={TextField}
                                            label="Last Name *"
                                            fullWidth
                                            error={touched.lastName && Boolean(errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="nationalInsuranceNumber"
                                            as={TextField}
                                            label="National Insurance Number *"
                                            fullWidth
                                            error={touched.nationalInsuranceNumber && Boolean(errors.nationalInsuranceNumber)}
                                            helperText={touched.nationalInsuranceNumber && errors.nationalInsuranceNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="claimReferenceNumber"
                                            as={TextField}
                                            label="Claim Reference Number"
                                            fullWidth
                                            value={values.claimReferenceNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            onChange={handleChange}
                                            name="gender"
                                            as={TextField}
                                            label="Gender *"
                                            select
                                            fullWidth
                                            error={touched.gender && Boolean(errors.gender)}
                                            helperText={touched.gender && errors.gender}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Field>
                                    </Grid>
                                </Grid>
                                <Box mt={3} textAlign="right">
                                    <Button type="button" onClick={() => handleSubmit()} variant="contained" color="primary">
                                        Save & Submit
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Modal>
        </>
    );
};

export default EditTenantModal;