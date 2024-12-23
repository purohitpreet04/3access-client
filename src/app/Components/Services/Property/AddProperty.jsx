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
    FormControlLabel,
    Checkbox,
    Icon,
} from '@mui/material'
import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, values } from 'lodash';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import * as Yup from 'yup';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setPropertyData } from '@app/Redux/Sclice/MultiSelectSlice';
import { getAllRSL } from '@app/API/SideBarData';
function AddProperty({ open, onClose, editData }) {

    const dispatch = useDispatch()
    const navigator = useNavigate()
    const { user } = useSelector(state => state.auth)
    const { selectedValues, comData, propertydata, data } = useSelector(state => state.sideselect)
    // console.log(comData)
    useEffect(() => {
        if (user?._id) {
            fetchrsldata()
        }
    }, [])
    
    const fetchrsldata = async () => {
        dispatch(getAllRSL({ user: user, isMainMa: user?.isMainMA }))
    };



    const initialValues = propertydata?._id ? propertydata : {
        councilTaxPayer: '',
        rslTypeGroup: !['company', 'agent'].includes(user?.role) ? comData.find((item) => item._id === user?.addedBy?._id)?._id : comData.find((item) => item._id == user?._id)?._id,
        address: '',
        bedrooms: '',
        area: '',
        city: '',
        postCode: '',
        basicRent: '',
        serviceCharges: '',
        eligibleRent: 0,
        ineligibleCharge: '',
        sharedWithOther: 'No',
        otherInformation: false,
        bedist: "No",
        selfContainedFlat: "Yes",
        quantityOfFloors: "",
        unfurnished: "No",
        partFurnished: "No",
        fullyFurnished: "Yes",
        centralHeating: "Yes",
        garden: "Yes",
        garageParkingSpace: "Yes",
        accommodationLocation: "",
        accommodationFloor: "",

        totalLivingRooms: {
            communal: 0,
            yourUse: ''
        },
        totalBedsitRooms: {
            communal: 0,
            yourUse: ''
        },
        totalBedrooms: {
            communal: 0,
            yourUse: ''
        },
        totalBathrooms: {
            communal: 0,
            yourUse: ''
        },
        totalToilets: {
            communal: 0,
            yourUse: ''
        },
        totalKitchens: {
            communal: 0,
            yourUse: ''
        },
        totalOtherRooms: {
            communal: 0,
            yourUse: ''
        }
    };

    const otherFilds = [
        { name: 'totalLivingRooms', title: 'Total Living Room' },
        { name: 'totalBedsitRooms', title: 'Total Bedist Room' },
        { name: 'totalBedrooms', title: 'Total Bed Room' },
        { name: 'totalBathrooms', title: 'Total Bath Room' },
        { name: 'totalToilets', title: 'Total Toilet' },
        { name: 'totalKitchens', title: 'Total kichens' },
        { name: 'totalOtherRooms', title: 'Total Other Room' },
    ]

    const AddPropertySchema = Yup.object().shape({
        councilTaxPayer: Yup.string().required('Required'),
        // rslTypeGroup: Yup.string().required('Required'),
        address: Yup.string().max(100, 'Maximum 100 characters allowed').required('Required'),
        bedrooms: Yup.number().required('Required').positive().integer().max(8, 'Room must be less then 8'),
        area: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        postCode: Yup.string()
            .test(
                'exact-length',
                'Postcode must have exactly 6 characters (excluding spaces)',
                (value) => {
                    if (!value) return false; // Ensure value is present
                    const trimmedValue = value.replace(/\s+/g, ''); // Remove all spaces
                    return trimmedValue.length === 6; // Check length excluding spaces
                }
            )
            .required('Postcode is required'),
        basicRent: Yup.number().required('Required').positive().min(0, "can't be less then 0"),
        serviceCharges: Yup.number().required('Required').positive().min(0, "can't be less then 0"),
        eligibleRent: Yup.number().required('Required').positive().min(0, "can't be less then 0"),
        ineligibleCharge: Yup.number().required('Required').positive().min(0, "can't be less then 0"),
        sharedWithOther: Yup.string().required('Required'),

        selfContainedFlat: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Self Contained Flat is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        quantityOfFloors: Yup.number().integer().min(1, "Minimum 1 floor").when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Quantity of Floors is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        unfurnished: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Unfurnished is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        partFurnished: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Part Furnished is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        fullyFurnished: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Fully Furnished is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        centralHeating: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Central Heating is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        garden: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Garden is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        garageParkingSpace: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Garage/Parking Space is required"),
            otherwise: (schema) => schema.notRequired()
        }),
        accommodationLocation: Yup.string().when('otherInformation', {
            is: true,
            then: (schema) => schema.required("Accommodation Location is required"),
            otherwise: (schema) => schema.notRequired()
        }),


    });
    return (
        <>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { navigator(-1); dispatch(setPropertyData({})) }} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
                        {propertydata?._id ? "Edit Property Details" : "Add New Property"}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={AddPropertySchema}
                onSubmit={debounce(async (values, { resetForm }) => {

                    const modifyVal = { ...values, addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff", addedBy: user?._id }

                    try {
                        dispatch(setIsLoading({ data: true }))
                        const res = await API.post('/api/property/addnewproperty', modifyVal)
                        if (res.data.success == true) {
                            resetForm()
                            navigator("/services/property")
                        }
                        dispatch(setIsLoading({ data: false }))
                    } catch (error) {
                        dispatch(setIsLoading({ data: false }))
                        dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add new property details", severity: "error" }))
                    }
                }, 500)}
            >
                {({ errors, touched, handleChange, handleSubmit, resetForm, values, setFieldValue }) => {
                    const calculateTotalCharge = (type, val) => {
                        let basicrent = values?.basicRent || 0
                        let totalservicecharge = values?.serviceCharges || 0

                        if (type == 'br') {
                            basicrent = val
                        }
                        if (type == 'tsc') {
                            totalservicecharge = val
                        }
                        if (basicrent == ('' || 0) || totalservicecharge == ('' || 0)) {
                            setFieldValue('eligibleRent', 0)
                        }
                        let total = 0
                        total = parseInt(basicrent) + parseInt(totalservicecharge)
                        setFieldValue('eligibleRent', total.toFixed(2))
                    }


                    return (
                        <Form>
                            {/* <DialogContent style={{ padding: 30 }}> */}

                            <Grid p={4} container spacing={2} >
                                {/* Left Column */}
                                <Grid item xs={12} sm={9}>

                                    <Field
                                        as={TextField}
                                        select
                                        fullWidth
                                        label="Responsible for Paying Council Tax"
                                        name="councilTaxPayer"
                                        onChange={handleChange}
                                        value={values.councilTaxPayer}
                                        error={touched.councilTaxPayer && Boolean(errors.councilTaxPayer)}
                                        helperText={touched.councilTaxPayer && errors.councilTaxPayer}
                                        margin="normal"
                                        defualt='1'
                                    >
                                        <MenuItem value="1">RSL/Housing Provider</MenuItem>
                                        <MenuItem value="2">Tenant</MenuItem>
                                    </Field>
                                    {((['staff'].includes(user?.role) || ['company', 'company-agent'].includes(user?.role))) &&
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="RSL (Type/Group)"
                                            name="rslTypeGroup"
                                            onChange={handleChange}
                                            // disabled={true}
                                            value={values.rslTypeGroup}
                                            error={touched.rslTypeGroup && Boolean(errors.rslTypeGroup)}
                                            helperText={touched.rslTypeGroup && errors.rslTypeGroup}
                                            margin="normal"
                                        >
                                            {data.map((item) => (
                                                <MenuItem key={item?._id} value={item?._id}>{item?.lable}</MenuItem>
                                            ))}
                                        </Field>
                                    }
                                    {(['agent'].includes(user?.role) && [0].includes(user?.isMainMA)) &&
                                        // ((['staff'].includes(user?.role) && ['company'].includes(user?.addedBy?.role) || ['company', 'company-agent'].includes(user?.role))) &&
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="RSL (Type/Group)"
                                            name="rslTypeGroup"
                                            onChange={handleChange}
                                            // disabled={true}
                                            value={values.rslTypeGroup}
                                            error={touched.rslTypeGroup && Boolean(errors.rslTypeGroup)}
                                            helperText={touched.rslTypeGroup && errors.rslTypeGroup}
                                            margin="normal"
                                        >
                                            {data.map((item) => (
                                                <MenuItem key={item?._id} value={item?._id}>{item?.lable}</MenuItem>
                                            ))}
                                        </Field>
                                    }

                                    {
                                        ((/* ['staff'].includes(user?.role) && */['agent'].includes(user?.role) && [1].includes(user?.isMainMA))) &&
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="RSL (Type/Group)"
                                            name="rslTypeGroup"
                                            onChange={handleChange}
                                            value={values.rslTypeGroup}
                                            disabled={selectedValues.length == 0}
                                            error={touched.rslTypeGroup && Boolean(errors.rslTypeGroup)}
                                            helperText={touched.rslTypeGroup && errors.rslTypeGroup}
                                            margin="normal"
                                        >
                                            {selectedValues.map((item) => (
                                                <MenuItem key={item?._id} value={item?._id}>{item?.lable}</MenuItem>
                                            ))}
                                        </Field>}

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        onChange={handleChange}
                                        error={touched.address && Boolean(errors.address)}
                                        helperText={touched.address && errors.address}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="No of bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        onChange={handleChange}
                                        error={touched.bedrooms && Boolean(errors.bedrooms)}
                                        helperText={touched.bedrooms && errors.bedrooms}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Area"
                                        name="area"
                                        onChange={handleChange}
                                        error={touched.area && Boolean(errors.area)}
                                        helperText={touched.area && errors.area}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="City"
                                        name="city"
                                        onChange={handleChange}
                                        error={touched.city && Boolean(errors.city)}
                                        helperText={touched.city && errors.city}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Post Code"
                                        name="postCode"
                                        onChange={handleChange}
                                        error={touched.postCode && Boolean(errors.postCode)}
                                        helperText={touched.postCode && errors.postCode}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Basic Rent"
                                        name="basicRent"
                                        type="number"
                                        onChange={(e) => { handleChange(e); calculateTotalCharge('br', e.target.value) }}
                                        error={touched.basicRent && Boolean(errors.basicRent)}
                                        helperText={touched.basicRent && errors.basicRent}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Total Service Charges"
                                        name="serviceCharges"
                                        type="number"
                                        onChange={(e) => { handleChange(e); calculateTotalCharge('tsc', e.target.value) }}
                                        error={touched.serviceCharges && Boolean(errors.serviceCharges)}
                                        helperText={touched.serviceCharges && errors.serviceCharges}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Total Eligible Rent"
                                        name="eligibleRent"
                                        type="number"
                                        disabled
                                        onChange={handleChange}
                                        value={values.eligibleRent}
                                        error={touched.eligibleRent && Boolean(errors.eligibleRent)}
                                        helperText={touched.eligibleRent && errors.eligibleRent}
                                        margin="normal"
                                        sx={{
                                            '& .MuiInputBase-root.Mui-disabled': {
                                                backgroundColor: '#e9ecef',
                                                color: 'black',
                                                cursor: 'not-allowed',
                                            },
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        fullWidth
                                        label="Weekly Ineligible Charge"
                                        name="ineligibleCharge"
                                        type="number"
                                        onChange={handleChange}
                                        error={touched.ineligibleCharge && Boolean(errors.ineligibleCharge)}
                                        helperText={touched.ineligibleCharge && errors.ineligibleCharge}
                                        margin="normal"
                                    />

                                    <Field
                                        as={TextField}
                                        select
                                        fullWidth
                                        label="Shared with Other?"
                                        name="sharedWithOther"
                                        onChange={handleChange}
                                        error={touched.sharedWithOther && Boolean(errors.sharedWithOther)}
                                        helperText={touched.sharedWithOther && errors.sharedWithOther}
                                        margin="normal"
                                    >
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Field>



                                    <FormControlLabel
                                        control={
                                            <Field as={Checkbox} name="otherInformation" color="primary" />
                                        }
                                        label="Other Information"
                                    />

                                    {values.otherInformation && <>
                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Bedsit"
                                            name="bedist"
                                            onChange={handleChange}
                                            error={touched.bedist && Boolean(errors.bedist)}
                                            helperText={touched.bedist && errors.bedist}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Self Contained Flat"
                                            name="selfContainedFlat"
                                            onChange={handleChange}
                                            error={touched.selfContainedFlat && Boolean(errors.selfContainedFlat)}
                                            helperText={touched.selfContainedFlat && errors.selfContainedFlat}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="Quantity of Floors"
                                            name="quantityOfFloors"
                                            onChange={handleChange}
                                            error={touched.quantityOfFloors && Boolean(errors.quantityOfFloors)}
                                            helperText={touched.quantityOfFloors && errors.quantityOfFloors}
                                            margin="normal"
                                        />

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Unfurnished"
                                            name="unfurnished"
                                            onChange={handleChange}
                                            error={touched.unfurnished && Boolean(errors.unfurnished)}
                                            helperText={touched.unfurnished && errors.unfurnished}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Part Furnished"
                                            name="partFurnished"
                                            onChange={handleChange}
                                            error={touched.partFurnished && Boolean(errors.partFurnished)}
                                            helperText={touched.partFurnished && errors.partFurnished}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Fully Furnished"
                                            name="fullyFurnished"
                                            onChange={handleChange}
                                            error={touched.fullyFurnished && Boolean(errors.fullyFurnished)}
                                            helperText={touched.fullyFurnished && errors.fullyFurnished}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Central Heating"
                                            name="centralHeating"
                                            onChange={handleChange}
                                            error={touched.centralHeating && Boolean(errors.centralHeating)}
                                            helperText={touched.centralHeating && errors.centralHeating}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Garden"
                                            name="garden"
                                            onChange={handleChange}
                                            error={touched.garden && Boolean(errors.garden)}
                                            helperText={touched.garden && errors.garden}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            select
                                            fullWidth
                                            label="Garage/Parking Space"
                                            name="garageParkingSpace"
                                            onChange={handleChange}
                                            error={touched.garageParkingSpace && Boolean(errors.garageParkingSpace)}
                                            helperText={touched.garageParkingSpace && errors.garageParkingSpace}
                                            margin="normal"
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Field>

                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="Accommodation Location"
                                            name="accommodationLocation"
                                            onChange={handleChange}
                                            error={touched.accommodationLocation && Boolean(errors.accommodationLocation)}
                                            helperText={touched.accommodationLocation && errors.accommodationLocation}
                                            margin="normal"
                                        />

                                        <Field
                                            as={TextField}
                                            fullWidth
                                            label="Accommodation Floor"
                                            name="accommodationFloor"
                                            onChange={handleChange}
                                            error={touched.accommodationFloor && Boolean(errors.accommodationFloor)}
                                            helperText={touched.accommodationFloor && errors.accommodationFloor}
                                            margin="normal"
                                        />
                                        {
                                            otherFilds.map((item) => (
                                                < >
                                                    <Typography variant='subtitle1'>{item.title}</Typography>
                                                    <Field
                                                        as={TextField}
                                                        fullWidth
                                                        label="Your Use"
                                                        name={`${item.name}.yourUse`}
                                                        onChange={handleChange}

                                                        margin="normal"
                                                    />

                                                    <Field
                                                        as={TextField}
                                                        fullWidth
                                                        label="Communal"
                                                        name={`${item.name}.communal`}
                                                        onChange={handleChange}
                                                        margin="normal"
                                                    />
                                                </>
                                            ))
                                        }

                                    </>
                                    }

                                    <Grid container justifyContent={'space-between'} item>
                                        <Button
                                            onClick={() => navigator(-1)}
                                            color="secondary"
                                            variant="outlined"
                                            sx={{
                                                mr: 1, // margin to the right
                                                padding: '6px 16px',
                                                fontSize: '0.875rem',
                                                textTransform: 'none',
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => { handleSubmit() }}
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                padding: '6px 16px',
                                                fontSize: '0.875rem',
                                                textTransform: 'none',
                                            }}
                                        >
                                            {propertydata?._id ? 'Edit Property' : `Add Property`}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }}
            </Formik >
        </>
    )
}

export default AddProperty