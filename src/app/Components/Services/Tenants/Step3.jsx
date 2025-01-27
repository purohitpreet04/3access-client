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
import { ArrayforotherDetails, beHealthyChoices, enjoyAndAchieveChoices, makingContributionChoices, riskCategories, signaturearray, staffuser, staySafeChoices, supportNeedsOptions, supportPlanChoices } from '@app/Utils/constant';
import RadioComponent from '@app/CommonComponents/RadioComponent';
import * as Yup from 'yup'
import { TenantDetails } from '..';
import SignatureCanvas from '@app/CommonComponents/SignatureCanvas';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import { CheckBox } from '@mui/icons-material';
import moment from 'moment';


const Step3 = ({ nextStep, prevValues, backStep, setPreValues }) => {

    const validationSchema = Yup.object({
        source_of_income: Yup.string().required('Source of income is required'),
        total_amount: Yup.number().typeError('Total amount must be a number').positive('Total amount must be positive').required('Total amount is required'),
    });


    return (
        <Formik
            initialValues={{ ...prevValues }}
            // validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setPreValues((pre) => ({ ...pre, ...values, ...prevValues }))
                // console.log(values)
                nextStep()
            }}
        >
            {({ isSubmitting, values, setFieldValue, handleSubmit, setValues, handleChange, errors }) => {
                const tenetPartnerArray = [{ val: 'CL', label: `${values?.firstName} ${values?.lastName}` }, { val: 'both', label: 'BOTH' },]
                return (
                    <Form>
                        <Box>
                            <Typography variant="h5" mb={3} align="left">Details about your past activity</Typography>
                            {/* Add Other Info fields here */}
                            <Grid flexDirection='column' p={2} spacing={2} xs={12} sm={12} md={12} container >
                                <Grid item xs={6} >
                                    <RadioComponent
                                        title='Did you move here in the last 12 months?' name='moveInLast12Months'
                                        direction='ver'
                                        valArr={[
                                            { label: 'Yes', value: true, checked: values.moveInLast12Months === true, onChange: () => setValues((pre) => ({ ...pre, moveInLast12Months: true })) },
                                            { label: 'No', value: false, checked: values.moveInLast12Months === false, onChange: () => setValues((pre) => ({ ...pre, moveInLast12Months: false })) }
                                        ]}

                                        value={values.moveInLast12Months}
                                    />
                                </Grid>
                                {values?.moveInLast12Months === true && <>
                                    <Grid item xs={6}>
                                        <FlotingLableInput
                                            name="address"
                                            label="Previous Address"
                                            type="text"
                                            required
                                            fullWidth
                                            value={values?.address}
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FlotingLableInput
                                            name="pincode"
                                            label="Post Code"
                                            type="text"
                                            required
                                            fullWidth
                                            value={values?.pincode}
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FlotingLableInput
                                            name="city"
                                            label="City"
                                            type="text"
                                            required
                                            fullWidth
                                            value={values?.city}
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FlotingLableInput
                                            select
                                            name="tenancy_type"
                                            label="What was your tenancy type at your previous address?"
                                            // type="text"
                                            required
                                            fullWidth
                                            value={values?.tenancy_type}
                                            menuItems={[
                                                { val: "CL", label: "A home owner" },
                                                { val: "PT", label: "A private tenant" },
                                                { val: "CT", label: "A council tenant" },
                                                { val: "HA", label: "A housing association tenant" },
                                                { val: "LWP", label: "Living with parents" },
                                                { val: "LD", label: "A lodger" },
                                                { val: "OTR", label: "Other" },
                                            ]}
                                            onChange={(e) => { handleChange(e) }}
                                        />
                                    </Grid>
                                </>}
                                <Grid item xs={6} >
                                    <RadioComponent
                                        title='Have you entered the United Kingdom in the last 2 years?'
                                        name='visitedUk'
                                        direction='ver'
                                        valArr={[
                                            { label: 'Yes', value: true, checked: values.visitedUk === true, onChange: () => setValues((pre) => ({ ...pre, visitedUk: true })) },
                                            { label: 'No', value: false, checked: values.visitedUk === false, onChange: () => setValues((pre) => ({ ...pre, visitedUk: false })) }
                                        ]}

                                        value={values.visitedUk}
                                    />

                                </Grid>
                                {values?.visitedUk === true && <Grid item xs={6}>
                                    <FlotingLableInput
                                        name="ukvisitedDate"
                                        label="What date did you enter the United Kingdom?"
                                        type="date"
                                        required
                                        fullWidth
                                        value={values?.ukvisitedDate}
                                        onChange={(e) => { handleChange(e) }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            max: new Date().toISOString().split('T')[0],
                                        }}
                                    />
                                </Grid>}

                                <Grid item xs={6} >
                                    <RadioComponent
                                        title='Do you have a partner living with you?'
                                        name='ispartnerlivingwithyou'
                                        direction='ver'
                                        valArr={[
                                            { label: 'Yes', value: true, checked: values.ispartnerlivingwithyou === true, onChange: () => setValues((pre) => ({ ...pre, ispartnerlivingwithyou: true })) },
                                            { label: 'No', value: false, checked: values.ispartnerlivingwithyou === false, onChange: () => setValues((pre) => ({ ...pre, ispartnerlivingwithyou: false })) }
                                        ]}

                                        value={values.ispartnerlivingwithyou}
                                    />

                                </Grid>
                                {values?.ispartnerlivingwithyou === true &&
                                    <>
                                        <Grid item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name="partner_title_before_name"
                                                select
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.partner_title_before_name}
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
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name="partner_firstName"
                                                fullWidth
                                                type='text'
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.partner_firstName}
                                                label="First Name"
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name="partner_middleName"
                                                type='text'
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.partner_middleName}
                                                label="Middle Name"
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name="partner_lastName"
                                                type='text'
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.partner_lastName}
                                                label="Last Name"
                                                required
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name="partner_nationalInsuranceNumber"
                                                label="National Insurance Number"
                                                type="text"
                                                required
                                                fullWidth
                                                value={values.partner_nationalInsuranceNumber}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={6} md={6}>
                                            <FlotingLableInput
                                                name="partner_dateOfBirth"
                                                label="Date of Birth (Use Calendar Only)"
                                                type="date"
                                                required
                                                fullWidth
                                                value={values?.partner_dateOfBirth}
                                                onChange={handleChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0],
                                                    disableRipple: true,
                                                    disableKeyboardInput: true,
                                                }}
                                            />
                                        </Grid>
                                    </>}



                            </Grid>
                            <Typography variant="h5" mb={3} mt={3} align="left">Other details about you and your partner</Typography>
                            <Grid p={2} spacing={2} xs={12} sm={12} md={12} container >
                                {/* grid1 */}
                                <Grid
                                    item
                                    container
                                    p={2} spacing={2} xs={6} sm={6} md={6}
                                >
                                    {ArrayforotherDetails.map(({ radio_titel, radio_name, sel_name, sel_title }) => (
                                        <>
                                            <Grid item xs={12} >
                                                <RadioComponent
                                                    title={radio_titel} name={radio_name}
                                                    direction='ver'
                                                    valArr={[
                                                        { label: 'Yes', value: true, checked: values[radio_name] === true, onChange: () => setValues((pre) => ({ ...pre, [radio_name]: true })) },
                                                        { label: 'No', value: false, checked: values[radio_name] === false, onChange: () => setValues((pre) => ({ ...pre, [radio_name]: false })) }
                                                    ]}

                                                    value={values[radio_name]}
                                                />
                                            </Grid>
                                            {values[radio_name] === true && <Grid item
                                                p={3}
                                                xs={6}
                                                sm={6}
                                                md={6}
                                            >
                                                <FlotingLableInput
                                                    name={sel_name}
                                                    default='cl'
                                                    select
                                                    fullWidth
                                                    onChange={(e) => { handleChange(e) }}
                                                    value={values[sel_name] || 'CL'}
                                                    label={sel_title}
                                                    variant="outlined"
                                                    menuItems={tenetPartnerArray}
                                                />
                                            </Grid>
                                            }
                                        </>
                                    ))}
                                </Grid>

                                {/* grid2 */}
                                <Grid
                                    item
                                    container
                                    justifyContent='flex-start'
                                    alignItems='flex-start'
                                    p={2} xs={6} sm={6} md={6}
                                >
                                    <Grid item xs={12} >
                                        <RadioComponent
                                            title='Are you or your partner a foster carer?' name='isfostercarer'
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.isfostercarer === true, onChange: () => setValues((pre) => ({ ...pre, isfostercarer: true })) },
                                                { label: 'No', value: false, checked: values.isfostercarer === false, onChange: () => setValues((pre) => ({ ...pre, isfostercarer: false })) }
                                            ]}

                                            value={values.isfostercarer}
                                        />
                                        {values?.isfostercarer === true && <Grid item
                                            p={3}
                                            xs={6}
                                            sm={6}
                                            md={6}
                                        >
                                            <FlotingLableInput
                                                name='namedfosterparent'
                                                default='cl'
                                                select
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.namedfosterparent || 'CL'}
                                                label='Who is the named foster parent?'
                                                variant="outlined"
                                                menuItems={tenetPartnerArray}
                                            />
                                            <Box mt={2}>

                                                <RadioComponent

                                                    title='Do you require an additional room to provide for a foster child?' name='roomfroChild'
                                                    direction='ver'
                                                    valArr={[
                                                        { label: 'Yes', value: true, checked: values.roomfroChild === true, onChange: () => setValues((pre) => ({ ...pre, roomfroChild: true })) },
                                                        { label: 'No', value: false, checked: values.roomfroChild === false, onChange: () => setValues((pre) => ({ ...pre, roomfroChild: false })) }
                                                    ]}

                                                    value={values.roomfroChild}
                                                />
                                            </Box>
                                        </Grid>
                                        }

                                    </Grid>

                                    <Grid item xs={12} >
                                        <RadioComponent
                                            title='Are you or your partner currently absent from home?' name='isabsentathome'
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.isabsentathome === true, onChange: () => setValues((pre) => ({ ...pre, isabsentathome: true })) },
                                                { label: 'No', value: false, checked: values.isabsentathome === false, onChange: () => setValues((pre) => ({ ...pre, isabsentathome: false })) }
                                            ]}

                                            value={values.isabsentathome}
                                        />

                                        {values?.isabsentathome === true &&
                                            <Box>
                                                <Grid flexDirection='column' p={2} spacing={2} xs={12} sm={12} md={12} container >
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="absenceReason"
                                                            label="What is the reason for this?"
                                                            type="textarea"
                                                            onChange={(e) => { handleChange(e) }}
                                                            fullWidth
                                                            value={values.absenceReason}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="absenceStartDate"
                                                            label="What date did this absence start?"
                                                            type="date"
                                                            required
                                                            fullWidth
                                                            value={values.absenceStartDate}
                                                            onChange={handleChange}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            label='Do you intend to return home?'
                                                            onChange={handleChange}
                                                            type='text'
                                                            fullWidth
                                                            name='intendToReturn'
                                                            value={values.intendToReturn}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            label='Will the home be let or sublet during your absence?'
                                                            onChange={handleChange}
                                                            type='text'
                                                            fullWidth
                                                            name='subletStatus'
                                                            value={values.subletStatus}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FlotingLableInput
                                                            name="absenceDuration"
                                                            label="Is it likely that your absence from your normal home will be more than 52 weeks?"
                                                            type="textarea"
                                                            onChange={(e) => { handleChange(e) }}
                                                            fullWidth
                                                            value={values.absenceDuration}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        }

                                    </Grid>

                                    <Grid xs={12} sm={12} md={12} item >
                                        {/* <Grid item xs={12}> */}
                                        <RadioComponent
                                            title='Have you or your partner claimed Housing Benefit or Council Tax Support before?'
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.hasClaimed === true, onChange: () => setValues((pre) => ({ ...pre, hasClaimed: true })) },
                                                { label: 'No', value: false, checked: values.hasClaimed === false, onChange: () => setValues((pre) => ({ ...pre, hasClaimed: false })) }
                                            ]}
                                            name='hasClaimed'
                                            value={values.hasClaimed}
                                        />
                                        {/* </Grid> */}
                                        {values.hasClaimed && ( // Show fields only if "Yes" is selected
                                            <Grid flexDirection='column' p={2} spacing={2} xs={12} sm={12} md={12} container>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="dateLastClaimed"
                                                        label="Date you last claimed (optional)"
                                                        type="date"
                                                        fullWidth
                                                        value={values.dateLastClaimed}
                                                        onChange={handleChange}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}

                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="lastNameClaimed"
                                                        label="Last name used in the claim"
                                                        type="text"
                                                        fullWidth
                                                        value={values.lastNameClaimed}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="localAuthority"
                                                        label="The local authority (council) that the claim was made to (optional)"
                                                        type="text"
                                                        fullWidth
                                                        value={values.localAuthority}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="previousClaimReference"
                                                        label="Previous claim reference (optional)"
                                                        type="text"
                                                        fullWidth
                                                        value={values.previousClaimReference}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid item spacing={2} xs={12} sm={12} md={12} >
                                        <Grid item xs={12}>
                                            <RadioComponent
                                                title='Are you or your partner due to receive or likely to have a change in earned income in the next 6 months?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.incomeChange === true, onChange: () => setValues((pre) => ({ ...pre, incomeChange: true })) },
                                                    { label: 'No', value: false, checked: values.incomeChange === false, onChange: () => setValues((pre) => ({ ...pre, incomeChange: false })) }
                                                ]}
                                                name='incomeChange'
                                                value={values.incomeChange}
                                            />
                                        </Grid>
                                        {values.incomeChange && ( // Show field only if "Yes" is selected
                                            <Grid item xs={12}>
                                                <FlotingLableInput
                                                    name="incomeChangeDetails"
                                                    label="Give details of the income, the likely date of change, the amount and whether this is yours or your partner’s income."
                                                    type="textarea"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.incomeChangeDetails}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid item spacing={2} xs={12} sm={12} md={12} >
                                        <Grid item xs={12}>
                                            <RadioComponent
                                                title='Are you or your partner due to receive or likely to have a change in unearned or other income in the next 6 months?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.unearnedIncomeChange === true, onChange: () => setValues((pre) => ({ ...pre, unearnedIncomeChange: true })) },
                                                    { label: 'No', value: false, checked: values.unearnedIncomeChange === false, onChange: () => setValues((pre) => ({ ...pre, unearnedIncomeChange: false })) }
                                                ]}
                                                name='unearnedIncomeChange'
                                                value={values.unearnedIncomeChange}
                                            />
                                        </Grid>
                                        {values.unearnedIncomeChange && ( // Show field only if "Yes" is selected
                                            <Grid item xs={12}>
                                                <FlotingLableInput
                                                    name="unearnedIncomeChangeDetails"
                                                    label="Give details of the income, the likely date of change, the amount and whether this is yours or your partner’s income."
                                                    type="textarea"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.unearnedIncomeChangeDetails}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid item spacing={2} xs={12} sm={12} md={12} >
                                        <Grid item xs={12}>
                                            <RadioComponent
                                                title='Are you or your partner due to receive or likely to have a change in capital or savings in the next 6 months?'
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.capitalChange === true, onChange: () => setValues((pre) => ({ ...pre, capitalChange: true })) },
                                                    { label: 'No', value: false, checked: values.capitalChange === false, onChange: () => setValues((pre) => ({ ...pre, capitalChange: false })) }
                                                ]}
                                                name='capitalChange'
                                                value={values.capitalChange}
                                            />
                                        </Grid>
                                        {values.capitalChange && ( // Show field only if "Yes" is selected
                                            <Grid item xs={12}>
                                                <FlotingLableInput
                                                    name="capitalChangeDetails"
                                                    label="Give details of the change."
                                                    type="textarea"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.capitalChangeDetails}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid spacing={2} xs={12} sm={12} md={12} item >
                                        <Grid item xs={12}>
                                            <RadioComponent
                                                title="Is yours or your partner’s expenses likely to change in the next 6 months?"
                                                direction='ver'
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.expensesChange === true, onChange: () => setValues((pre) => ({ ...pre, expensesChange: true })) },
                                                    { label: 'No', value: false, checked: values.expensesChange === false, onChange: () => setValues((pre) => ({ ...pre, expensesChange: false })) }
                                                ]}
                                                name='expensesChange'
                                                value={values.expensesChange}
                                            />
                                        </Grid>
                                        {values.expensesChange && ( // Show field only if "Yes" is selected
                                            <Grid item xs={12}>
                                                <FlotingLableInput
                                                    name="expensesChangeDetails"
                                                    label="Give details of the change."
                                                    type="textarea"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.expensesChangeDetails}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>


                                </Grid>
                            </Grid>

                            <Typography variant="h5" mb={3} mt={3} align="left">Some other personal details</Typography>
                            {/* <Grid p={2} spacing={2} xs={12} sm={12} md={12} container > */}
                            <Grid p={2} spacing={2} xs={12} sm={12} md={12} container >
                                <Grid xs={6} sm={6} md={6} item>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Have you or a member of your family had a recent bereavement or separation?"
                                            direction="ver"
                                            onChange={(e) => { handleChange(e) }}
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.bereavement === true, onChange: () => setValues((pre) => ({ ...pre, bereavement: true })) },
                                                { label: 'No', value: false, checked: values.bereavement === false, onChange: () => setValues((pre) => ({ ...pre, bereavement: false })) },
                                            ]}
                                            name="bereavement"
                                            value={values.bereavement}
                                        />
                                        {values?.bereavement === true && (
                                            // <Grid item xs={12}>
                                            <FlotingLableInput
                                                name="bereavementDetails"
                                                placeholder="Give details of this bereavement or separation including the date, who died and the relationship of this person to you or your family member."
                                                label="Give details of this bereavement or separation including the date, who died and the relationship of this person to you or your family member."
                                                multiline
                                                rows={4}
                                                type='textarea'
                                                fullWidth
                                                onChange={(e) => { handleChange(e) }}
                                                variant="outlined"
                                                value={values.bereavementDetails}
                                            />
                                            // </Grid>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item xs={12}>
                                            <RadioComponent
                                                title="Is there anything else about your circumstances that may be relevant to this claim?"
                                                direction="ver"
                                                valArr={[
                                                    { label: 'Yes', value: true, checked: values.relevantCircumstances === true, onChange: () => { setValues((pre) => ({ ...pre, relevantCircumstances: true })) } },
                                                    { label: 'No', value: false, checked: values.relevantCircumstances === false, onChange: () => setValues((pre) => ({ ...pre, relevantCircumstances: false })) },
                                                ]}
                                                name="relevantCircumstances"
                                                onChange={(e) => { handleChange(e) }}
                                                value={values?.relevantCircumstances}
                                            />
                                        </Grid>
                                        {values?.relevantCircumstances === true && (
                                            <Grid item xs={12}>
                                                <FlotingLableInput
                                                    name="relevantCircumstancesDetails"
                                                    label="Give details"
                                                    type="textarea"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={values.relevantCircumstancesDetails}
                                                    onChange={(e) => handleChange(e)}
                                                    inputProps={{ style: { height: '100px' } }}
                                                />
                                            </Grid>
                                        )}

                                    </Grid>

                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Could you or a member of your family afford the rent when you first moved to the property?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.affordProperty === true, onChange: () => { setValues((pre) => ({ ...pre, affordProperty: true })) } },
                                                { label: 'No', value: false, checked: values.affordProperty === false, onChange: () => setValues((pre) => ({ ...pre, affordProperty: false })) },
                                            ]}
                                            name="affordProperty"
                                            onChange={(e) => { handleChange(e) }}
                                            value={values?.affordProperty}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Could you or a member of your family afford the rent when you first moved to the property?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.afford_rent === true, onChange: () => { setValues((pre) => ({ ...pre, afford_rent: true })) } },
                                                { label: 'No', value: false, checked: values.afford_rent === false, onChange: () => setValues((pre) => ({ ...pre, afford_rent: false })) },
                                            ]}
                                            name="afford_rent"
                                            onChange={(e) => { handleChange(e) }}
                                            value={values?.afford_rent}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Are you an ex-offender subject to a multi-agency protection plan?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.exoffender === true, onChange: () => { setValues((pre) => ({ ...pre, exoffender: true })) } },
                                                { label: 'No', value: false, checked: values.exoffender === false, onChange: () => setValues((pre) => ({ ...pre, exoffender: false })) },
                                            ]}
                                            name="affordProperty"
                                            onChange={(e) => { handleChange(e) }}
                                            value={values?.exoffender}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Have you been living in homeless hostels for more than 3 months and have been supported to recover and resettle due to alcohol or drug abuse or mental health problems?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.homelessHostelSupport === true, onChange: () => { setValues((pre) => ({ ...pre, homelessHostelSupport: true })) } },
                                                { label: 'No', value: false, checked: values.homelessHostelSupport === false, onChange: () => setValues((pre) => ({ ...pre, homelessHostelSupport: false })) },
                                            ]}
                                            name="homelessHostelSupport"
                                            onChange={(e) => { handleChange(e) }}
                                            value={values?.exoffender}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Do You have Next Kin Informations?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.hasNextOfKin === true, onChange: () => setValues((pre) => ({ ...pre, hasNextOfKin: true })) },
                                                { label: 'No', value: false, checked: values.hasNextOfKin === false, onChange: () => setValues((pre) => ({ ...pre, hasNextOfKin: false })) },
                                            ]}
                                            name="hasNextOfKin"
                                            value={values.hasNextOfKin}
                                        />
                                        {values.hasNextOfKin === true && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinName"
                                                        label="Name"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinName}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinAddress"
                                                        label="Address"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinAddress}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinContactNo"
                                                        label="Contact No"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinContactNo}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinRelation"
                                                        label="Relation"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinRelation}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinOtherContact"
                                                        label="Any Other Relevant Contact"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinOtherContact}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="nextOfKinVisitDetails"
                                                        label="Details of Area to Visit"
                                                        type="textarea"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.nextOfKinVisitDetails}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Do You have GP Informations?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.hasGPInfo === true, onChange: () => setValues((pre) => ({ ...pre, hasGPInfo: true })) },
                                                { label: 'No', value: false, checked: values.hasGPInfo === false, onChange: () => setValues((pre) => ({ ...pre, hasGPInfo: false })), defaultChecked: true },
                                            ]}
                                            name="hasGPInfo"
                                            value={values.hasGPInfo}
                                        />
                                        {values.hasGPInfo === true && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="gpDetails"
                                                        label="GP details"
                                                        type="textarea"

                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.gpDetails}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="medicationNeeds"
                                                        label="Need/Medication"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.medicationNeeds}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid container item xs={12}>
                                        <RadioComponent
                                            title="Do you Require Nil income form?"
                                            direction="ver"
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.nillIncome === true, onChange: () => { setValues((pre) => ({ ...pre, nillIncome: true })) } },
                                                { label: 'No', value: false, checked: values.nillIncome === false, onChange: () => setValues((pre) => ({ ...pre, nillIncome: false })), defaultChecked: true },
                                            ]}
                                            name="nillIncome"
                                            onChange={(e) => { handleChange(e) }}
                                            value={values?.nillIncome}
                                        />
                                        {values?.nillIncome === true && (
                                            <Grid p={2} spacing={2} item container xs={12}>
                                                {/* <Grid spacing={2} item xs={12}> */}
                                                <Grid item xs={12}>
                                                    <RadioComponent
                                                        title="If this form has been filled in by someone other than another person claiming, please state why?"
                                                        direction="ver"
                                                        valArr={[
                                                            { label: 'Yes', value: true, checked: values.nillIncomeFormFilledByOther === true, onChange: () => { setValues((pre) => ({ ...pre, nillIncomeFormFilledByOther: true })) } },
                                                            { label: 'No', value: false, checked: values.nillIncomeFormFilledByOther === false, onChange: () => setValues((pre) => ({ ...pre, nillIncomeFormFilledByOther: false })), defaultChecked: true },
                                                        ]}
                                                        name="nillIncomeFormFilledByOther"
                                                        onChange={(e) => { handleChange(e) }}
                                                        value={values?.nillIncomeFormFilledByOther}
                                                    />
                                                </Grid>
                                                {values?.nillIncomeFormFilledByOther && (
                                                    <Grid p={3} container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <FlotingLableInput
                                                                name="relationship"
                                                                label="Relationship"
                                                                type="text"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={values.relationship}
                                                                onChange={(e) => handleChange(e)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <FlotingLableInput
                                                                name="reason"
                                                                label="Reason"
                                                                type="textarea"
                                                                multiline
                                                                rows={4}
                                                                fullWidth
                                                                variant="outlined"
                                                                value={values.reason}
                                                                onChange={(e) => handleChange(e)}
                                                            />
                                                        </Grid>

                                                    </Grid>
                                                )}
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="from"
                                                        label="From"
                                                        type="date"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.from}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        // inputProps={{
                                                        //     max: new Date().toISOString().split('T')[0],
                                                        // }}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="to"
                                                        label="To"
                                                        type="date"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.to}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        onChange={(e) => handleChange(e)}
                                                    // inputProps={{
                                                    //     max: new Date().toISOString().split('T')[0],
                                                    // }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="noOfSavings"
                                                        label="No of savings"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.noOfSavings}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        I manage to support myself by:
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        select
                                                        name="borrowingMoneyFromFamily"
                                                        label="Borrowing money from family"
                                                        type="select"
                                                        fullWidth
                                                        variant="outlined"

                                                        value={values.borrowingMoneyFromFamily}
                                                        onChange={(e) => handleChange(e)}
                                                        menuItems={[
                                                            { val: 'no', label: 'No' },
                                                            { val: 'yes', label: 'Yes' },
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="borrowingMoneyFromFriends"
                                                        label="Borrowing money from friends"
                                                        type="select"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.borrowingMoneyFromFriends}
                                                        select
                                                        onChange={(e) => handleChange(e)}
                                                        menuItems={[
                                                            { val: 'no', label: 'No' },
                                                            { val: 'yes', label: 'Yes' },
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="usingMySavings"
                                                        label="Using my savings"
                                                        type="select"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.usingMySavings}
                                                        select
                                                        onChange={(e) => handleChange(e)}
                                                        menuItems={[
                                                            { val: 'no', label: 'No' },
                                                            { val: 'yes', label: 'Yes' },
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="childTaxCredit"
                                                        label="Child Tax Credit"
                                                        type="select"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.childTaxCredit}
                                                        select
                                                        onChange={(e) => handleChange(e)}
                                                        menuItems={[
                                                            { val: 'no', label: 'No' },
                                                            { val: 'yes', label: 'Yes' },
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="otherSupport"
                                                        label="Other"
                                                        type="select"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.otherSupport}
                                                        select
                                                        onChange={(e) => handleChange(e)}
                                                        menuItems={[
                                                            { val: 'no', label: 'No' },
                                                            { val: 'yes', label: 'Yes' },
                                                        ]}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FlotingLableInput
                                                        name="additionalInformation"
                                                        label="Additional Informations"
                                                        type="textarea"

                                                        fullWidth
                                                        variant="outlined"
                                                        value={values.additionalInformation}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box flexDirection='column'>
                                                        <Typography variant='p'>Signature</Typography>
                                                    </Box>
                                                    <Box>
                                                        <SignatureCanvas name='nillincomesign' value={values?.nillincomesign} setFieldValue={setFieldValue} onSave={(dataURL) => setFieldValue('nillincomesign', dataURL)} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            // </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid xs={6} item container>
                                    {/* <Grid container xs={12} sm={12} md={12} item > */}
                                    <Grid spacing={0} item xs={12}>
                                        <RadioComponent
                                            title="Do you want the claim to be backdated to an earlier date?"
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.early_date === true, onChange: () => setValues((pre) => ({ ...pre, early_date: true })) },
                                                { label: 'No', value: false, checked: values.early_date === false, onChange: () => setValues((pre) => ({ ...pre, early_date: false })), defaultChecked: true }
                                            ]}
                                            name='early_date'
                                            value={values.early_date}
                                        />
                                    </Grid>
                                    {values?.early_date && ( // Show field only if "Yes" is selected
                                        <Grid container p={2} spacing={0} item xs={12}>
                                            <Grid xs={12} item>
                                                <FlotingLableInput
                                                    name="claim_start_date"
                                                    label="What date do you want the claim to start from?"
                                                    type="date"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.claim_start_date}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                            </Grid>
                                            <Grid xs={12} item>
                                                <RadioComponent
                                                    title="Were your circumstances the same as they are now?"
                                                    direction='ver'
                                                    valArr={[
                                                        { label: 'Yes', value: true, checked: values.circumstances_the_same === true, onChange: () => setValues((pre) => ({ ...pre, circumstances_the_same: true })) },
                                                        { label: 'No', value: false, checked: values.circumstances_the_same === false, onChange: () => setValues((pre) => ({ ...pre, circumstances_the_same: false })), defaultChecked: true }
                                                    ]}
                                                    name='circumstances_the_same'
                                                    value={values.circumstances_the_same}
                                                />
                                            </Grid>
                                            <Grid xs={12} item>
                                                <FlotingLableInput
                                                    name="circumstances_2_details"
                                                    label="Why did you not make your claim earlier? Give details"
                                                    type="textarea"
                                                    onChange={(e) => { handleChange(e) }}
                                                    fullWidth
                                                    value={values.circumstances_2_details}

                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <FlotingLableInput
                                            name="other_charges_of_tenant"
                                            label="Other Charges (Personal charge paid by the tenant)"
                                            type="text"
                                            onChange={(e) => { handleChange(e) }}
                                            fullWidth
                                            value={values.other_charges_of_tenant}

                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title2='Sheltered Accommodation is for over 55s with care and/or support needs (including Sheltered Accommodation with extra care)'
                                            title="Do you live in Sheltered Accommodation?"
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.circumstances_the_same === true, onChange: () => setValues((pre) => ({ ...pre, circumstances_the_same: true })) },
                                                { label: 'No', value: false, checked: values.circumstances_the_same === false, onChange: () => setValues((pre) => ({ ...pre, circumstances_the_same: false })), defaultChecked: true }
                                            ]}
                                            name='circumstances_the_same'
                                            value={values.circumstances_the_same}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FlotingLableInput
                                            name="source_of_income"
                                            label="What is your source of income? What benefits are you on?"
                                            type="text"
                                            onChange={(e) => { handleChange(e) }}
                                            fullWidth
                                            required
                                            value={values.source_of_income}
                                            error={errors}
                                            helperText={errors}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FlotingLableInput
                                            name="total_amount"
                                            label="Total Amount"
                                            type="text"
                                            onChange={(e) => { handleChange(e) }}
                                            fullWidth
                                            required
                                            value={values.total_amount}
                                            inputProps={{ inputMode: 'numeric' }}
                                            error={errors}
                                            helperText={errors}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FlotingLableInput
                                            name="how_often"
                                            label="How Often"
                                            select
                                            onChange={(e) => { handleChange(e) }}
                                            fullWidth
                                            // required
                                            value={values.how_often}
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
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Would you like to upload a Photo?"
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.photo_uploaded === true, onChange: () => setValues((pre) => ({ ...pre, photo_uploaded: true })) },
                                                { label: 'No', value: false, checked: values.photo_uploaded === false, onChange: () => setValues((pre) => ({ ...pre, photo_uploaded: false })), defaultChecked: true }
                                            ]}
                                            name='photo_uploaded'
                                            value={values?.photo_uploaded || false}
                                        />
                                        {values?.photo_uploaded && (
                                            <>
                                                <FlotingLableInput

                                                    // accept="application/pdf"
                                                    // accept="image/*"
                                                    // allowedExtensions={['image']}
                                                    allowedExtensions={['jpg', 'jpeg', 'png']}
                                                    maxSize={10} // 10MB
                                                    // required
                                                    type='file'
                                                    value={values.photo}
                                                    showPreview={true}
                                                    // onChange={(file) => { setFieldValue('bcc_form', file); }}
                                                    error={errors?.photo}
                                                    helperText={errors?.photo}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    name="photo"
                                                    label="Photo"
                                                    // type="file"
                                                    onChange={(file) => { setFieldValue("photo", file) }}
                                                    fullWidth
                                                // required
                                                // value={values.image}
                                                // InputLabelProps={{ shrink: true }}
                                                />
                                            </>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioComponent
                                            title="Would you like to upload Proof of Benefit?"
                                            direction='ver'
                                            valArr={[
                                                { label: 'Yes', value: true, checked: values.proof_of_benefit_radio === true, onChange: () => setValues((pre) => ({ ...pre, proof_of_benefit_radio: true })) },
                                                { label: 'No', value: false, checked: values.proof_of_benefit_radio === false, onChange: () => setValues((pre) => ({ ...pre, proof_of_benefit_radio: false })), defaultChecked: true }
                                            ]}
                                            name='proof_of_benefit_radio'
                                            value={values.proof_of_benefit_radio}
                                        />
                                        {values?.proof_of_benefit_radio && (
                                            <>
                                                <FlotingLableInput
                                                    name="proof_of_benefit"
                                                    label="Proof of Benefit"
                                                    type="file"
                                                    allowedExtensions={['jpg', 'jpeg', 'png']}
                                                    onChange={(file) => { setFieldValue("proof_of_benefit", file) }}
                                                    fullWidth
                                                    required

                                                    showPreview={true}
                                                    value={values.proof_of_benefit}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </>
                                        )}
                                    </Grid>
                                </Grid>
                                {/* </Grid> */}
                            </Grid>
                            {/* </Grid> */}
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
                                <Button onClick={() => handleSubmit()} variant="contained" color="primary">
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

export default Step3
