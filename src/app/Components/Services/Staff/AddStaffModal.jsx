import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    Box,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    FormControlLabel,
    Checkbox,
    TableHead,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import debounce from "lodash/debounce";
import { FetchData, postData } from '@app/Utils/CustomHooks';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import { fetchProperties } from '@app/API/Property';
import PaginationTable from '@app/CommonComponents/TableComponent';
import { useLocation } from 'react-router-dom';
const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
];

const typeOptions = [
    { value: 'staff', label: 'Staff' },
    { value: 'agent', label: 'Agent' },
];







const AddStaffModal = ({ open, onClose, editData, refetch }) => {

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { properties } = useSelector(state => state.property)
    const [checked, setChecked] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    useEffect(() => {
        if (editData?._id && properties.length > 0) {
            const newPropertyPer = properties
                .filter(property => property?.visibleTo.includes(editData?._id))
                .map(property => property?._id);

            setAllChecked(newPropertyPer.length === properties.length);
            setChecked(newPropertyPer);
        }
    }, [editData, properties]);

    const initialValues = editData?._id ? {
        ...editData,
        Property_per: checked,
        allCheck: allChecked,
        // coruspondingEmail: user?.coruspondingEmail 
        coruspondingEmail: ['agent'].includes(user?.role) ? user?.coruspondingEmail : ['staff'].includes(user?.role) && user?.coruspondingEmail
    } : {
        jobTitle: '',
        fname: '',
        lname: '',
        phonenumber: '',
        gender: 'Male',
        username: '',
        email: '',
        password: '',
        companyEmail: user?.email,
        role: '',
        permission: [],
        Property_per: [],
        addedBy: user?._id,
        coruspondingEmail: ['agent'].includes(user?.role) ? user?.coruspondingEmail : ['staff'].includes(user?.role) && user?.coruspondingEmail,
        allCheck: false
    };


    const validationSchema = Yup.object({
        jobTitle: Yup.string().required('Job Title is required'),
        fname: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only letters are allowed').required('First Name is required'),
        lname: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only letters are allowed'),
        phonenumber: Yup.string().matches(/^[0-9]+$/, 'Must be only digits')
            .matches(
                /^(?:\+44|0)(?:\d\s?){10,11}$/,
                'Enter a valid phone number'
            ).required('Phone Number is Required'),
        gender: Yup.string(),
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email'),
        password: !editData._id && Yup.string().required('Password is required'),
        companyEmail: Yup.string().email('Invalid company email').required('Company Email is required'),
    });
    const permissions = [
        { lable: 'Can Add/Signup Properties', val: 1 },
        { lable: 'Can Signout Tenants', val: 2 },
        { lable: 'View Signout Tenants', val: 3 },
        { lable: 'View Tenant Details', val: 4 },
        { lable: 'View Active Tenants', val: 5 },
        { lable: 'View Profile', val: 6 },
        { lable: 'Add/Signup Tenant', val: 7 },
        // { lable: 'Add new Staff', val: 8 },
    ];


    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        try {
            dispatch(fetchProperties({ user, page: 1, searchQuery: '', roleFilter: '' }))
        } catch (error) {
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }

    const transitionStyle = {
        transition: 'all 0.5s ease-in-out',
        transform: open ? 'translateY(0)' : 'translateY(20px)',
        opacity: open ? 1 : 0,
    };

    return (
        <>
            <Dialog open={open} TransitionProps={transitionStyle} onClose={onClose} fullWidth fullScreen maxWidth="md">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {editData?._id ? "Edit Staff Details" : "Add New Staff"}
                        </Typography>
                        <IconButton edge="end" color="inherit" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={debounce(async (values, { resetForm }) => {

                        const modifyVal = {
                            ...values,
                            Property_per: !values?.Property_per ? [] : values?.Property_per,
                            permission: !values?.permission ? [] : values?.permission,
                        }

                        try {
                            dispatch(setIsLoading({ data: true }))
                            const res = await API.post('/api/staff/addnewstaff', modifyVal)
                            if (res.data.success == true) {
                                onClose()
                                resetForm()
                                if (refetch) {
                                    refetch()
                                }
                            }
                            dispatch(setIsLoading({ data: false }))
                        } catch (error) {
                            dispatch(setIsLoading({ data: false }))
                            dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add new staff details", severity: "error" }))
                        }
                    }, 500)}
                >

                    {({ errors, touched, handleChange, handleSubmit, resetForm, values, setValues, setFieldValue }) => {
                        const handlePropertyCheck = (e) => {
                            const { checked } = e.target
                            if (checked) {
                                let idArray = []
                                properties.map((pro) => {
                                    idArray.push(pro?._id)
                                })
                                setValues((pre) => ({ ...pre, ['Property_per']: [...idArray], allCheck: true }))
                            } else {
                                setValues((pre) => ({ ...pre, ['Property_per']: [], allCheck: false }))
                            }
                        }
                        return (
                            <Form>

                                <DialogContent>
                                    <Grid container spacing={2}>
                                        {/* Left Column */}
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Job Title"
                                                name="jobTitle"
                                                onChange={handleChange}
                                                error={touched.jobTitle && Boolean(errors.jobTitle)}
                                                helperText={touched.jobTitle && errors.jobTitle}
                                                margin="normal"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="First Name"
                                                name="fname"
                                                onChange={handleChange}
                                                error={touched.fname && Boolean(errors.fname)}
                                                helperText={touched.fname && errors.fname}
                                                margin="normal"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Last Name"
                                                name="lname"
                                                onChange={handleChange}
                                                error={touched.lname && Boolean(errors.lname)}
                                                helperText={touched.lname && errors.lname}
                                                margin="normal"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Phone"
                                                name="phonenumber"
                                                onChange={handleChange}
                                                error={touched.phonenumber && Boolean(errors.phonenumber)}
                                                helperText={touched.phonenumber && errors.phonenumber}
                                                margin="normal"
                                                type="tel"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                select
                                                label="Gender"
                                                name="gender"
                                                onChange={handleChange}
                                                error={touched.gender && Boolean(errors.gender)}
                                                helperText={touched.gender && errors.gender}
                                                margin="normal"
                                            >
                                                {genderOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </Grid>
                                        {/* Right Column */}
                                        <Grid item xs={12} sm={6}>
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Username"
                                                name="username"
                                                onChange={handleChange}
                                                error={touched.username && Boolean(errors.username)}
                                                helperText={touched.username && errors.username}
                                                margin="normal"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                onChange={handleChange}
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                                margin="normal"
                                                type="email"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                disabled
                                                label="Corusponding Email"
                                                name="coruspondingEmail"
                                                onChange={handleChange}
                                                error={touched.coruspondingEmail && Boolean(errors.coruspondingEmail)}
                                                helperText={touched.coruspondingEmail && errors.coruspondingEmail}
                                                margin="normal"
                                                type="email"
                                            />
                                            <Field
                                                as={TextField}
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                onChange={handleChange}
                                                error={touched.password && Boolean(errors.password)}
                                                helperText={touched.password && errors.password}
                                                margin="normal"
                                                type="password"
                                            />
                                            {['company'].includes(user?.role) && <Field
                                                as={TextField}
                                                fullWidth
                                                disabled
                                                label="RSL Email"
                                                name="companyEmail"
                                                onChange={handleChange}
                                                error={touched.companyEmail && Boolean(errors.companyEmail)}
                                                helperText={touched.companyEmail && errors.companyEmail}
                                                margin="normal"
                                                type="email"
                                            />}

                                            <Field
                                                as={TextField}
                                                fullWidth
                                                select
                                                label="Type"
                                                name="role"

                                                onChange={handleChange}
                                                error={touched.role && Boolean(errors.role)}
                                                helperText={touched.role && errors.role}
                                                margin="normal"
                                            >
                                                <MenuItem value='staff'>
                                                    Staff
                                                </MenuItem>
                                                {user.role !== 'agent' && <MenuItem value='company-agent'>
                                                    Agent
                                                </MenuItem>}

                                            </Field>

                                        </Grid>
                                        {['agent'].includes(user?.role) &&
                                        <Box p={3}>
                                            <Box mb={3}>
                                                <Typography variant="h6">Allowed Permissions</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Please allow permissions to the user.
                                                </Typography>
                                            </Box>

                                            <TableContainer component={Paper}>

                                                <Table>
                                                    <TableBody>
                                                        {permissions.map((permission, index) => (
                                                            <TableRow key={index} sx={{ backgroundColor: '#eaf3fa' }}>
                                                                <TableCell padding='3'>
                                                                    <Typography fontWeight={'bold'} paddingLeft={3}>{permission.lable}</Typography>
                                                                </TableCell>
                                                                <TableCell padding='2' align="center">
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Field
                                                                                as={Checkbox}
                                                                                name={`permissions${permission?.val}`}
                                                                                // value={permission?.val}
                                                                                checked={values?.permission?.includes(permission?.val)}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setValues((pre) => ({ ...pre, ['permission']: [...values.permission, permission.val] }))
                                                                                        // setFieldValue('permissions', [...values.permissions, permission.val]);
                                                                                    } else {

                                                                                        setValues((pre) => ({ ...pre, ['permission']: [...values.permission.filter((p) => p !== permission.val)] }))

                                                                                    }
                                                                                }}
                                                                            />
                                                                        }
                                                                        label=""
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>}

                                        { ['agent'].includes(user?.role) && <Box p={3}>
                                            <Box mb={3}>
                                                <Typography variant="h6">Allowed Properties</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Please check properties which you want to allow that user.
                                                </Typography>
                                            </Box>

                                            <TableContainer component={Paper}>

                                                <Table>
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#eaf3fa' }}>
                                                            <TableCell padding="2" align='center'>


                                                                <FormControlLabel
                                                                    control={
                                                                        <Field
                                                                            as={Checkbox}
                                                                            name='allCheck'
                                                                            checked={values?.allCheck}
                                                                            onChange={(e) => {
                                                                                handleChange(e)
                                                                                handlePropertyCheck(e)
                                                                            }}
                                                                        />
                                                                    }
                                                                    label=""
                                                                />

                                                            </TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>RSL Type Group</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>RSI Type Group</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Address Line 1</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Area</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Post Code</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {properties.map((permission, index) => {

                                                            return (
                                                                <TableRow key={index} >
                                                                    <TableCell padding='2' align="center">
                                                                        <input
                                                                            id={`permissions_${permission?._id}`}
                                                                            type="checkbox"
                                                                            checked={values?.Property_per?.includes(permission?._id)}
                                                                            onChange={(e) => {
                                                                                handleChange(e)
                                                                                const willBeChecked = e.target.checked;
                                                                                const newPropertyPer = willBeChecked
                                                                                    ? [...values.Property_per, permission._id]
                                                                                    : values.Property_per.filter((p) => p !== permission._id);

                                                                                const allSelected = newPropertyPer.length === properties.length;

                                                                                setValues((pre) => ({
                                                                                    ...pre,
                                                                                    Property_per: newPropertyPer,
                                                                                    allCheck: allSelected
                                                                                }))
                                                                            }}
                                                                            name={`permissions_${permission?._id}`}
                                                                            style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                                                        />

                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        { }
                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        {permission?.rslTypeGroup}
                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        {permission?.address}
                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        {permission?.area}
                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        {permission?.city}
                                                                    </TableCell>
                                                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                                                        {permission?.postCode}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>}
                                    </Grid>
                                </DialogContent>
                                <DialogActions >
                                    <Box p={3}>

                                        <Button onClick={onClose} color="secondary">
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={() => handleSubmit()} variant="contained" color="primary">
                                            Submit
                                        </Button>
                                    </Box>
                                </DialogActions>
                            </Form>
                        )
                    }}
                </Formik>
            </Dialog>
        </>

    );
};

export default AddStaffModal;
