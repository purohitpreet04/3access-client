import { AppBar, Box, Button, Dialog, Grid, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';
import { getAllRSL } from '@app/API/SideBarData';
import TextEditor from '@app/CommonComponents/TextEditor';
import TemplateList from './TamplateList';
import When from '@app/CommonComponents/When';
import { SettingEmails } from '..';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddRsl = ({ open, onClose }) => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    const registerSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        companyname: Yup.string().required('Company name is required'),
        address: Yup.string().required('Address Line 1 is required'),
        city: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'City cannot contain numbers or special characters')
            .required('City is required'),
        pincode: Yup.string()
            .required('Postcode is required')
            .test(
                'exact-length',
                'Postcode must have exactly 6 characters (excluding spaces)',
                (value) => {
                    if (!value) return false;
                    const trimmedValue = value.replace(/\s+/g, '');
                    return trimmedValue.length === 6;
                }
            ),
        website: Yup.string()
            .matches(urlRegex, 'Enter a valid URL, e.g., https://example.com'),
        phonenumber: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .matches(
                /^(?:\+44|0)(?:\d\s?){9,10}$/,
                'Enter a valid UK phone number'),
        fname: Yup.string()
            .matches(/^[A-Za-z]+$/, 'First name can only contain letters')
            .min(2, 'First name must be at least 2 characters')
            .max(30, 'First name cannot exceed 30 characters'),
        // .required('First name is required'),
        lname: Yup.string()
            .matches(/^[A-Za-z]+$/, 'Last name can only contain letters')
            .min(2, 'Last name must be at least 2 characters')
            .max(30, 'Last name cannot exceed 30 characters'),
        // .required('Last name is required'),
    });


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rslId = queryParams.get('rsl');

    const [showPassword, setShowPassword] = useState(false)
    const [editData, setEditData] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        if (rslId) {
            FetchRsldetails(rslId)
        }
    }, [rslId])




    const FetchRsldetails = async (id) => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/rsl/get-rsl-details', { params: { _id: id } })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            // console.log(res?.data?.data)
            setEditData({ ...res?.data?.data })
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(showSnackbar({ message: error.response?.data?.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }





    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { ...editData },
        validationSchema: registerSchema,
        onSubmit: async (value, { resetForm }) => {
            try {
                dispatch(setIsLoading({ data: true }))

                const formdata = new FormData()
                formdata.append('addedBy', user?._id)
                Object.entries(values).forEach(([key, value]) => {
                    formdata.append(key, value);
                });
                // const res = await API.post('/api/rsl/register-rsl', { ...value, addedBy: user?._id })
                const res = await API.post('/api/rsl/register-rsl', formdata)
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
                }
                dispatch(setIsLoading({ data: false }))
                resetForm()
                dispatch(getAllRSL({ id: user?._id }))
                navigate("/services/listrsl")
            } catch (error) {
                console.log(error)
                dispatch(showSnackbar({ message: error.response?.data?.error || 'Error while Add new RSL!', severity: 'error' }))
                dispatch(setIsLoading({ data: false }))
            }
        }

    })
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const { values, setValues, handleChange, setFieldValue, errors, setErrors, touched, handleSubmit } = formik

    if (rslId && !editData?._id) {
        return (
            <></>
        )
    } else {
        return (
            <>
                <DynamicTitle title='Add New RSL' />
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { navigate(-1) }} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                </Toolbar>
                <Box
                    sx={{
                        width: '100%',
                        backgroundColor: 'trasperant',
                        px: 3,
                        pb: 3,
                        display: 'flex',
                        gap: 3
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: '850px',
                            width: '100%',
                            maxWidth: '600px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            p: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h6">RSL  Details</Typography>
                        </Box>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>

                                    {editData?._id && typeof values?.image === 'string' ?
                                        (
                                            <img
                                                loading='lazy'
                                                src={values?.image}
                                                alt="preview"
                                                style={{ maxWidth: '100%', maxHeight: 200 }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    border: '2px dashed #ccc',
                                                    borderRadius: 1,
                                                    p: 2,
                                                    textAlign: 'center',
                                                    bgcolor: editData?._id ? '#f5f5f5' : 'background.paper',
                                                    cursor: editData?._id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <Box>
                                                    {values?.image && (
                                                        <img
                                                            src={URL.createObjectURL(values?.image)}
                                                            alt="preview"
                                                            style={{ maxWidth: '100%', maxHeight: 200 }}
                                                        />
                                                    )}
                                                    <input
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        id={`file-upload-logo`}
                                                        type="file"
                                                        name='image'
                                                        onChange={(e) => { console.log(); setFieldValue('image', e.target.files[0]) }}
                                                    // disabled={disabled}
                                                    />
                                                    <label htmlFor={`file-upload-logo`}>
                                                        <Button
                                                            component="span"
                                                            startIcon={<CloudUploadIcon />}
                                                        // disabled={disabled}
                                                        >
                                                            'Upload RSL logo'
                                                        </Button>
                                                    </label>
                                                </Box>

                                            </Box>
                                            
                                        )
                                    }

                                </Grid>
                                {/* Company Name */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="RSL Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={values.companyname}
                                        name="companyname"
                                        onChange={handleChange}
                                        error={touched.companyname && Boolean(errors.companyname)}
                                        helperText={touched.companyname && errors.companyname}
                                    />
                                </Grid>

                                {/* First Name and Last Name */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        name="fname"
                                        value={values.fname}
                                        onChange={handleChange}
                                        error={touched.fname && Boolean(errors.fname)}
                                        helperText={touched.fname && errors.fname}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.lname}
                                        type="text"
                                        name="lname"
                                        onChange={handleChange}
                                        error={touched.lname && Boolean(errors.lname)}
                                        helperText={touched.lname && errors.lname}
                                    />
                                </Grid>

                                {/* Email and Password */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Phone Number"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        // required
                                        value={values.phonenumber}
                                        name="phonenumber"
                                        onChange={handleChange}
                                        error={touched.phonenumber && Boolean(errors.phonenumber)}
                                        helperText={touched.phonenumber && errors.phonenumber}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Address Line 1"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={values.address}
                                        type="text"
                                        name="address"
                                        onChange={handleChange}
                                        error={touched.address && Boolean(errors.address)}
                                        helperText={touched.address && errors.address}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Area"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.area}
                                        type="text"
                                        name="area"
                                        onChange={handleChange}
                                        error={touched.area && Boolean(errors.area)}
                                        helperText={touched.area && errors.area}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="City"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        type="text"
                                        value={values.city}
                                        name="city"
                                        onChange={handleChange}
                                        error={touched.city && Boolean(errors.city)}
                                        helperText={touched.city && errors.city}
                                    />
                                </Grid>

                                {/* Post Code and Website */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Post Code"
                                        variant="outlined"
                                        fullWidth
                                        value={values.pincode}
                                        margin="normal"
                                        required
                                        name="pincode"
                                        onChange={handleChange}
                                        error={touched.pincode && Boolean(errors.pincode)}
                                        helperText={touched.pincode && errors.pincode}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Website"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.website}
                                        type="text"
                                        name="website"
                                        onChange={handleChange}
                                        error={touched.website && Boolean(errors.website)}
                                        helperText={touched.website && errors.website}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 3, py: 2, fontWeight: 'bold' }}
                                        onClick={() => { handleSubmit() }}
                                    >
                                        <Typography>{editData?._id ? "Update RSL" : "Create RSL"}</Typography>
                                    </Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Box>
                    <When when={rslId} component={
                        <Box
                            sx={{
                                width: '100%',
                                // maxWidth: '600px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #ccc', // Add border
                                borderRadius: '8px', // Optional: Add rounded corners
                                p: 2, // Optional: Add padding for better spacing
                            }}
                        >
                            <TemplateList />
                        </Box>
                    }
                    />
                </Box>
                <Box>
                    <SettingEmails />
                </Box>

            </>
        )
    }




}

export default AddRsl