import React, { memo, useCallback, useEffect, useRef } from 'react';
// import { Formik, Form, Field } from 'formik';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Radio,
    Box,
    Divider,
    AppBar,
    Toolbar,
    IconButton,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    RadioGroup,
    Icon,
} from '@mui/material';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { Form, Formik, useFormik } from 'formik';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import moment from 'moment';
import SignatureCanvas from '@app/CommonComponents/SignatureCanvas';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';
import { useDispatch } from 'react-redux';
import RadioComponent from '@app/CommonComponents/RadioComponent';
import { getDate } from '@app/Utils/utils';
import { checklistData, supportNeedsOptions, supportPlanChoices, beHealthyChoices, enjoyAndAchieveChoices, makingContributionChoices, staySafeChoices, riskCategories } from '@app/Utils/constant';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';


const Assessment = ({ nextStep, prevValues, backStep, setPreValues, }) => {

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const sd = query.get('sd');
    const fieldRefs = useRef({})
    useEffect(() => {
        console.log('Assessment');

    }, [])
    // const formik = useFormik({
    //     validateOnChange: false,
    //     validateOnBlur: false,
    //     enableReinitialize: true,
    //     // validationSchema: assessmentSchema,
    //     initialValues: {
    //         ...prevValues?.assesment,
    //         supportNeeds: prevValues?.assesment?.supportNeeds ? [...prevValues?.assesment?.supportNeeds] : [],
    //         dateOfAssessment: prevValues?.assesment?.dateOfAssessment ? moment(prevValues?.assesment?.dateOfAssessment).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    //         categories: prevValues?.assesment?.categories ? { ...prevValues?.assesment?.categories } : {},
    //         records: prevValues?.assesment?.records ? [...prevValues?.assesment?.records] : [{ natureOfOffence: '', date: '', sentence: '' }]
    //     },
    //     validate: (value) => {
    //         let errors = {}
    //         if (!values.preferredArea) errors.preferredArea = "Preferred Area is required";
    //         if (!values.sexualOrientation) errors.sexualOrientation = "Please select Sexual Orientation";
    //         if (!values.sourceOfIncome) errors.sourceOfIncome = "Source Of Income Is required";
    //         if (!values.supportNeeds || values.supportNeeds.length < 5) errors.supportNeeds = "You need to Check Atleast 5 items in Support needs";
    //         if (!values.totalAmount) errors.totalAmount = "Total Amount is required";
    //         if (!value?.supportNeeds || value?.supportNeeds?.length < 5) {
    //             errors.supportNeeds = 'You need to Check Atleast 5 items in Support needs'
    //             // dispatch(showSnackbar({ message: errors.supportNeeds, severity: "error" }))
    //         }
    //         return errors
    //     },
    //     onSubmit: async (values, { resetForm, }) => {
    //         const { categories, ...restData } = values
    //         try {
    //             const assesment = {
    //                 ...restData,
    //                 dateOfAssessment: moment(values?.dateOfAssessment).toISOString(),
    //                 release_date: moment(values?.release_date).toISOString(),
    //                 categories
    //             }
    //             setPreValues((pre) => ({
    //                 ...pre, assesment,
    //             }))
    //             handleScrollOnError()
    //             nextStep()
    //         } catch (error) {
    //             dispatch(setIsLoading({ data: false }))
    //             dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add tenants details", severity: "error" }))
    //         }
    //     }
    // })

    // const { setValues, values, handleChange, handleSubmit, setFieldValue, errors } = formik;


    // const handleInputChange = useCallback((e) => {
    //     handleChange(e);
    // }, [handleChange]);
    // console.log(values)
    return (
        <>
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                // validationSchema: assessmentSchema,
                initialValues={{
                    ...prevValues?.assesment,
                    supportNeeds: prevValues?.assesment?.supportNeeds ? [...prevValues?.assesment?.supportNeeds] : [],
                    dateOfAssessment: prevValues?.assesment?.dateOfAssessment ? moment(prevValues?.assesment?.dateOfAssessment).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                    categories: prevValues?.assesment?.categories ? { ...prevValues?.assesment?.categories } : {},
                    records: prevValues?.assesment?.records ? [...prevValues?.assesment?.records] : [{ natureOfOffence: '', date: '', sentence: '' }]
                }}
                validate={(values) => {
                    let errors = {}
                    if (!values.preferredArea) errors.preferredArea = "Preferred Area is required";
                    if (!values.sexualOrientation) errors.sexualOrientation = "Please select Sexual Orientation";
                    if (!values.sourceOfIncome) errors.sourceOfIncome = "Source Of Income Is required";
                    if (!values.supportNeeds || values.supportNeeds.length < 5) errors.supportNeeds = "You need to Check Atleast 5 items in Support needs";
                    if (!values.totalAmount) errors.totalAmount = "Total Amount is required";
                    if (!values?.supportNeeds || value?.supportNeeds?.length < 5) {
                        errors.supportNeeds = 'You need to Check Atleast 5 items in Support needs'
                    }
                    return errors
                }}
                onSubmit={async (values, { resetForm, }) => {
                    const { categories, ...restData } = values
                    try {
                        const assesment = {
                            ...restData,
                            dateOfAssessment: moment(values?.dateOfAssessment).toISOString(),
                            release_date: moment(values?.release_date).toISOString(),
                            categories
                        }
                        setPreValues((pre) => ({
                            ...pre, assesment,
                        }))
                        // handleScrollOnError()
                        nextStep()
                    } catch (error) {
                        dispatch(setIsLoading({ data: false }))
                        dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add tenants details", severity: "error" }))
                    }
                }}

            >
                {({ setValues, values, handleChange, handleSubmit, setFieldValue, errors, submitCount }) => {

                    const handleScrollOnError = () => {
                        const firstErrorField = Object.keys(errors)[0];
                        if (firstErrorField) {
                            fieldRefs.current[firstErrorField]?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            });
                        }
                    }
                    const addRecord = useCallback(() => {
                        setFieldValue('records', [...values?.records, { natureOfOffence: '', date: '', sentence: '' }]);
                    }, [values?.records]);
                    const removeRecord = (index) => {
                        const newRecords = values?.records.filter((_, i) => i !== index);
                        setFieldValue('records', newRecords);
                    };

                    return (
                        <Form>
                            <Box px={3} pb={3}>
                                <Box>
                                    <Typography variant="h6">Assessment</Typography>
                                    <Typography variant="p">Fill in the information below. The fields marked with * are required.</Typography>
                                </Box>
                                <Grid marginTop={4} spacing={2} container justifyContent="center">
                                    <Grid item xs={12} sm={6}>
                                        <FlotingLableInput
                                            name="dateOfAssessment"
                                            required
                                            label="Date of Assessment"
                                            type="date"
                                            fullWidth
                                            value={values?.dateOfAssessment || moment().format('DD/MM/YYYY')}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            ref={(el) => (fieldRefs.current['dateOfAssessment'] = el)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FlotingLableInput
                                            name="preferredArea"
                                            ref={(el) => (fieldRefs.current['preferredArea'] = el)}
                                            label="Preferred Area of Tenant"
                                            placeholder="Preferred Area of Tenant"
                                            type="text"
                                            required
                                            fullWidth
                                            value={values.preferredArea}
                                            onChange={(e) => { handleChange(e) }}
                                            errors={errors}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>

                                        <RadioComponent
                                            defaultValue={false}
                                            title='Work No.'
                                            direction='hor'
                                            valArr={[
                                                { label: "Yes", value: true, checked: values.workNo === true, onChange: () => setValues((pre) => ({ ...pre, workNo: true })) },
                                                { label: 'No', value: false, checked: values.workNo === false, onChange: () => setValues((pre) => ({ ...pre, workNo: false })), defaultChecked: true }
                                            ]}
                                            name='workNo'
                                            value={values.workNo}
                                        />
                                        {values?.workNo && (
                                            <FlotingLableInput
                                                type="text"
                                                name="workNoDetails"
                                                onChange={handleChange}
                                                fullWidth
                                                value={values?.workNoDetails}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RadioComponent
                                            defaultValue={false}
                                            title="Home No."
                                            direction='hor'
                                            valArr={[
                                                { label: "Yes", value: true, checked: values.homeNo === true, onChange: () => setValues((pre) => ({ ...pre, homeNo: true })) },
                                                { label: 'No', value: false, checked: values.homeNo === false, onChange: () => setValues((pre) => ({ ...pre, homeNo: false })), defaultChecked: true }
                                            ]}
                                            name='homeNo'
                                            value={values.homeNo}
                                        />

                                        {values.homeNo && (
                                            <FlotingLableInput
                                                type="text"
                                                name="homeNoDetails"
                                                onChange={handleChange}
                                                fullWidth
                                                value={values?.homeNoDetails}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid flexDirection='column' marginTop={4} spacing={2} container>
                                    <Box width='100%' px={2}>
                                        <Typography variant="h6">Diversity Monitoring Form</Typography>
                                        <Divider sx={{ marginTop: 2 }} />
                                        <Grid marginTop={4} spacing={2} container justifyContent="center">
                                            {/* Ethnic Origin */}
                                            <Grid item xs={12} sm={3}>
                                                <FlotingLableInput
                                                    name="ethnicOrigin"
                                                    label="Ethnic Origin"
                                                    select
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                    }}
                                                    fullWidth
                                                    value={values?.ethnicOrigin}
                                                    menuItems={[
                                                        { val: "White: British", label: "White: British" },
                                                        { val: "White: Irish", label: "White: Irish" },
                                                        { val: "White: Other", label: "White: Other" },
                                                        { val: "Mixed: White & Black Caribbean", label: "Mixed: White & Black Caribbean" },
                                                        { val: "Mixed: White & Black African", label: "Mixed: White & Black African" },
                                                        { val: "Mixed: White & Asian", label: "Mixed: White & Asian" },
                                                        { val: "Mixed: Other", label: "Mixed: Other" },
                                                        { val: "Asian/Asian British: Indian", label: "Asian/Asian British: Indian" },
                                                        { val: "Asian/Asian British: Pakistani", label: "Asian/Asian British: Pakistani" },
                                                        { val: "Asian/Asian British: Bangladeshi", label: "Asian/Asian British: Bangladeshi" },
                                                        { val: "Asian/Asian British: Other", label: "Asian/Asian British: Other" },
                                                        { val: "Black/Black British: Caribbean", label: "Black/Black British: Caribbean" },
                                                        { val: "Black/Black British: African", label: "Black/Black British: African" },
                                                        { val: "Black/Black British: Other", label: "Black/Black British: Other" },
                                                        { val: "Chinese/Other Ethnic Group", label: "Chinese/Other Ethnic Group" },
                                                        { val: "Other", label: "Other" },
                                                        { val: "Refuse to say", label: "Refuse to say" },
                                                    ]}
                                                />

                                            </Grid>

                                            {/* Religion */}
                                            <Grid item xs={12} sm={3}>

                                                <FlotingLableInput
                                                    name="religion"
                                                    label="Religion"
                                                    select
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                    }}
                                                    fullWidth
                                                    value={values?.religion}
                                                    menuItems={[
                                                        { val: "No religion/Atheist", label: "No religion/Atheist" },
                                                        { val: "Muslim", label: "Muslim" },
                                                        { val: "Christian (all denominations)", label: "Christian (all denominations)" },
                                                        { val: "Sikh", label: "Sikh" },
                                                        { val: "Buddhist", label: "Buddhist" },
                                                        { val: "Hindu", label: "Hindu" },
                                                        { val: "Jewish", label: "Jewish" },
                                                        { val: "Other", label: "Other" },
                                                        { val: "Prefer not to say", label: "Prefer not to say" },
                                                    ]}
                                                />

                                            </Grid>

                                            {/* Sexual Orientation */}
                                            <Grid item xs={12} sm={3}>
                                                <FlotingLableInput
                                                    name="sexualOrientation"
                                                    ref={(el) => (fieldRefs.current['sexualOrientation'] = el)}
                                                    label="Sexual Orientation"
                                                    select
                                                    fullWidth
                                                    required
                                                    value={values?.sexualOrientation}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                    }}
                                                    errors={errors}
                                                    helperText={errors}
                                                    menuItems={[
                                                        { val: "Heterosexual", label: "Heterosexual" },
                                                        { val: "Homosexual", label: "Homosexual" },
                                                        { val: "Lesbian", label: "Lesbian" },
                                                        { val: "Transgender", label: "Transgender" },
                                                        { val: "Bisexual", label: "Bisexual" },
                                                        { val: "Prefer not to say", label: "Prefer not to say" },
                                                    ]}
                                                />
                                            </Grid>

                                            {/* Any Communication Needs */}
                                            <Grid item xs={12} sm={3}>
                                                <RadioComponent
                                                    defaultValue={false}
                                                    title="Any Communication Needs?"
                                                    direction='hor'
                                                    valArr={[
                                                        { label: "Yes", value: true, checked: values.communicationNeeds === true, onChange: () => setValues((pre) => ({ ...pre, communicationNeeds: true })) },
                                                        { label: 'No', value: false, checked: values.communicationNeeds === false, onChange: () => setValues((pre) => ({ ...pre, communicationNeeds: false })), defaultChecked: true }
                                                    ]}
                                                    name='communicationNeeds'
                                                    value={values.communicationNeeds}
                                                />

                                                {values?.communicationNeeds && (
                                                    <TextField
                                                        name="communicationNeedsDetails"
                                                        select
                                                        fullWidth
                                                        value={values?.communicationNeedsDetails}
                                                        onChange={(e) => { handleChange(e) }}
                                                        defaultValue='Large Print'
                                                    >
                                                        <MenuItem value="Large Print">Large Print</MenuItem>
                                                        <MenuItem value="Braille">Braille</MenuItem>
                                                        <MenuItem value="Audiotape/CD">Audiotape/CD</MenuItem>
                                                        <MenuItem value="Translation/Interpreter">Translation/Interpreter</MenuItem>
                                                        <MenuItem value="Pictures & Symbols">Pictures & Symbols</MenuItem>
                                                        <MenuItem value="Easy Read">Easy Read</MenuItem>
                                                        <MenuItem value="BSL/Makaton">BSL/Makaton</MenuItem>
                                                        <MenuItem value="Other_communication_needs">Other</MenuItem>
                                                    </TextField>
                                                )}


                                            </Grid>
                                        </Grid>
                                    </Box >
                                </Grid >

                                <Typography variant="h6" marginTop={4}>Financial Information</Typography>
                                <Divider sx={{ marginTop: 2 }} />
                                <Grid xs={12} spacing={2} flexDirection='row' container>
                                    <Grid xs={3} marginTop={2} item flexDirection='column' >
                                        <Grid mt={2} item xs={12} sm={12}>
                                            <FlotingLableInput
                                                name="sourceOfIncome"
                                                type='text'
                                                label="What is your source of income? What benefits are you on"
                                                required
                                                fullWidth
                                                errors={errors}
                                                value={values?.sourceOfIncome}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>

                                        {/* Total Amount */}
                                        <Grid mt={3} item xs={12} sm={12}>
                                            <FlotingLableInput
                                                name="totalAmount"
                                                // as={TextField}
                                                label="Total Amount"
                                                type='text'
                                                required
                                                errors={errors}
                                                fullWidth
                                                value={values?.totalAmount}
                                                onChange={(e) => { handleChange(e) }}

                                            />
                                        </Grid>

                                        {/* How Often */}
                                        <Grid mt={3} item xs={12}>
                                            <FlotingLableInput
                                                name="howOften"
                                                label="How Often"
                                                select
                                                errors={errors}
                                                onChange={(e) => { handleChange(e) }}
                                                fullWidth
                                                // required
                                                value={values?.howOften}
                                                menuItems={[
                                                    { val: "Hourly", label: "Hourly: Occurs every hour" },
                                                    { val: "Daily", label: "Daily: Occurs every day" },
                                                    { val: "Weekly", label: "Weekly: Occurs once a week" },
                                                    { val: "Bi-weekly", label: "Bi-weekly: Occurs every two weeks" },
                                                    { val: "Semi-monthly", label: "Semi-monthly: Occurs twice a month" },
                                                    { val: "Monthly", label: "Monthly: Occurs once a month" },
                                                    { val: "Bimonthly", label: "Bimonthly: Occurs every two months" },
                                                    { val: "Quarterly", label: "Quarterly: Occurs every three months" },
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid xs={9} marginTop={2} spacing={2} item flexWrap='wrap' container>
                                        {/* Do you have any debts? */}
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you have any debts? If so, please provide details."
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.debt === true, onChange: () => setValues((pre) => ({ ...pre, debt: true })) },
                                                    { label: 'No', value: false, checked: values.debt === false, onChange: () => setValues((pre) => ({ ...pre, debt: false })), defaultChecked: true }
                                                ]}
                                                name='debt'
                                                value={values.debt}
                                            />

                                            {values?.debt &&
                                                <FlotingLableInput
                                                    // placeholder='Details of Vehicles'
                                                    type='textarea'
                                                    name='debtdetails'
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values?.debtdetails}
                                                />
                                            }
                                        </Grid>

                                        {/* Do you have any issues with gambling? */}
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you have any issues with gambling? If so, please provide details."
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.gamblingIssues === true, onChange: () => setValues((pre) => ({ ...pre, gamblingIssues: true })) },
                                                    { label: 'No', value: false, checked: values.gamblingIssues === false, onChange: () => setValues((pre) => ({ ...pre, gamblingIssues: false })), defaultChecked: true }
                                                ]}
                                                name='gamblingIssues'
                                                value={values.gamblingIssues}
                                            />

                                            {values?.gamblingIssues &&
                                                <FlotingLableInput
                                                    // placeholder='Details of Vehicles'
                                                    type='textarea'
                                                    name='gamblingIssuesdetails'
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values?.gamblingIssuesdetails}
                                                />
                                            }
                                        </Grid>

                                        {/* Do you have any Criminal Records? */}
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you have any Criminal Records?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.criminalRecords === true, onChange: () => setValues((pre) => ({ ...pre, criminalRecords: true })) },
                                                    { label: 'No', value: false, checked: values.criminalRecords === false, onChange: () => setValues((pre) => ({ ...pre, criminalRecords: false })), defaultChecked: true }
                                                ]}
                                                name='criminalRecords'
                                                value={values.criminalRecords}
                                            />

                                            {values?.criminalRecords && (
                                                <>
                                                    {values?.records.map((record, index) => (
                                                        <Grid
                                                            container
                                                            key={index}
                                                            spacing={2}
                                                            alignItems="center"
                                                            wrap="nowrap" // Prevents wrapping to a new line
                                                            sx={{ marginBottom: 2 }} // Adds spacing between rows
                                                        >
                                                            <Grid item xs={4}>
                                                                <TextField
                                                                    fullWidth
                                                                    name={`records[${index}].natureOfOffence`}
                                                                    label="Nature of Offence"
                                                                    value={record.natureOfOffence}
                                                                    onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <TextField
                                                                    fullWidth
                                                                    name={`records[${index}].date`}
                                                                    label="Date"
                                                                    type="date"
                                                                    value={record.date}
                                                                    onChange={handleChange}
                                                                    InputLabelProps={{ shrink: true }} // Ensures the label stays above the date input
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <TextField
                                                                    fullWidth
                                                                    name={`records[${index}].sentence`}
                                                                    label="Sentence"
                                                                    value={record.sentence}
                                                                    onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <IconButton onClick={() => removeRecord(index)}>
                                                                    <Icon sx={{ color: 'red' }}>cancel</Icon>
                                                                </IconButton>
                                                                {/* <Button
                                                            onClick={() => removeRecord(index)}
                                                            color="error"
                                                            variant="contained"
                                                        >
                                                            Remove
                                                        </Button> */}
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                    <Grid container>
                                                        <Grid item xs={4}>
                                                            <Button
                                                                onClick={addRecord}
                                                                color="primary"
                                                                variant="contained"
                                                            // sx={{ marginTop: 2 }}
                                                            >
                                                                Add Record
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Typography id='supportNeeds' ref={(el) => (fieldRefs.current['supportNeeds'] = el)} variant="h6" marginTop={4}>Support Needs</Typography>
                                {errors?.supportNeeds && <Typography variant="subtitle2" component='p' color='red' marginTop={1}>{errors?.supportNeeds}</Typography>}

                                <Divider sx={{ marginTop: 2 }} />
                                <Box display="flex" justifyContent="space-between" width="100%" height='50%'>
                                    <Box width="33%" p={2}>
                                        <FormGroup>
                                            {supportNeedsOptions.slice(0, supportNeedsOptions.length / 3).map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            checked={values?.supportNeeds.includes(option.name)}
                                                            onChange={() => {
                                                                const newSupportNeeds = values.supportNeeds.includes(option.name)
                                                                    ? values.supportNeeds.filter((need) => need !== option.name)
                                                                    : [...values.supportNeeds, option.name];
                                                                setValues({ ...values, supportNeeds: newSupportNeeds });
                                                            }}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                    <Box width="33%" p={2}>
                                        <FormGroup>
                                            {supportNeedsOptions.slice(supportNeedsOptions.length / 3, supportNeedsOptions.length * 2 / 3).map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            checked={values?.supportNeeds.includes(option.name)}
                                                            onChange={() => {
                                                                const newSupportNeeds = values.supportNeeds.includes(option.name)
                                                                    ? values.supportNeeds.filter((need) => need !== option.name)
                                                                    : [...values.supportNeeds, option.name];
                                                                setValues({ ...values, supportNeeds: newSupportNeeds });
                                                            }}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                    <Box width="33%" p={2}>
                                        <FormGroup>
                                            {supportNeedsOptions.slice(supportNeedsOptions.length * 2 / 3).map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    control={
                                                        <Checkbox
                                                            checked={values?.supportNeeds.includes(option.name)}
                                                            onChange={() => {
                                                                const newSupportNeeds = values.supportNeeds.includes(option.name)
                                                                    ? values.supportNeeds.filter((need) => need !== option.name)
                                                                    : [...values.supportNeeds, option.name];
                                                                setValues({ ...values, supportNeeds: newSupportNeeds });
                                                            }}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                </Box>
                                <Box width='100%'>
                                    <Typography variant='p'>You must have at least 5 support needs to qualify otherwise you have to give reason.</Typography>
                                    <FlotingLableInput
                                        name="qualifyreason"
                                        fullWidth
                                        type='textarea'
                                        onChange={(e) => { handleChange(e) }}
                                        style={{ height: 100 }}
                                        value={values.qualifyreason}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="h6" marginTop={4}>Support Worker Informations</Typography>
                                    <Divider sx={{ marginTop: 2 }} />
                                    <Grid item xs={12} sm={4}>
                                        <RadioComponent
                                            defaultValue={false}
                                            title="Full check completed with the tenant?"
                                            direction='hor'
                                            valArr={[
                                                { label: "Yes", value: true, checked: values.fullcheck === true, onChange: () => setValues((pre) => ({ ...pre, fullcheck: true })) },
                                                { label: 'No', value: false, checked: values.fullcheck === false, onChange: () => setValues((pre) => ({ ...pre, fullcheck: false })), defaultChecked: true }
                                            ]}
                                            name='fullcheck'
                                            value={values.fullcheck}
                                        />
                                    </Grid>
                                </Box>
                                {
                                    !values?.fullcheck &&
                                    <Box width='50%'>
                                        <FlotingLableInput
                                            placeholder='Why? (Reason)'
                                            type='textarea'
                                            name='fullcheckreason'
                                            onChange={(e) => { handleChange(e) }}
                                            fullWidth
                                            value={values?.fullcheckreason}
                                        />
                                    </Box>
                                }
                                <Box width='50%'>
                                    <Typography variant='p'>Referred From (Please state agency name or self-referral)</Typography>
                                    <FlotingLableInput
                                        name="ReferredFrom"
                                        fullWidth
                                        type='text'
                                        value={values?.ReferredFrom}
                                        onChange={(e) => { handleChange(e) }}
                                        style={{ height: 100 }}
                                    />
                                </Box>
                                <Grid>
                                    <RadioComponent
                                        defaultValue={false}
                                        title="Please give details if you receive regular support from any of the listed agencies:"
                                        direction='hor'
                                        valArr={[
                                            { label: "Yes", value: true, checked: values.supportFromAgencies === true, onChange: () => setValues((pre) => ({ ...pre, supportFromAgencies: true })) },
                                            { label: 'No', value: false, checked: values.supportFromAgencies === false, onChange: () => setValues((pre) => ({ ...pre, supportFromAgencies: false })), defaultChecked: true }
                                        ]}
                                        name='supportFromAgencies'
                                        value={values.supportFromAgencies}
                                    />
                                    {values?.supportFromAgencies === true &&
                                        (<>
                                            <Grid container spacing={3} sx={{ padding: 2 }}>
                                                {/* Row 1 */}
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="Social Worker"
                                                        type="text"
                                                        name="socialWorker"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.socialWorker}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="Probation Officer"
                                                        type="text"
                                                        name="probationOfficer"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.probationOfficer}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="Probation Officer Contact No."
                                                        type="text"
                                                        name="probationOfficerContactNo"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.probationOfficerContactNo}
                                                    />
                                                </Grid>

                                                {/* Row 2 */}
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="CPN"
                                                        type="text"
                                                        name="cpn"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.cpn}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="Probation Officer Address"
                                                        type="text"
                                                        name="probationOfficerAddress"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.probationOfficerAddress}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FlotingLableInput
                                                        placeholder="Psychiatrist/Psychologist"
                                                        type="text"
                                                        name="psychiatristPsychologist"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.psychiatristPsychologist}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </>)}
                                    <Divider sx={{ marginTop: 4 }} />

                                    <Typography variant="h6" marginTop={4}>PHYSICAL AND MENTAL HEALTH</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you have any physical health conditions?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.physicalHealthcon === true, onChange: () => setValues((pre) => ({ ...pre, physicalHealthcon: true })) },
                                                    { label: 'No', value: false, checked: values.physicalHealthcon === false, onChange: () => setValues((pre) => ({ ...pre, physicalHealthcon: false })), defaultChecked: true }
                                                ]}
                                                name='physicalHealthcon'
                                                value={values.physicalHealthcon}
                                            />
                                            {values?.physicalHealthcon && (
                                                <>
                                                    <FlotingLableInput
                                                        // placeholder="Psychiatrist/Psychologist"
                                                        type="text"
                                                        name="physicalHealthdetails"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.physicalHealthdetails}
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you have any mental health conditions?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.mentalHealthcon === true, onChange: () => setValues((pre) => ({ ...pre, mentalHealthcon: true })) },
                                                    { label: 'No', value: false, checked: values.mentalHealthcon === false, onChange: () => setValues((pre) => ({ ...pre, mentalHealthcon: false })), defaultChecked: true }
                                                ]}
                                                name='mentalHealthcon'
                                                value={values.mentalHealthcon}
                                            />
                                            {/* <Typography variant="subtitle1">Do you have any mental health conditions?</Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Radio checked={values.mentalHealthcon === true} onChange={() => setValues((pre) => ({ ...pre, mentalHealthcon: true }))} name="mentalHealthcon" value={true} />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            control={<Radio checked={values.mentalHealthcon === false} onChange={() => setValues((pre) => ({ ...pre, mentalHealthcon: false }))} name="mentalHealthcon" value={false} />}
                                            label="No"
                                        />
                                    </FormGroup> */}
                                            {values?.mentalHealthcon && (
                                                <>
                                                    <FlotingLableInput
                                                        // placeholder="Psychiatrist/Psychologist"
                                                        type="text"
                                                        name="mentalHealthdetails"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.mentalHealthdetails}
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={4} sm={4}>
                                            
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Have you been diagnosed with any mental health condition?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.mentalHealthdig === true, onChange: () => setValues((pre) => ({ ...pre, mentalHealthdig: true })) },
                                                    { label: 'No', value: false, checked: values.mentalHealthdig === false, onChange: () => setValues((pre) => ({ ...pre, mentalHealthdig: false })), defaultChecked: true }
                                                ]}
                                                name='mentalHealthdig'
                                                value={values.mentalHealthdig}
                                            />

                                            {values?.mentalHealthdig && (
                                                <Grid container spacing={2} mt={2}>
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="diagnosed_any_mental_health_name_person"
                                                            type="text"
                                                            label="Name/position of person responsible for diagnosis"
                                                            placeholder="Name/position of person responsible for diagnosis"
                                                            required
                                                            fullWidth
                                                            value={values.diagnosed_any_mental_health_name_person || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="diagnosed_any_mental_health_prescribed"
                                                            type="text"
                                                            label="Prescribed medication"
                                                            placeholder="Prescribed medication"
                                                            required
                                                            fullWidth
                                                            value={values.diagnosed_any_mental_health_prescribed || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="diagnosed_any_mental_health_dosage"
                                                            type="text"
                                                            label="Dosage of medication"
                                                            placeholder="Dosage of medication"
                                                            required
                                                            fullWidth
                                                            value={values.diagnosed_any_mental_health_dosage || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="diagnosed_any_mental_health_medication"
                                                            type="text"
                                                            label="Medication prescribed by"
                                                            placeholder="Medication prescribed by"
                                                            required
                                                            fullWidth
                                                            value={values.diagnosed_any_mental_health_medication || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Grid>
                                                </Grid>

                                            )}
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ marginTop: 4 }} />

                                    <Typography variant="h6" marginTop={4}>Legal Status</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <FlotingLableInput
                                                label='Have you been subject to any orders?'
                                                select
                                                menuItems={[
                                                    { val: "DRR", label: "DRR" },
                                                    { val: "Yes", label: "Yes" },
                                                    { val: "No", label: "No" }
                                                ]}
                                                // type="text"
                                                name="subjecttoorder"
                                                onChange={handleChange}
                                                fullWidth
                                                value={values?.subjecttoorder}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Are you prescribed medication?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.prescribedMedication === true, onChange: () => setValues((pre) => ({ ...pre, prescribedMedication: true })) },
                                                    { label: 'No', value: false, checked: values.prescribedMedication === false, onChange: () => setValues((pre) => ({ ...pre, prescribedMedication: false })), defaultChecked: true }
                                                ]}
                                                name='prescribedMedication'
                                                value={values.prescribedMedication}
                                            />
                                            {values?.prescribedMedication && (
                                                <>
                                                    <FlotingLableInput
                                                        // placeholder="Psychiatrist/Psychologist"
                                                        type="text"
                                                        name="prescribedMedicationdetails"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.prescribedMedicationdetails}
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Have you ever self-harmed, had suicidal thoughts or attempted suicide?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.selfHarmcon === true, onChange: () => setValues((pre) => ({ ...pre, selfHarmcon: true })) },
                                                    { label: 'No', value: false, checked: values.selfHarmcon === false, onChange: () => setValues((pre) => ({ ...pre, selfHarmcon: false })), defaultChecked: true }
                                                ]}
                                                name='selfHarmcon'
                                                value={values.selfHarmcon}
                                            />
                                            {/* <Typography variant="subtitle1">Have you ever self-harmed, had suicidal thoughts or attempted suicide?</Typography>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Radio checked={values.selfHarmcon === true} onChange={() => setValues((pre) => ({ ...pre, selfHarmcon: true }))} name="selfHarmcon" value={true} />}
                                                    label="Yes"
                                                />
                                                <FormControlLabel
                                                    control={<Radio checked={values.selfHarmcon === false} onChange={() => setValues((pre) => ({ ...pre, selfHarmcon: false }))} name="selfHarmcon" value={false} />}
                                                    label="No"
                                                />
                                            </FormGroup> */}
                                            {values.selfHarmcon === true &&
                                                (<>
                                                    <Box sx={{ width: "100%", padding: 2 }}>
                                                        <Grid container spacing={2} direction="column">
                                                            <Grid item xs={12}>
                                                                <FlotingLableInput
                                                                    placeholder="Details"
                                                                    type="text"
                                                                    name="details"
                                                                    onChange={handleChange}
                                                                    fullWidth
                                                                    value={values?.details || ""}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <FlotingLableInput
                                                                    placeholder="When"
                                                                    type="text"
                                                                    name="when"
                                                                    onChange={handleChange}
                                                                    fullWidth
                                                                    value={values?.when || ""}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <FlotingLableInput
                                                                    placeholder="How"
                                                                    type="text"
                                                                    name="how"
                                                                    onChange={handleChange}
                                                                    fullWidth
                                                                    value={values?.how || ""}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <FlotingLableInput
                                                                    placeholder="Where"
                                                                    type="text"
                                                                    name="where"
                                                                    onChange={handleChange}
                                                                    fullWidth
                                                                    value={values?.where || ""}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </>)


                                            }
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Have you been to prison?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.prison === true, onChange: () => setValues((pre) => ({ ...pre, prison: true })) },
                                                    { label: 'No', value: false, checked: values.prison === false, onChange: () => setValues((pre) => ({ ...pre, prison: false })), defaultChecked: true }
                                                ]}
                                                name='prison'
                                                value={values.prison}
                                            />
                                            {/* <Typography variant="subtitle1">Have you been to prison?</Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Radio checked={values.prison === true} onChange={() => setValues((pre) => ({ ...pre, prison: true }))} name="prison" value={true} />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            control={<Radio checked={values.prison === false} onChange={() => setValues((pre) => ({ ...pre, prison: false }))} name="prison" value={false} />}
                                            label="No"
                                        />
                                    </FormGroup> */}
                                            {values.prison === true && (
                                                <>
                                                    <Grid flexDirection='column' container spacing={3} style={{ padding: 2 }}>
                                                        <Grid item xs={6}>
                                                            <FlotingLableInput
                                                                placeholder="when and which prison"
                                                                label="when and which prison"
                                                                type="text"
                                                                name="whenprison"
                                                                onChange={handleChange}
                                                                fullWidth
                                                                value={values?.whenprison}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FlotingLableInput
                                                                type="text"
                                                                name="reason_for_prison"
                                                                placeholder="Reason for prison sentence"
                                                                label="Reason for prison sentence"
                                                                onChange={handleChange}
                                                                fullWidth
                                                                value={values?.reason_for_prison}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FlotingLableInput
                                                                type="date"
                                                                name="release_date"
                                                                label="Last date of release:"
                                                                placeholder="Last date of release:"
                                                                onChange={handleChange}
                                                                fullWidth

                                                                value={values?.release_date}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Related under any conditions"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.related_under_condition === true, onChange: () => setValues((pre) => ({ ...pre, related_under_condition: true })) },
                                                    { label: 'No', value: false, checked: values.related_under_condition === false, onChange: () => setValues((pre) => ({ ...pre, related_under_condition: false })), defaultChecked: true }
                                                ]}
                                                name='related_under_condition'
                                                value={values.related_under_condition}
                                            />
                                            {/* <Typography variant="subtitle1">Related under any conditions</Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Radio checked={values.related_under_condition === true} onChange={() => setValues((pre) => ({ ...pre, related_under_condition: true }))} name="related_under_condition" value={true} />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            control={<Radio checked={values.related_under_condition === false} onChange={() => setValues((pre) => ({ ...pre, related_under_condition: false }))} name="related_under_condition" value={false} />}
                                            label="No"
                                        />
                                    </FormGroup> */}
                                            {values?.related_under_condition && (
                                                <>
                                                    <Grid flexDirection='column' container spacing={3} style={{ padding: 2 }}>
                                                        <Grid item xs={6}>
                                                            <FlotingLableInput
                                                                type="text" name="related_under_condition_what"
                                                                placeholder="What?"
                                                                label="What?"
                                                                onChange={handleChange}
                                                                fullWidth
                                                                value={values?.related_under_condition_what}
                                                            />

                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FlotingLableInput
                                                                type="text" name="related_under_condition_date"
                                                                placeholder="Date"
                                                                label="Date"
                                                                onChange={handleChange}
                                                                fullWidth
                                                                value={values?.related_under_condition_date}
                                                            />

                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )}


                                        </Grid>

                                        <Grid item xs={12} sm={4}>

                                            <FlotingLableInput
                                                menuItems={[
                                                    { val: "", label: "Select" },
                                                    { val: "ESA", label: "ESA" },
                                                    { val: "DLA", label: "DLA" },
                                                    { val: "JSA", label: "JSA" },
                                                    { val: "Housing Benefit", label: "Housing Benefit" }]}
                                                select
                                                name="claiming_benefits"
                                                placeholder="What benefits do you currently claim?"
                                                label="What benefits do you currently claim?"
                                                onChange={handleChange}
                                                fullWidth
                                                value={values?.claiming_benefits}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ marginTop: 4 }} />
                                    <Typography variant="h6" marginTop={4}>Drug Use</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <RadioComponent
                                                defaultValue={false}
                                                title="Do you use drugs?"
                                                direction='hor'
                                                valArr={[
                                                    { label: "Yes", value: true, checked: values.drug === true, onChange: () => setValues((pre) => ({ ...pre, drug: true })) },
                                                    { label: 'No', value: false, checked: values.drug === false, onChange: () => setValues((pre) => ({ ...pre, drug: false })), defaultChecked: true }
                                                ]}
                                                name='drug'
                                                value={values.drug}
                                            />
                                            {/* <Typography variant="subtitle1">Do you use drugs?</Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Radio checked={values?.drug === true} onChange={() => setValues((pre) => ({ ...pre, drug: true }))} name="drug" value={true} />}
                                            label="Yes"
                                        />
                                        <FormControlLabel
                                            control={<Radio checked={values?.drug === false} onChange={() => setValues((pre) => ({ ...pre, drug: false }))} name="drug" value={false} />}
                                            label="No"
                                        />
                                    </FormGroup> */}
                                        </Grid>
                                        {values?.drug && (
                                            <Grid container spacing={1} flexDirection='column'>
                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        type="text"
                                                        name="drug_user"
                                                        placeholder="What drugs do you use?"
                                                        label="What drugs do you use?"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.drug_user}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        menuItems={[
                                                            { val: "Oral", label: "Oral" },
                                                            { val: "Smoking", label: "Smoking" },
                                                            { val: "Injection", label: "Injection" },
                                                            { val: "Snorting", label: "Snorting" },
                                                        ]}
                                                        select
                                                        name="method_of_administration"
                                                        placeholder="Method of administration"
                                                        label="Method of administration"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.method_of_administration}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        type="text"
                                                        name="injection_body_part"
                                                        placeholder="If injection, which part of the body is injected?"
                                                        label="If injection, which part of the body is injected?"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.injection_body_part}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        type="text"
                                                        name="administered"
                                                        placeholder="How is it administered? (e.g., snort, inject, smoke)"
                                                        label="How is it administered?"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.administered}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        type="text"
                                                        name="drug_worker"
                                                        placeholder="Details of drug worker (company, name, contact, prescription info)"
                                                        label="Do you have a drug worker? If so, provide details"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.drug_worker}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FlotingLableInput
                                                        type="text"
                                                        name="drug_team"
                                                        placeholder="Location of drugs team"
                                                        label="Location of drugs team"
                                                        onChange={handleChange}
                                                        fullWidth
                                                        value={values?.drug_team}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>
                                    <Divider sx={{ marginTop: 4 }} />
                                    <Typography variant="h6" marginTop={4}>Support Plan Choice (ACHIEVE ECONOMIC WELLBEING)</Typography>
                                    <Grid container spacing={2} marginTop={2}>
                                        {supportPlanChoices.map((choice) => (
                                            <Grid item xs={12} sm={6} key={choice.name}>
                                                <Typography variant="subtitle1">{choice.label}</Typography>
                                                <TextField
                                                    name={choice.name}
                                                    select
                                                    fullWidth
                                                    value={values[choice.name] || "No"}
                                                    onChange={(e) => { handleChange(e) }}
                                                >
                                                    <MenuItem value="No">No</MenuItem>
                                                    <MenuItem value="Yes">Yes</MenuItem>

                                                </TextField>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Divider sx={{ marginTop: 4 }} />
                                    <Typography variant="h6" marginTop={4}>Support Plan Choice (BE HEALTHY)</Typography>
                                    <Grid container spacing={2} marginTop={2}>
                                        {beHealthyChoices.map((choice) => (
                                            <Grid item xs={12} sm={6} key={choice.name}>
                                                <Typography variant="subtitle1">{choice.label}</Typography>
                                                <TextField
                                                    name={choice.name}
                                                    // as={TextField}
                                                    select
                                                    fullWidth
                                                    value={values[choice.name] || "No"}
                                                    onChange={(e) => { handleChange(e) }}
                                                >
                                                    <MenuItem value="No">No</MenuItem>
                                                    <MenuItem value="Yes">Yes</MenuItem>

                                                </TextField>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Divider sx={{ marginTop: 4 }} />
                                    <Typography variant="h6" marginTop={4}>Support Plan Choice (ENJOY AND ACHIEVE)</Typography>
                                    <Grid container spacing={2} marginTop={2}>
                                        {enjoyAndAchieveChoices.map((choice) => (
                                            <Grid item xs={12} sm={6} key={choice.name}>
                                                <Typography variant="subtitle1">{choice.label}</Typography>
                                                <TextField
                                                    name={choice.name}
                                                    // as={TextField}
                                                    select
                                                    fullWidth
                                                    value={values[choice.name] || "No"}
                                                    onChange={(e) => { handleChange(e) }}
                                                >
                                                    <MenuItem value="No">No</MenuItem>
                                                    <MenuItem value="Yes">Yes</MenuItem>

                                                </TextField>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Divider sx={{ marginTop: 4 }} />
                                    <Typography variant="h6" marginTop={4}>Support Plan Choice (MAKING A POSITIVE CONTRIBUTION)</Typography>
                                    <Grid container spacing={2} marginTop={2}>
                                        {makingContributionChoices.map((choice) => (
                                            <Grid item xs={12} sm={4} key={choice.name}>
                                                <Typography variant="subtitle1">{choice.label}</Typography>
                                                <TextField
                                                    name={choice.name}
                                                    // as={TextField}
                                                    select
                                                    fullWidth
                                                    value={values[choice.name] || "No"}
                                                    onChange={(e) => { handleChange(e) }}
                                                >
                                                    <MenuItem value="No">No</MenuItem>
                                                    <MenuItem value="Yes">Yes</MenuItem>

                                                </TextField>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Divider sx={{ marginTop: 4 }} />

                                    {/* Support Plan Choice (Stay Safe) */}
                                    <Typography variant="h6" marginTop={4}>Support Plan Choice (STAY SAFE)</Typography>
                                    <Grid container spacing={2} marginTop={2}>
                                        {staySafeChoices.map((choice) => (
                                            <Grid item xs={12} sm={4} key={choice.name}>
                                                <Typography variant="subtitle1">{choice.label}</Typography>
                                                <TextField
                                                    name={choice.name}
                                                    select
                                                    fullWidth
                                                    value={values[choice.name] || "No"}
                                                    onChange={(e) => { handleChange(e) }}
                                                >
                                                    <MenuItem value="No">No</MenuItem>
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                </TextField>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Typography variant="h6" marginTop={4}>Risk Assessment</Typography>
                                    <Divider sx={{ marginTop: 4 }} />
                                    {riskCategories.map((category) => (
                                        <Box key={category.name} marginBottom={4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        // name={category.name}
                                                        // checked={values?.riskCategories[category.name]}
                                                        name={`${category?.name}`}
                                                        checked={values?.categories[`${category?.name}`] || false}
                                                        onChange={(e) => {
                                                            // handleChange(e)
                                                            if (e.target.checked) {
                                                                setFieldValue(`categories.${category?.name}`, true)
                                                            } else {
                                                                setFieldValue(`categories.${category?.name}`, false)
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={category.label}
                                            />

                                        </Box>
                                    ))}


                                    <RadioComponent
                                        defaultValue={false}
                                        title="Other"
                                        direction='hor'
                                        valArr={[
                                            { label: "Yes", value: true, checked: values.isotherRisk === true, onChange: () => setValues((pre) => ({ ...pre, isotherRisk: true })) },
                                            { label: 'No', value: false, checked: values.isotherRisk === false, onChange: () => setValues((pre) => ({ ...pre, isotherRisk: false })), defaultChecked: true }
                                        ]}
                                        name='isotherRisk'
                                        value={values.isotherRisk}
                                    />
                                    {values.isotherRisk && <>
                                        <Grid container>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    name="otherRisk"
                                                    fullWidth
                                                    margin="normal"
                                                    value={values?.otherRisk || ''}
                                                    onChange={(e) => { handleChange(e) }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                    }
                                    <Grid container flexDirection='column'>
                                        <Grid item xs={12} sm={4}>
                                            <FlotingLableInput
                                                type="textarea"
                                                name="interim_risk_review_details"
                                                placeholder="INTERIM RISK REVIEW DETAILS"
                                                label="INTERIM RISK REVIEW DETAILS"
                                                onChange={handleChange}
                                                fullWidth
                                                value={values?.interim_risk_review_details}
                                            />
                                        </Grid>
                                    </Grid>


                                    <Typography variant="h6" marginTop={4}>Risk Assessment</Typography>
                                    <Divider sx={{ marginTop: 1 }} />
                                    <Box sx={{ padding: 2 }}>
                                        <RadioComponent
                                            defaultValue={false}
                                            title=" Family Support"
                                            direction='hor'
                                            valArr={[
                                                { label: "Yes", value: true, checked: values.family_support === true, onChange: () => setValues((pre) => ({ ...pre, family_support: true })) },
                                                { label: 'No', value: false, checked: values.family_support === false, onChange: () => setValues((pre) => ({ ...pre, family_support: false })), defaultChecked: true }
                                            ]}
                                            name='family_support'
                                            value={values.family_support}
                                        />



                                        {values.family_support && (
                                            <Box sx={{ marginTop: 2 }}>
                                                <Grid container flexDirection='column' spacing={2}>
                                                    {/* Who Supports Family */}
                                                    <Grid item xs={12} md={6}>
                                                        <FlotingLableInput
                                                            type="text"
                                                            name="family_support_who"
                                                            placeholder="Who?"
                                                            label="Who supports the family?"
                                                            value={values.family_support_who}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        />
                                                    </Grid>

                                                    {/* Level of Family Support */}
                                                    <Grid item xs={12} md={6}>
                                                        <FlotingLableInput
                                                            select
                                                            name="family_support_level"
                                                            label="Level of family support"
                                                            placeholder="Select level"
                                                            menuItems={[
                                                                { val: "Daily", label: "Daily" },
                                                                { val: "Weekly", label: "Weekly" },
                                                                { val: "Monthly", label: "Monthly" },
                                                                { val: "Rarely", label: "Rarely" },
                                                            ]}
                                                            value={values.family_support_level}
                                                            onChange={handleChange}
                                                            fullWidth
                                                        />
                                                    </Grid>

                                                    {/* Why Family Support */}
                                                    <Grid item xs={12} md={6}>
                                                        <FlotingLableInput
                                                            type="text"
                                                            name="family_support_why"
                                                            placeholder="Why?"
                                                            label="Why is family support needed?"
                                                            value={values.family_support_why}
                                                            onChange={(e) => handleChange(e)}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}
                                    </Box>
                                    {['6766bedbffa321615627cecf'].includes(prevValues?.rsl) && <Box width={{ xs: "100%", md: "80%", lg: "50%" }} my={4}>
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    padding: 2,
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    borderTopLeftRadius: 8,
                                                    borderTopRightRadius: 8,
                                                }}
                                            >
                                                Tenant Induction Checklist
                                            </Typography>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: "grey.100" }}>
                                                        <TableCell
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: "text.primary",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            #
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: "text.primary",
                                                            }}
                                                        >
                                                            Description
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: "text.primary",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Date
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                fontWeight: "bold",
                                                                color: "text.primary",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Agree
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {checklistData.map((item) => (
                                                        <TableRow key={item.id} hover>
                                                            <TableCell
                                                                align="center"
                                                                sx={{ fontWeight: "bold", color: "text.secondary" }}
                                                            >
                                                                {item.id}
                                                            </TableCell>
                                                            <TableCell sx={{ wordBreak: 'break-word' }}>
                                                                {item.description}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {getDate(sd)}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    checked={values?.checklist?.[item.id] || false} // Ensure proper default value
                                                                    onChange={(e) =>
                                                                        setValues((prev) => ({
                                                                            ...prev,
                                                                            checklist: {
                                                                                ...prev.checklist,
                                                                                [item.id]: e.target.checked, // Correct syntax for dynamic keys
                                                                            },
                                                                        }))
                                                                    }
                                                                    name={`checklist[${item.id}]`}
                                                                    sx={{
                                                                        "&.Mui-checked": {
                                                                            color: "primary.main",
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>}
                                    <Grid container spacing={2} alignItems="flex-start" sx={{ mt: 2 }} >
                                        <Grid alignItems="flex-start" justifyContent='flex-start' item xs={6} md={4}>

                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 2 }}>
                                                    Support Worker Signature
                                                </Typography>
                                                <SignatureCanvas value={values?.supportWorkerSignature} name='supportWorkerSignature' setFieldValue={setFieldValue} onSave={(sign) => setFieldValue('supportWorkerSignature', sign)} />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6} md={4}>
                                            <Typography variant="h6">Tenant Signature</Typography>
                                            <Box flexDirection='column' my={1}>
                                                <Typography variant='p'>I confirm that all the information provided is true to my knowledge and agree to follow a program of support based on this assessment</Typography>
                                            </Box>
                                            <Box>
                                                <SignatureCanvas value={values?.tenantSignature} name='tenantSignature' setFieldValue={setFieldValue} onSave={(sign) => setFieldValue('tenantSignature', sign)} />
                                            </Box>
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

                                </Grid>

                            </Box >
                        </Form>
                    )
                }}

            </Formik >


        </>

    );
};

export default Assessment 