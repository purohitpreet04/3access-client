import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    MenuItem,
    Radio,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import SignatureIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import API from 'Constance';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Assessment from './Assessment';
import { debounce } from 'lodash';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { beHealthyChoices, enjoyAndAchieveChoices, makingContributionChoices, riskCategories, signaturearray, staffuser, staySafeChoices, supportNeedsOptions, supportPlanChoices } from '@app/Utils/constant';
import RadioComponent from '@app/CommonComponents/RadioComponent';
import * as Yup from 'yup'
import { TenantDetails } from '..';
import SignatureCanvas from '@app/CommonComponents/SignatureCanvas';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import { CheckBox } from '@mui/icons-material';
import moment from 'moment';
import Step2 from './Step2';
import Step3 from './Step3';






function AddTenantForm() {
    const [activeStep, setActiveStep] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [conpanies, setCompanies] = useState([]);
    const [checkroom, setCheckroom] = useState(false);

    const [selectedProperty, setSelectedProperty] = useState(null);
    const location = useLocation()
    const steps = [
        {
            label: 'Property', icon: <HomeIcon />
        },
        { label: 'Tenant', icon: <GroupIcon /> },
        { label: 'Other Info', icon: <InfoIcon /> },
        { label: 'Signature', icon: <SignatureIcon /> },
    ];

    // Create a URLSearchParams object to parse the query string
    const queryParams = new URLSearchParams(location.search);

    // Extract 'p' and 'r' values from the query string
    const p = queryParams.get('p');
    const r = queryParams.get('r');
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        getAllCompanies()
    }, [])

    const getAllCompanies = async () => {
        try {
            let params = {};
            if (staffuser.includes(user?.role)) {
                params.staffAddedByrole = user?.addedBy?.role
                params.staffAddedBy = user?.addedBy?._id
            }
            const res = await API.get('/api/property/getallpropertyfortenants', { params: { _id: user?._id, role: user?.role, ...params } })
            setCompanies(res.data.data)
        } catch (error) {
            dispatch(showSnackbar({ message: 'something went wrong!', severity: 'error' }))
        }
    }

    const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    useEffect(() => {
        if (p && conpanies.length > 0) {
            const selectedProperty = conpanies.find((property) => property._id === p);
            if (selectedProperty) {
                setRooms(selectedProperty.rooms);
            }
            setSelectedProperty(selectedProperty);
            handleRoomCheck(r, p)
        }
    }, [p, conpanies]);

    const handleRoomCheck = async (room, property_id) => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/property/checkroomavebility', { params: { property_id, room } })
            if(res.data.message){
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            setRooms(res.data.rooms || [])
            setCheckroom(res.data.isRoomOccupied)
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: 'something went wrong!', severity: 'error' }))
        }
    }


    const validationSchema = Yup.object({
        signInDate: Yup.date()
            .max(new Date(), 'Date cannot be in the future')
            .required('Sign In Date is required'),
    });


    return (
        <Formik
            validationSchema={validationSchema}
            enableReinitialize={true}
            const initialValues={{
                property: p || '',
                room: r || '',
                hasGPInfo: false,
                homelessHostelSupport: false,
                affordProperty: false,
                relevantCircumstances: false,
                bereavement: false,
                isYouorptnrIstd: false,
                incapableofwork: false,
                isBlind: false,
                ispreblind: false,
                CarerAllowance: false,
                needOvernightcare: false,
                grantpaymentsforvehicle: false,
                vehicles: false,
                isdistinguishingMarks: false,
                isfostercarer: false,
                isabsentathome: false,
                hasClaimed: false,
                incomeChange: false,
                unearnedIncomeChange: false,
                capitalChange: false,
                expensesChange: false,
                moveInLast12Months: false,
                ispartnerlivingwithyou: false,
                visitedUk: false,
                isemployerDetails: false,
                signuptype: true,
                nillIncome: false,
                hasNextOfKin: false,
                afford_rent: false,
                exoffender: false,
                terms: false,
                early_date: false,
                circumstances_the_same: false,
                photo_uploaded: false,
                proof_of_benefit_radio: false
                // signInDate: null,
                // endDate: null
            }}

            validate={(val) => {
                let errors = {}
                // if (!val.signInDate || val.signInDate === '') {
                //     errors.signInDate = "Please  Select sign in Date"
                // }
                if (checkroom && (val?.endDate.length === 0)) {
                    errors.endDate = "Please Select sign out Date"
                }
                return errors;
            }}
            onSubmit={async (values, { resetForm }) => {

                if (values.terms === false) {
                    window.alert('Please check all terms and condition')
                    return false
                }

                const modifyVal = {
                    ...values,
                    addedBy: user?._id,
                    addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
                    signInDate: moment(values.signInDate).toISOString(),
                    endDate: (values.endDate && checkroom) ? moment(values.endDate).toISOString() : '',
                    isSignOut: 0
                }
                // console.log(modifyVal)
                // return
                try {
                    dispatch(setIsLoading({ data: true }))
                    const res = await API.post('/api/tenents/addtenants', modifyVal)
                    if (res.data.success == true) {
                        resetForm()
                    }
                    navigation('/desh')
                    dispatch(setIsLoading({ data: false }))
                } catch (error) {
                    console.log(error)
                    dispatch(setIsLoading({ data: false }))
                    dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add tenants details", severity: "error" }))
                }
            }}
            validateOnChange={false}

        >
            {({ values, setFieldValue, handleSubmit, setValues, handleChange, errors, setErrors }) => {
                // if (Object.entries(errors).length > 0) {
                //     Object.entries(errors).forEach(([key, val]) => {
                //         dispatch(showSnackbar({ message: val, severity: 'error' }))
                //     })
                // }

                const handlePropertyChange = (event) => {


                    setFieldValue('room', '')
                    setFieldValue('signInDate', null)
                    setFieldValue('endDate', null)
                    const selectedProperty = conpanies.find((property) => property._id === event.target.value);
                    // setRooms(selectedProperty?.rooms || []);
                    setValues((pre) => ({ ...pre, property: selectedProperty?._id }))
                    setFieldValue('property', selectedProperty?._id)
                    setFieldValue('room', selectedProperty?.rooms)
                    setSelectedProperty(selectedProperty);

                };
                const pastMonth = new Date();
                pastMonth.setMonth(pastMonth.getMonth() - 1); // One month ago
                const minDate = pastMonth.toISOString().split('T')[0];
                const tenetPartnerArray = [{ val: 'CL', label: `${values?.firstName} ${values?.lastName}` }, { val: 'both', label: 'BOTH' },]



                const handleAllCheck = (e) => {
                    const { name, checked, value } = e.target
                    // if (!checked) return

                    if (['terms'].includes(name)) {
                        signaturearray.forEach((sign) => {
                            setFieldValue(`${sign.name}_terms`, checked)
                        })
                    }
                }
                const handleResponseChange = (e) => {
                    console.log(e.target.name, e.target.value)
                    setValues((pre) => ({ ...pre, [e.target.name]: e.target.value }))
                }
                // console.log(values)
                return (

                    <form>
                        <DynamicTitle title='Add Tenant' />
                        <Box sx={{ width: '100%', mt: 3 }}>
                            <Box p={3}>
                                <Typography variant="h6" align="left" gutterBottom>
                                    Add Tenant
                                </Typography>
                            </Box>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel
                                            icon={step.icon}
                                            StepIconProps={{

                                                sx: {
                                                    color: index === activeStep ? '#438aca' : 'inherit',
                                                    backgroundColor: index === activeStep ? '#438aca' : 'transparent',
                                                    borderRadius: '50%',
                                                    width: 40,
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                },
                                            }}
                                            style={{
                                                color: index === activeStep ? '#438aca' : 'inherit',
                                                '& .MuiStepLabel-label': {
                                                },
                                            }}
                                            sx={{
                                                color: index === activeStep ? '#438aca' : 'inherit',
                                                '& .MuiStepLabel-label': {
                                                    color: index === activeStep ? '#438aca' : 'inherit',
                                                },

                                            }}
                                        >
                                            <Typography style={{ color: index === activeStep ? '#438aca' : 'inherit', }}>{step.label}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {/* step 1 */}
                            <Box sx={{ mt: 4, p: 3 }}>
                                {activeStep === 0 && (
                                    <>
                                        <Grid spacing={2} flexDirection='column' container justifyContent="center">
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="property"
                                                    // as={TextField}
                                                    disabled={conpanies.length == 0}
                                                    select
                                                    fullWidth
                                                    label="Property"
                                                    variant="outlined"
                                                    value={selectedProperty ? selectedProperty._id : values.property || p}
                                                    onChange={(e) => { handlePropertyChange(e); handleRoomCheck(values.room, e.target.value) }}

                                                >
                                                    {conpanies.map((pro) => (<MenuItem onClick={() => { setRooms(pro.rooms) }} key={pro?._id} value={pro?._id} >{pro?.address}</MenuItem>))}
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="room"
                                                    select
                                                    fullWidth
                                                    label="Room"
                                                    variant="outlined"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        // handleRoomCheck(e.target.value, values.property);
                                                        // setValues((pre) => ({ ...pre, signInDate: null, endDate: null }))
                                                    }}
                                                    value={values.room || r}
                                                >
                                                    {rooms.length > 0 && rooms.map((roomNumber) => (
                                                        <MenuItem key={roomNumber} value={roomNumber}>
                                                            Room {roomNumber}
                                                        </MenuItem>
                                                    ))}

                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="signInDate"
                                                    label="Sign In Date"
                                                    type="date"
                                                    fullWidth
                                                    value={values?.signInDate || null}
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    error={errors.signInDate}
                                                    helperText={errors.signInDate}
                                                    inputProps={{
                                                        // min: minDate,
                                                        max: new Date().toISOString().split('T')[0], // Prevent future dates
                                                    }}
                                                />
                                            </Grid>
                                            {checkroom && <Grid item xs={12} sm={6}>
                                                <TextField
                                                    name="endDate"
                                                    label="Sign Out Date(Current Tenant)"
                                                    type="date"
                                                    required
                                                    fullWidth
                                                    error={errors.endDate}
                                                    helperText={errors.endDate}
                                                    value={values.endDate || null}
                                                    onChange={handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        min: values?.signInDate ? new Date(values.signInDate).toISOString().split('T')[0] : '',
                                                        max: new Date().toISOString().split('T')[0]
                                                    }}
                                                />
                                            </Grid>}

                                            <Box
                                                m={2}
                                                justifyContent='start'
                                                alignItems='flex-start'
                                                display='flex'
                                                gap={3}
                                            >
                                                <Divider sx={{ my: 2 }} />
                                                <Button onClick={() => {
                                                    if (!values?.signInDate || !moment(values?.signInDate).isValid()) {
                                                        dispatch(showSnackbar({ message: "Select Sign in date", severity: 'error' }))
                                                        setErrors({ "signInDate": "Select Sign in date" })
                                                        return
                                                    }
                                                    handleNext()
                                                }} variant="contained" color="primary">
                                                    Next
                                                </Button>


                                            </Box>


                                        </Grid>
                                    </>
                                )}
                                {/* step 2 */}
                                {activeStep === 1 && (
                                    <Step2 prevValues={values} setPreValues={setValues} nextStep={handleNext} backStep={handleBack} />
                                    // <Box>
                                    //     <Grid flexDirection='column' p={2} spacing={2} xs={12} sm={12} md={12} container>
                                    //         <Grid item xs={6} sm={12} md={12}>
                                    //             <RadioComponent
                                    //                 title='Signup Type'
                                    //                 direction='ver'
                                    //                 valArr={[
                                    //                     { label: 'New Signup (Your data will automatically be uploaded to BCC Site)', value: true, checked: values.signuptype === true, onChange: () => setValues((pre) => ({ ...pre, signuptype: true })) },
                                    //                     { label: 'Change of Circumstances (You have to upload BCC Form)', value: false, checked: values.signuptype === false, onChange: () => setValues((pre) => ({ ...pre, signuptype: false })) }
                                    //                 ]}
                                    //                 name='signuptype'
                                    //                 value={values.signuptype}
                                    //             />
                                    //             {values?.signuptype === false && <Grid mt={2} item xs={6} sm={12} md={12} >
                                    //                 <FlotingLableInput
                                    //                     label="BCC Claim Form"
                                    //                     placeholder='BCC Claim Form'
                                    //                     type='file'
                                    //                     required
                                    //                     fullWidth
                                    //                     value={values.totalAmount}
                                    //                     onChange={(e) => { handleChange(e) }}
                                    //                     InputLabelProps={{
                                    //                         shrink: true,
                                    //                     }}
                                    //                 />
                                    //             </Grid>}
                                    //         </Grid>

                                    //         <Divider sx={{ marginTop: 4, marginBottom: 4 }} />
                                    //         <Grid p={3} gap={2} rowGap={1} container xs={12} sm={12} md={12}>
                                    //             {/* grid 1 */}
                                    //             <Grid container spacing={2} xs={4} sm={12} md={4} item >
                                    //                 <Grid item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="title_before_name"
                                    //                         select
                                    //                         fullWidth
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.title_before_name}
                                    //                         label="Title Before Name"
                                    //                         variant="outlined"
                                    //                         menuItems={[
                                    //                             { val: 'mr', label: 'Mr.' },
                                    //                             { val: 'ms', label: 'Ms.' },
                                    //                             { val: 'mrs', label: 'Mrs.' },
                                    //                             { val: 'miss', label: 'Miss.' },
                                    //                             { val: 'others', label: 'Others' }
                                    //                         ]}
                                    //                     />
                                    //                 </Grid>
                                    //                 {/* firstname */}
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="firstName"
                                    //                         fullWidth
                                    //                         type='text'
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.firstName}
                                    //                         label="First Name"
                                    //                         required
                                    //                         error={errors.firstName}
                                    //                         helperText={errors.firstName}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="middleName"
                                    //                         type='text'
                                    //                         fullWidth
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.middleName}
                                    //                         label="Middle Name"
                                    //                         required
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="lastName"
                                    //                         type='text'
                                    //                         fullWidth
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.lastName}
                                    //                         label="Last Name"
                                    //                         required
                                    //                         error={errors.lastName}
                                    //                         helperText={errors.lastName}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="nationalInsuranceNumber"
                                    //                         label="National Insurance Number"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         error={errors.nationalInsuranceNumber}
                                    //                         helperText={errors.nationalInsuranceNumber}
                                    //                         value={values.nationalInsuranceNumber}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <Typography color='GrayText' variant="subtitle1">Format:</Typography>
                                    //                     <ul>
                                    //                         <li><Typography color='GrayText' > Must begin with one of the following letters: J, N, Y, S;</Typography></li>
                                    //                         <li><Typography color='GrayText' > The first two characters must be alphabetical;</Typography></li>
                                    //                         <li><Typography color='GrayText' >Total length must be 9 characters;</Typography></li>
                                    //                         <li><Typography color='GrayText' >The last character must be alphabetical;</Typography></li>
                                    //                         <li><Typography color='GrayText' >Numeric characters must fill the spaces between the first two and the last characters;</Typography></li>
                                    //                         <li><Typography color='GrayText' >No spaces are allowed within the input.</Typography></li>
                                    //                     </ul>
                                    //                 </Grid>
                                    //                 <Grid item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="maritalstatus"
                                    //                         select
                                    //                         fullWidth
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.maritalstatus}
                                    //                         label="Marital Status *"
                                    //                         variant="outlined"
                                    //                         menuItems={[
                                    //                             { val: 'single', label: 'Single' },
                                    //                             { val: 'married', label: 'Married' },
                                    //                             { val: 'widowed', label: 'Widowed' },
                                    //                             { val: 'separated', label: 'Separated' },
                                    //                             { val: 'divorced', label: 'Divorced' }
                                    //                         ]}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="height"
                                    //                         label="Height"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.height}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="shoeSize"
                                    //                         label="Shoe Size"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.shoeSize}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="clothingSize"
                                    //                         label="Clothing Size"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.clothingSize}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="eyeColor"
                                    //                         label="Eye Color"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.eyeColor}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //             </Grid>
                                    //             {/* grid 2 */}
                                    //             <Grid container spacing={2} xs={4} sm={12} md={4} >
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                     sm={12}
                                    //                     md={12}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         name="gender"
                                    //                         select
                                    //                         fullWidth
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         value={values?.gender}
                                    //                         label="Gender"
                                    //                         required
                                    //                         variant="outlined"
                                    //                         menuItems={[{ val: 'male', label: 'Male' }, { val: 'female', label: 'Female' }]}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="tenantContactNumber"
                                    //                         label="Tenant Contact Number"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.tenantContactNumber}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="tenantEmail"
                                    //                         label="Tenant Email"
                                    //                         // type="email"
                                    //                         type='text'
                                    //                         fullWidth
                                    //                         value={values?.tenantEmail}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="build"
                                    //                         label="Build"
                                    //                         select
                                    //                         fullWidth
                                    //                         value={values?.build || ''}
                                    //                         onChange={handleChange}
                                    //                         required
                                    //                         menuItems={[{ val: 'small', label: 'Small' },
                                    //                         { val: 'medium', label: 'Medium' },
                                    //                         { val: 'large', label: 'Large' },

                                    //                         ]}
                                    //                     />

                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="claimReferenceNumber"
                                    //                         label="Claim Reference Number (If Known)"
                                    //                         type="text"
                                    //                         fullWidth
                                    //                         value={values?.claimReferenceNumber}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                     <Typography color='GrayText' >Format: 01234567</Typography>
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="skinTone"
                                    //                         label="Skin Tone"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.skinTone}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="hairColor"
                                    //                         label="Hair Color"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.hairColor}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="dateOfBirth"
                                    //                         label="Date of Birth (Use Calendar Only)"
                                    //                         type="date"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.dateOfBirth}
                                    //                         onChange={handleChange}
                                    //                         InputLabelProps={{
                                    //                             shrink: true,
                                    //                         }}
                                    //                         inputProps={{
                                    //                             max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
                                    //                         }}
                                    //                     />
                                    //                 </Grid>
                                    //                 <Grid item xs={12} sm={12} md={12}>
                                    //                     <FlotingLableInput
                                    //                         name="placeOfBirth"
                                    //                         label="Place of Birth"
                                    //                         type="text"
                                    //                         required
                                    //                         fullWidth
                                    //                         value={values?.placeOfBirth}
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                     />
                                    //                 </Grid>
                                    //             </Grid>
                                    //             {/* grid 3 */}
                                    //             <Grid
                                    //                 justifyContent='flex-start'
                                    //                 alignItems='flex-start'
                                    //                 display='flex'
                                    //                 container
                                    //                 spacing={2} // Reduced spacing for tighter layout
                                    //                 xs={12} // Full width
                                    //                 sm={12}
                                    //                 md={4}
                                    //             >
                                    //                 <Grid item
                                    //                     xs={12}
                                    //                     spacing={2}
                                    //                 >
                                    //                     <FlotingLableInput
                                    //                         label='Current Situation/Reason for Homelessness'
                                    //                         type='textarea'
                                    //                         name='reasonforhomelessness'
                                    //                         onChange={(e) => { handleChange(e) }}
                                    //                         fullWidth
                                    //                         value={values?.reasonforhomelessness}
                                    //                     />
                                    //                     <RadioComponent
                                    //                         title='Do You have Vehicles?'
                                    //                         direction='ver'
                                    //                         valArr={[
                                    //                             { label: 'Yes', value: true, checked: values.vehicles === true, onChange: () => setValues((pre) => ({ ...pre, vehicles: true })) },
                                    //                             { label: 'No', value: false, checked: values.vehicles === false, onChange: () => setValues((pre) => ({ ...pre, vehicles: false })) }
                                    //                         ]}
                                    //                         name='vehicles'
                                    //                         value={values.vehicles}
                                    //                     />
                                    //                     {values?.vehicles === true &&
                                    //                         <FlotingLableInput
                                    //                             placeholder='Details of Vehicles'
                                    //                             type='textarea'
                                    //                             name='vehiclesdetails'
                                    //                             onChange={(e) => { handleChange(e) }}
                                    //                             fullWidth
                                    //                             value={values?.vehiclesdetails}
                                    //                         />
                                    //                     }
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}

                                    //                 >
                                    //                     <RadioComponent
                                    //                         title='Do you have distinguishing Marks?'
                                    //                         direction='ver'
                                    //                         valArr={[
                                    //                             { label: 'Yes', value: true, checked: values.isdistinguishingMarks === true, onChange: () => setValues((pre) => ({ ...pre, isdistinguishingMarks: true })) },
                                    //                             { label: 'No', value: false, checked: values.isdistinguishingMarks === false, onChange: () => setValues((pre) => ({ ...pre, isdistinguishingMarks: false })) }
                                    //                         ]}
                                    //                         name='isdistinguishingMarks'
                                    //                         value={values.isdistinguishingMarks}
                                    //                     />
                                    //                     {values?.isdistinguishingMarks === true &&
                                    //                         <FlotingLableInput
                                    //                             placeholder='Any Distinguishing Marks'
                                    //                             type='textarea'
                                    //                             name='distinguishingMarks'
                                    //                             onChange={(e) => { handleChange(e) }}
                                    //                             fullWidth
                                    //                             value={values?.distinguishingMarks}
                                    //                         />
                                    //                     }
                                    //                 </Grid>
                                    //                 <Grid
                                    //                     item
                                    //                     xs={12}
                                    //                 >
                                    //                     <RadioComponent
                                    //                         title='Do you have Details of employer/college etc. e.g. name, address, position held, Subject studied, hours attended?'
                                    //                         direction='ver'
                                    //                         valArr={[
                                    //                             { label: 'Yes', value: true, checked: values.isemployerDetails === true, onChange: () => setValues((pre) => ({ ...pre, isemployerDetails: true })) },
                                    //                             { label: 'No', value: false, checked: values.isemployerDetails === false, onChange: () => setValues((pre) => ({ ...pre, isemployerDetails: false })) }
                                    //                         ]}
                                    //                         name='isemployerDetails'
                                    //                         value={values.isemployerDetails}
                                    //                     />
                                    //                     {values?.isemployerDetails === true &&
                                    //                         <FlotingLableInput
                                    //                             placeholder='Details of employer /college etc, e.g. name, address, position held, Subject studied, hours attended'
                                    //                             type='textarea'
                                    //                             name='employerDetails'
                                    //                             onChange={(e) => { handleChange(e) }}
                                    //                             fullWidth
                                    //                             value={values?.employerDetails}
                                    //                         />
                                    //                     }
                                    //                 </Grid>

                                    //             </Grid>
                                    //         </Grid>


                                    //     </Grid>

                                    // </Box>
                                )}
                                {/* step 3 */}
                                {activeStep === 2 && (
                                    <Step3 prevValues={values} setPreValues={setValues} nextStep={handleNext} backStep={handleBack} />
                                )}

                                {activeStep === 3 && (

                                    <>
                                        <Box>
                                            <Typography variant="h4" align="left">Signature For Tenants</Typography>
                                            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                                            <Grid spacing={4} p={3} xs={12} container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values.terms} // Ensure this accesses the correct value
                                                                onChange={(e) => { setFieldValue('terms', e.target.checked); handleAllCheck(e) }} // Use setFieldValue to update Formik state
                                                                name="terms"
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Agree all terms and conditions"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} spacing={2} rowGap={2} container>

                                                    {signaturearray.map((com) => {
                                                        // console.log(values[`${com.name}_terms`])
                                                        return (
                                                            <Grid item xs={4}>
                                                                <Typography>{com.label}</Typography>
                                                                <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                                                                    <input
                                                                        id={`${com.name}_terms`}
                                                                        type="checkbox"
                                                                        checked={values[`${com.name}_terms`]}
                                                                        onChange={(e) => { setFieldValue(`${com.name}_terms`, e.target.checked); if (e.target.checked == false) { setFieldValue('terms', false) } }}
                                                                        name={`${com.name}_terms`}
                                                                        style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                                                    />
                                                                    <label htmlFor={`${com.name}_terms`} style={{ fontSize: 15 }}>
                                                                        I agree for Terms and condition
                                                                    </label>
                                                                </div>
                                                                <SignatureCanvas name={com.name} setFieldValue={setFieldValue} onSave={(sign) => setFieldValue(com.name, sign)} />
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>

                                            </Grid>
                                        </Box>
                                        <Box>
                                            <Typography variant="h4">Signature For Staff</Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Grid spacing={4} p={3} xs={12} container>
                                                <Grid item xs={12} spacing={2} flexDirection='column' container>
                                                    <Typography variant="body1">Signature For Staff</Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values.staffagree_terms}
                                                                onChange={(e) => { setFieldValue(`staffagree_terms`, e.target.checked); if (e.target.checked == false) { setFieldValue('terms', false) } }}
                                                                name={`staffagree_terms`}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Staff Agree"
                                                    // labelPlacement="end"
                                                    />
                                                    <SignatureCanvas name='staffSignature' setFieldValue={setFieldValue} onSave={(sign) => setFieldValue('staffSignature', sign)} />
                                                </Grid>
                                            </Grid>


                                            <Box
                                                m={2}
                                                justifyContent='start'
                                                alignItems='flex-start'
                                                display='flex'
                                                gap={3}
                                            >
                                                <Divider sx={{ my: 2 }} />
                                                {activeStep !== 0 && <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    variant="outlined"
                                                    color="primary"
                                                >
                                                    Back
                                                </Button>}
                                                {activeStep !== steps.length - 1 && <Button onClick={handleNext} variant="contained" color="primary">
                                                    Next
                                                </Button>}
                                                {activeStep === 3 && <Button onClick={() => handleSubmit()} variant="contained" color="primary">
                                                    Submit
                                                </Button>}

                                            </Box>
                                        </Box>
                                    </>

                                )}


                            </Box>


                        </Box>
                    </form>
                )
            }}
        </Formik >
    );
}

export default AddTenantForm;
