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
import FileUpload from '@app/CommonComponents/FileUploas';

const Step2 = ({ nextStep, prevValues, backStep, setPreValues }) => {

    const validationSchema = Yup.object({
        nationalInsuranceNumber: Yup.string()
            .matches(/^[JNYS]/, "Must start with J, N, Y, or S") // First character must be J, N, Y, or S
            .matches(/^[A-Za-z]{2}/, "The first two characters must be alphabetical") // First two characters alphabetical
            .matches(/^[A-Za-z]{2}\d{6}[A-Za-z]$/, "Invalid format: Must be 9 characters long with numbers between and last character alphabetical") // Overall pattern
            .length(9, "Input must be exactly 9 characters long") // Must be exactly 9 characters
            .required("This field is required"), // Make it a required field
        lastName: Yup.string().required("Last Name is required"),
        firstName: Yup.string().required("First Name is required"),
        height: Yup.string()
            .matches(/^\d+(\.\d+)?$/, "Height must be a valid number")
            .required("Height is required"),
        shoeSize: Yup.string()
            .matches(/^\d+(\.\d+)?$/, "Shoe size must be a valid number")
            .required("Shoe size is required"),
        clothingSize: Yup.string()
            .required("Clothing size is required"),
        eyeColor: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "Eye color must contain only letters")
            .required("Eye color is required"),
        tenantContactNumber: Yup.string()
            .matches(/^(?:\+44|0)(?:\d\s?){10,11}$/, "Please enter a valid phone number")
            .required("Contact number is required"),
        skinTone: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "Skin tone must contain only letters")
            .required("Skin tone is required"),
        hairColor: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "Hair color must contain only letters")
            .required("Hair color is required"),
        dateOfBirth: Yup.date()
            .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "Must be at least 18 years old")
            .required("Date of birth is required"),
        placeOfBirth: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, "Place of birth must contain only letters and spaces")
            .required("Place of birth is required"),
        tenantEmail: Yup.string().email('Invalid email address').required('Required'),
    });


    return (
        <Formik
            initialValues={{ ...prevValues }}
            validationSchema={validationSchema}
            validate={(values) => {
                const errors = {};
                if (values.signuptype === false && !values.bcc_form) {
                    errors.bcc_form = 'BCC Claim Form is required';
                } else if (values.signuptype === false && values.bcc_form && values.bcc_form.size > 10 * 1024 * 1024) {
                    errors.bcc_form = 'File size is too large';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setPreValues((pre) => ({...pre, ...values}))
                nextStep()
            }}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
        >
            {({ isSubmitting, values, setFieldValue, handleSubmit, setValues, handleChange, errors }) => {
                return (
                    <Form>

                        <Box>
                            <Grid flexDirection='column' p={2} spacing={2} xs={12} sm={12} md={12} container>
                                <Grid item xs={6} sm={12} md={12}>
                                    <RadioComponent
                                        title='Signup Type'
                                        direction='ver'
                                        valArr={[
                                            { label: 'New Signup (Your data will automatically be uploaded to BCC Site)', value: true, checked: values.signuptype === true, onChange: () => setValues((pre) => ({ ...pre, signuptype: true })) },
                                            { label: 'Change of Circumstances (You have to upload BCC Form)', value: false, checked: values.signuptype === false, onChange: () => setValues((pre) => ({ ...pre, signuptype: false })) }
                                        ]}
                                        name='signuptype'
                                        value={values.signuptype}
                                    />
                                    {values?.signuptype === false && <Grid mt={2} item xs={6} sm={12} md={12} >
                                        <FlotingLableInput
                                            label="BCC Claim Form"
                                            accept="application/pdf"
                                            // accept="image/*"
                                            allowedExtensions={['pdf']}
                                            // allowedExtensions={['jpg', 'jpeg', 'png']}
                                            maxSize={10} // 10MB
                                            required
                                            type='file'
                                            value={values.bcc_form}
                                            showPreview={false}
                                            onChange={(file) => { setFieldValue('bcc_form', file); }}
                                            error={errors?.bcc_form}
                                            helperText={errors?.bcc_form}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />

                                    </Grid>}

                                    {/* {values?.signuptype === false && (
                                        <Grid mt={2} item xs={6} sm={12} md={12}>
                                            <FileUpload
                                                label="BCC Claim Form"
                                                accept="application/pdf"
                                                // accept="image/*"
                                                allowedExtensions={['pdf']}
                                                // allowedExtensions={['jpg', 'jpeg', 'png']}
                                                maxSize={10} // 10MB
                                                required
                                                value={values.bcc_form}
                                                showPreview={false}
                                                onChange={(file) => { setFieldValue('bcc_form', file); }}
                                                error={errors?.bcc_form}
                                                helperText={errors?.bcc_form}
                                            />
                                        </Grid>
                                    )} */}
                                </Grid>

                                <Divider sx={{ marginTop: 4, marginBottom: 4 }} />
                                <Grid p={3} gap={2} rowGap={1} container xs={12} sm={12} md={12}>
                                    {/* grid 1 */}
                                    <Grid container spacing={2} xs={4} sm={12} md={4} item >
                                        <Grid item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="title_before_name"
                                                select
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.title_before_name}
                                                label="Title Before Name"
                                                variant="outlined"
                                                menuItems={[
                                                    { val: 'Mr', label: 'Mr.' },
                                                    { val: 'Ms', label: 'Ms.' },
                                                    { val: 'Mrs', label: 'Mrs.' },
                                                    { val: 'Miss', label: 'Miss.' },

                                                ]}
                                            />
                                        </Grid>
                                        {/* firstname */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="firstName"
                                                fullWidth
                                                type='text'
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.firstName}
                                                label="First Name"
                                                required
                                                errors={errors}
                                                helperText={errors}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="middleName"
                                                type='text'
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.middleName}
                                                label="Middle Name"
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="lastName"
                                                type='text'
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.lastName}
                                                label="Last Name"
                                                required
                                                errors={errors}
                                                helperText={errors}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="nationalInsuranceNumber"
                                                label="National Insurance Number"
                                                type="text"
                                                required
                                                fullWidth
                                                errors={errors}
                                                helperText={errors}
                                                value={values.nationalInsuranceNumber}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <Typography color='GrayText' variant="subtitle1">Format:</Typography>
                                            <ul>
                                                <li><Typography color='GrayText' > Must begin with one of the following letters: J, N, Y, S;</Typography></li>
                                                <li><Typography color='GrayText' > The first two characters must be alphabetical;</Typography></li>
                                                <li><Typography color='GrayText' >Total length must be 9 characters;</Typography></li>
                                                <li><Typography color='GrayText' >The last character must be alphabetical;</Typography></li>
                                                <li><Typography color='GrayText' >Numeric characters must fill the spaces between the first two and the last characters;</Typography></li>
                                                <li><Typography color='GrayText' >No spaces are allowed within the input.</Typography></li>
                                            </ul>
                                        </Grid>
                                        <Grid item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="maritalstatus"
                                                select
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.maritalstatus}
                                                label="Marital Status *"
                                                variant="outlined"
                                                menuItems={[
                                                    { val: 'single', label: 'Single' },
                                                    { val: 'married', label: 'Married' },
                                                    { val: 'widowed', label: 'Widowed' },
                                                    { val: 'separated', label: 'Separated' },
                                                    { val: 'divorced', label: 'Divorced' }
                                                ]}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                errors={errors}
                                                helperText={errors}
                                                name="height"
                                                label="Height"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.height}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                errors={errors}
                                                helperText={errors}
                                                name="shoeSize"
                                                label="Shoe Size"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.shoeSize}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                errors={errors}
                                                helperText={errors}
                                                name="clothingSize"
                                                label="Clothing Size"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.clothingSize}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                errors={errors}
                                                helperText={errors}
                                                name="eyeColor"
                                                label="Eye Color"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.eyeColor}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* grid 2 */}
                                    <Grid container spacing={2} xs={4} sm={12} md={4} >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <FlotingLableInput
                                                name="gender"
                                                select
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.gender}
                                                label="Gender"
                                                required
                                                variant="outlined"
                                                menuItems={[{ val: 'male', label: 'Male' }, { val: 'female', label: 'Female' }]}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="tenantContactNumber"
                                                label="Tenant Contact Number"
                                                type="text"
                                                required
                                                errors={errors}
                                                helperText={errors}
                                                fullWidth
                                                value={values?.tenantContactNumber}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="tenantEmail"
                                                label="Tenant Email"
                                                // type="email"
                                                type='text'
                                                errors={errors}
                                                helperText={errors}
                                                fullWidth
                                                value={values?.tenantEmail}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="build"
                                                label="Build"
                                                select
                                                fullWidth
                                                value={values?.build || ''}
                                                onChange={handleChange}
                                                required
                                                menuItems={[{ val: 'small', label: 'Small' },
                                                { val: 'medium', label: 'Medium' },
                                                { val: 'large', label: 'Large' },

                                                ]}
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="claimReferenceNumber"
                                                label="Claim Reference Number (If Known)"
                                                type="text"
                                                fullWidth
                                                value={values?.claimReferenceNumber}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                            <Typography color='GrayText' >Format: 01234567</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="skinTone"
                                                label="Skin Tone"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.skinTone}
                                                errors={errors}
                                                helperText={errors}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="hairColor"
                                                label="Hair Color"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.hairColor}
                                                errors={errors}
                                                helperText={errors}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="dateOfBirth"
                                                label="Date of Birth (Use Calendar Only)"
                                                type="date"
                                                errors={errors}
                                                helperText={errors}
                                                required
                                                fullWidth
                                                value={values?.dateOfBirth}
                                                onChange={handleChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <FlotingLableInput
                                                name="placeOfBirth"
                                                errors={errors}
                                                helperText={errors}
                                                label="Place of Birth"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values?.placeOfBirth}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>
                                    </Grid>
                                    {/* grid 3 */}
                                    <Grid
                                        justifyContent='flex-start'
                                        alignItems='flex-start'
                                        display='flex'
                                        container
                                        spacing={2} // Reduced spacing for tighter layout
                                        xs={12} // Full width
                                        sm={12}
                                        md={4}
                                    >
                                        <Grid item
                                            xs={12}
                                            spacing={2}
                                        >
                                            <FlotingLableInput
                                                label='Current Situation/Reason for Homelessness'
                                                type='textarea'
                                                name='reasonforhomelessness'
                                                onChange={(e) => { handleChange(e) }}
                                                fullWidth
                                                value={values?.reasonforhomelessness}
                                            />
                                            <RadioComponent
                                                title='Do You have Vehicles?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.vehicles === true, onChange: () => setValues((pre) => ({ ...pre, vehicles: true })) },
                                                    { label: 'No', value: false, checked: values.vehicles === false, onChange: () => setValues((pre) => ({ ...pre, vehicles: false })) }
                                                ]}
                                                name='vehicles'
                                                value={values.vehicles}
                                            />
                                            {values?.vehicles === true &&
                                                <FlotingLableInput
                                                    placeholder='Details of Vehicles'
                                                    type='textarea'
                                                    name='vehiclesdetails'
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values?.vehiclesdetails}
                                                />
                                            }
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}

                                        >
                                            <RadioComponent
                                                title='Do you have distinguishing Marks?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.isdistinguishingMarks === true, onChange: () => setValues((pre) => ({ ...pre, isdistinguishingMarks: true })) },
                                                    { label: 'No', value: false, checked: values.isdistinguishingMarks === false, onChange: () => setValues((pre) => ({ ...pre, isdistinguishingMarks: false })) }
                                                ]}
                                                name='isdistinguishingMarks'
                                                value={values.isdistinguishingMarks}
                                            />
                                            {values?.isdistinguishingMarks === true &&
                                                <FlotingLableInput
                                                    placeholder='Any Distinguishing Marks'
                                                    type='textarea'
                                                    name='distinguishingMarks'
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values?.distinguishingMarks}
                                                />
                                            }
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <RadioComponent
                                                title='Do you have Details of employer/college etc. e.g. name, address, position held, Subject studied, hours attended?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.isemployerDetails === true, onChange: () => setValues((pre) => ({ ...pre, isemployerDetails: true })) },
                                                    { label: 'No', value: false, checked: values.isemployerDetails === false, onChange: () => setValues((pre) => ({ ...pre, isemployerDetails: false })) }
                                                ]}
                                                name='isemployerDetails'
                                                value={values.isemployerDetails}
                                            />
                                            {values?.isemployerDetails === true &&
                                                <FlotingLableInput
                                                    placeholder='Details of employer /college etc, e.g. name, address, position held, Subject studied, hours attended'
                                                    type='textarea'
                                                    name='employerDetails'
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values?.employerDetails}
                                                />
                                            }
                                        </Grid>

                                    </Grid>
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
                                <Button

                                    onClick={() => backStep()}
                                    variant="outlined"
                                    color="primary"
                                >
                                    Back
                                </Button>
                                <Button onClick={() => {
                                    handleSubmit()
                                }} variant="contained" color="primary">
                                    Next
                                </Button>


                            </Box>
                        </Box>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Step2
