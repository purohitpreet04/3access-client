import React, { memo } from 'react';
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
} from '@mui/material';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { useFormik } from 'formik';
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
import { val } from '@app/test';

const supportNeedsOptions = [
    { label: "Tenancy failure or losing short term accommodation", name: "tenancyFailure" },
    { label: "Becoming homeless / evicted (within 28 Days)", name: "homelessnessRisk" },
    { label: "Ongoing issues with drug and alcohol", name: "substanceAbuse" },
    { label: "Ability to manage ongoing health problems", name: "healthManagement" },
    { label: "Access to local services Rough Sleeping", name: "roughSleepingServices" },
    { label: "Access to health services", name: "healthServicesAccess" },
    { label: "Improved quality of life", name: "qualityOfLifeImprovement" },
    { label: "Build an alternative support network", name: "supportNetworkBuilding" },
    { label: "Skills to eat healthily", name: "healthyEatingSkills" },
    { label: "Access voluntary services", name: "voluntaryServicesAccess" },
    { label: "Ability to manage personal hygiene", name: "personalHygieneManagement" },
    { label: "Risk of domestic abuse", name: "domesticAbuseRisk" },
    { label: "Increase social and community networks", name: "socialNetworkExpansion" },
    { label: "Frequent presentation to accident and emergency", name: "emergencyServicesUsage" },
    { label: "Unplanned hospital admissions", name: "hospitalAdmissions" },
    { label: "Reduce social isolation", name: "socialIsolationReduction" },
    { label: "Accessing drug and alcohol services", name: "substanceAbuseServices" },
    { label: "Obtaining or maintaining a suitable home", name: "suitableHomeMaintenance" },
    { label: "Getting involved in activities", name: "activityInvolvement" },
    { label: "Increased feelings of being less reliant", name: "relianceReduction" },
    { label: "Gaining and/or maintaining employment and/or education and training", name: "employmentEducationMaintenance" },
    { label: "Risk of long-term worklessness", name: "longTermWorklessnessRisk" },
    { label: "Deteriorating financial position", name: "financialPositionDeterioration" },
    { label: "Developing household skills", name: "householdSkillsDevelopment" },
    { label: "Help to find other help", name: "additionalSupportAccess" },
    { label: "Feeling more involved", name: "increasedInvolvement" },
    { label: "Risk of offending", name: "offendingRisk" },
    { label: "Risk of harm from others", name: "harmFromOthersRisk" },
    { label: "Ongoing health issues", name: "ongoingHealthIssues" },
    { label: "Ability to keep home safe & secure", name: "homeSafetySecurity" },
    { label: "Developing problem-solving skills", name: "problemSolvingSkillsDevelopment" },
    { label: "Ability to manage a healthy lifestyle", name: "healthyLifestyleManagement" },
    { label: "Developing personal competence", name: "personalCompetenceDevelopment" },
    { label: "Developing self-esteem", name: "selfEsteemDevelopment" },
    { label: "Increased feelings of being more independent", name: "increasedIndependence" },
    { label: "Ability to manage health & wellbeing", name: "healthWellbeingManagement" },
    { label: "Ability to manage money better", name: "moneyManagementImprovement" },
    { label: "Developing interpersonal skills", name: "interpersonalSkillsDevelopment" },
    { label: "Increased knowledge", name: "knowledgeIncrease" },
    { label: "Increased confidence", name: "confidenceIncrease" },
];

const supportPlanChoices = [
    { label: "Accessing benefits", name: "accessingBenefits" },
    { label: "Budgeting", name: "budgeting" },
    { label: "Reducing debt", name: "reducingDebt" },
    { label: "Learn how to shop wisely", name: "learnToShopWisely" },
    { label: "Setting up a bank/savings account", name: "settingUpAccount" },
    { label: "Recoup monies owed", name: "recoupMoniesOwed" },
];

const beHealthyChoices = [
    { label: "Better manage/improve mental health", name: "manageMentalHealth" },
    { label: "Better manage/improve physical health", name: "managePhysicalHealth" },
    { label: "Follow a healthy diet", name: "followHealthyDiet" },
    { label: "Maintain good personal hygiene", name: "maintainHygiene" },
    { label: "Reduce substance misuse (alcohol, drugs)", name: "reduceSubstanceMisuse" },
    { label: "Register with a dentist", name: "registerDentist" },
    { label: "Register with a GP", name: "registerGP" },
];

const enjoyAndAchieveChoices = [
    { label: "Access training/education", name: "accessTrainingEducation" },
    { label: "Accessing employment", name: "accessingEmployment" },
    { label: "Accessing leisure, faith or cultural activities", name: "accessingLeisure" },
    { label: "Access volunteering", name: "accessVolunteering" },
    { label: "Move on", name: "moveOn" },
    { label: "Support with equality and diversity", name: "supportEqualityDiversity" },
    { label: "To change offending behaviour", name: "change_offending_behaviour" },
    { label: "To access Support Services", name: "access_support_services" },

];

const makingContributionChoices = [
    { label: "Establishing positive support networks", name: "establishingSupportNetworks" },
    { label: "Address anti-social behaviour", name: "addressAntiSocialBehaviour" },
    { label: "Address offending behaviour", name: "addressOffendingBehaviour" },
];

const staySafeChoices = [
    { label: "Develop independent living skills", name: "developLivingSkills" },
    { label: "Maintain accommodation", name: "maintainAccommodation" },
    { label: "Minimize risk of harm", name: "minimizeRiskOfHarm" },
];
const riskCategories = [
    { label: "Violence / Aggression", name: "violenceAggression" },
    { label: "Known associates", name: "knownAssociates" }, // New
    { label: "Hazards from others (friend/family/visitors)", name: "hazardsFromOthers" }, // New
    { label: "Recent discontinuation of medication", name: "medicationDiscontinuation" }, // New
    { label: "Professional boundaries", name: "professionalBoundaries" },
    { label: "Finance / Gambling / Debt", name: "financeGamblingDebt" },
    { label: "Attempted suicide", name: "attemptedSuicide" }, // New
    { label: "Arson", name: "arson" },
    { label: "Violent ideas/acts", name: "violentIdeasActs" }, // New
    { label: "Substance abuse/alcohol misuse", name: "substanceAbuse" },
    { label: "Harm to self, others or from others/injurious behaviour", name: "harmToSelfOthers" }, // New
    { label: "Criminal/police or court involvement", name: "criminalInvolvement" }, // New
    { label: "Offending behaviour", name: "offendingBehaviour" },
    { label: "Anti-social behaviour", name: "antiSocialBehaviour" },
    { label: "Physical Health", name: "physicalHealth" },
    { label: "Mental Health", name: "mentalHealth" },
    { label: "Sex Offences", name: "sexOffences" }, // New
    { label: "Domestic Abuse", name: "domesticAbuse" }, // New
    { label: "Extreme anger and hostility", name: "extremeanger" }, // New
];

const checklistData = [
    { id: 1, description: "A Licence Agreement is in place and key points have been understood", date: "07-12-2024" },
    { id: 2, description: "Ash-Shahada HA has been introduced as the landlord and corresponding contact details have been provided", date: "07-12-2024" },
    { id: 3, description: "The role of TUK as a Managing Agent has been understood", date: "07-12-2024" },
    { id: 4, description: "A copy of the rent settings has been made available to the tenant", date: "07-12-2024" },
    { id: 5, description: "Tenant was offered a choice of accommodation", date: "07-12-2024" },
    { id: 6, description: "Tenant has been formally introduced to other tenants at the property", date: "07-12-2024" },
    { id: 7, description: "Tenant has been introduced to the support worker and has been informed that they have the right to ask for a different support worker if they are not comfortable.", date: "07-12-2024" },
    { id: 8, description: "All facilities at the property have been shown and any operating instructions for appliances have been provided", date: "07-12-2024" },
    { id: 9, description: "Code of Conduct has been understood by the tenant", date: "07-12-2024" },
    { id: 10, description: "Tenant has been made aware of emergency contact details for the Support Provider, Managing Agent and RP", date: "07-12-2024" },
    { id: 11, description: "Complaints procedure has been explained", date: "07-12-2024" },
    { id: 12, description: "Health and safety aspects have been explained, for example fire exits, fire blankets etc", date: "07-12-2024" },
    { id: 13, description: "Tenant is informed that they have a right to ask for property compliance certificates", date: "07-12-2024" },
    { id: 14, description: "Requesting repairs and maintenance work", date: "07-12-2024" },
    { id: 15, description: "Anti-social Behaviour Policy has been explained", date: "07-12-2024" },
    { id: 16, description: "Information on notice board has been shown", date: "07-12-2024" },
    { id: 17, description: "Brief introduction to the local area including relevant amenities", date: "07-12-2024" },
    { id: 18, description: "The support provision and frequency has been explained", date: "07-12-2024" },
    { id: 19, description: "Consequences of failure to engage with support provision have been communicated.", date: "07-12-2024" },
    { id: 20, description: "Safeguarding procedures have been explained", date: "07-12-2024" },
];

const Assessment = ({ Field }) => {

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const sd = query.get('sd');
    const tid = query.get('tid');
    const today = new Date();
    const oneYearFromToday = new Date(today);
    oneYearFromToday.setFullYear(today.getFullYear() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const formik = useFormik({
        initialValues: {
            supportNeeds: [],
            homeNo: false,
            workNo: false,
            communicationNeeds: false,
            dateOfAssessment: moment(sd).format('YYYY-MM-DD'),
            debt: false,
            debts: false,
            gamblingIssues: false,
            criminalRecords: false,
            fullcheck: false,
            supportFromAgencies: false,
            physicalHealthcon: false,
            mentalHealthcon: false,
            prescribedMedication: false,
            selfHarmcon: false,
            drug: false,
            isotherRisk: false,
            mentalHealthdig: false,
            related_under_condition: false,
            records: [{ natureOfOffence: '', date: '', sentence: '' }],
            prison: false,
            currentAssessmentDate: formatDate(today),
            nextAssessmentDate: formatDate(oneYearFromToday),
        },
        onSubmit: async (values, { resetForm }) => {

            // console.log(values)
            // return
            const { tenantSignature, supportWorkerSignature, ...restData } = values
            try {
                const modifyVal = {
                    assesment: {
                        ...restData,
                        dateOfAssessment: moment(values?.dateOfAssessment).toISOString(),
                        currentAssessmentDate: moment(values?.currentAssessmentDate).toISOString(),
                        release_date: moment(values?.release_date).toISOString(),
                        nextAssessmentDate: moment(values?.nextAssessmentDate).toISOString(),
                    },
                    _id: tid,
                    supportWorkerSignature,
                    tenantSignature
                }
                dispatch(setIsLoading({ data: true }))
                const res = await API.post('/api/tenents/addtenants', modifyVal)
                if (res.data.success == true) {
                    resetForm()
                    navigation('/desh')
                }
                if (res.data?.message) {
                    dispatch(showSnackbar({ message: res?.data?.message || "Assesment Added Succesfully", severity: "success" }))

                }
                dispatch(setIsLoading({ data: false }))
            } catch (error) {

                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: error?.response?.data?.message || "error while add tenants details", severity: "error" }))
            }
        }

    })




    const { setValues, values, handleChange, handleSubmit, setFieldValue } = formik;

    const addRecord = () => {
        setFieldValue('records', [...values.records, { natureOfOffence: '', date: '', sentence: '' }]);
    };

    const removeRecord = (index) => {
        const newRecords = values.records.filter((_, i) => i !== index);
        setFieldValue('records', newRecords);
    };
    // console.log(values)
    return (
        <>
            {/* <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}> */}
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => { navigation(-1) }} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
            </Toolbar>
            {/* </AppBar> */}
            <DynamicTitle title='Assessment' />
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
                            value={values?.dateOfAssessment || sd.split('T')[0]}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FlotingLableInput
                            name="preferredArea"
                            label="Preferred Area of Tenant"
                            placeholder="Preferred Area of Tenant"
                            type="text"
                            required
                            fullWidth
                            value={values.preferredArea}
                            onChange={(e) => { handleChange(e) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>

                        <Typography variant="subtitle1">Work No.</Typography>
                        <FormGroup style={{ flexDirection: 'row' }}>
                            <FormControlLabel
                                control={<Radio checked={values.workNo === true} onChange={() => setValues((pre) => ({ ...pre, workNo: true }))} name="workNo" value={true} />}
                                label="Yes"
                            />
                            <FormControlLabel
                                control={<Radio checked={values.workNo === false} onChange={() => setValues((pre) => ({ ...pre, workNo: false }))} name="workNo" value={false} />}
                                label="No"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Home No.</Typography>
                        <FormGroup style={{ flexDirection: 'row' }}>
                            <FormControlLabel
                                control={<Radio checked={values.homeNo === true} onChange={() => setValues((pre) => ({ ...pre, homeNo: true }))} name="homeNo" value={true} />}
                                label="Yes"
                            />
                            <FormControlLabel
                                control={<Radio checked={values.homeNo === false} onChange={() => setValues((pre) => ({ ...pre, homeNo: false }))} name="homeNo" value={false} />}
                                label="No"
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
                <Grid flexDirection='column' marginTop={4} spacing={2} container>
                    <Box width='100%' px={2}>
                        <Typography variant="h6">Diversity Monitoring Form</Typography>
                        <Divider sx={{ marginTop: 2 }} />
                        <Grid marginTop={4} spacing={2} container justifyContent="center">
                            {/* Ethnic Origin */}
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    name="ethnicOrigin"
                                    // as={TextField}
                                    select
                                    fullWidth
                                    defaultValue=''
                                    label="Ethnic Origin"
                                    value={values.ethnicOrigin}
                                    onChange={(e) => { handleChange(e) }}
                                // required
                                >
                                    <MenuItem value="White: British">White: British</MenuItem>
                                    <MenuItem value="White: Irish">White: Irish</MenuItem>
                                    <MenuItem value="White: Other">White: Other</MenuItem>
                                    <MenuItem value="Mixed: White & Black Caribbean">Mixed: White & Black Caribbean</MenuItem>
                                    <MenuItem value="Mixed: White & Black African">Mixed: White & Black African</MenuItem>
                                    <MenuItem value="Mixed: White & Asian">Mixed: White & Asian</MenuItem>
                                    <MenuItem value="Mixed: Other">Mixed: Other</MenuItem>
                                    <MenuItem value="Asian/Asian British: Indian">Asian/Asian British: Indian</MenuItem>
                                    <MenuItem value="Asian/Asian British: Pakistani">Asian/Asian British: Pakistani</MenuItem>
                                    <MenuItem value="Asian/Asian British: Bangladeshi">Asian/Asian British: Bangladeshi</MenuItem>
                                    <MenuItem value="Asian/Asian British: Other">Asian/Asian British: Other</MenuItem>
                                    <MenuItem value="Black/Black British: Caribbean">Black/Black British: Caribbean</MenuItem>
                                    <MenuItem value="Black/Black British: African">Black/Black British: African</MenuItem>
                                    <MenuItem value="Black/Black British: Other">Black/Black British: Other</MenuItem>
                                    <MenuItem value="Chinese/Other Ethnic Group">Chinese/Other Ethnic Group</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                    <MenuItem value="Refuse to say">Refuse to say</MenuItem>
                                    {/* Add other options as needed */}
                                </TextField>
                            </Grid>

                            {/* Religion */}
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    name="religion"
                                    // as={TextField}
                                    select
                                    fullWidth
                                    label="Religion"
                                    value={values.religion}
                                    onChange={(e) => { handleChange(e) }}
                                // required
                                >
                                    <MenuItem value="No religion/Atheist">No religion/Atheist</MenuItem>
                                    <MenuItem value="Muslim">Muslim</MenuItem>
                                    <MenuItem value="Christian (all denominations)">Christian (all denominations)</MenuItem>
                                    <MenuItem value="Sikh">Sikh</MenuItem>
                                    <MenuItem value="Buddhist">Buddhist</MenuItem>
                                    <MenuItem value="Hindu">Hindu</MenuItem>
                                    <MenuItem value="Jewish">Jewish</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Sexual Orientation */}
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    name="sexualOrientation"
                                    // as={TextField}
                                    select
                                    fullWidth
                                    value={values.sexualOrientation}
                                    label="Sexual Orientation *"
                                    required
                                    onChange={(e) => { handleChange(e) }}
                                >
                                    <MenuItem value="Heterosexual">Heterosexual</MenuItem>
                                    <MenuItem value="Homosexual">Homosexual</MenuItem>
                                    <MenuItem value="Lesbian">Lesbian</MenuItem>
                                    <MenuItem value="Transgender">Transgender</MenuItem>
                                    <MenuItem value="Bisexual">Bisexual</MenuItem>
                                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Any Communication Needs */}
                            <Grid item xs={12} sm={3}>
                                <Typography variant="subtitle1">Any Communication Needs?</Typography>
                                <FormGroup style={{ flexDirection: 'row' }}>
                                    <FormControlLabel
                                        control={<Radio checked={values.communicationNeeds === true} onChange={() => setValues((pre) => ({ ...pre, communicationNeeds: true }))} name="communicationNeeds" value={true} />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        control={<Radio checked={values.communicationNeeds === false} onChange={() => setValues((pre) => ({ ...pre, communicationNeeds: false }))} name="communicationNeeds" value={false} />}
                                        label="No"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box >
                </Grid>

                <Typography variant="h6" marginTop={4}>Financial Information</Typography>
                <Divider sx={{ marginTop: 2 }} />
                <Grid xs={12} spacing={2} flexDirection='row' container>
                    <Grid xs={3} marginTop={2} item flexDirection='column' >
                        <Grid mt={2} item xs={12} sm={12}>
                            <FlotingLableInput

                                name="sourceOfIncome"
                                type='text'
                                label="What is your source of income? What benefits are you on *"
                                required
                                fullWidth
                                value={values.sourceOfIncome}
                                onChange={(e) => { handleChange(e) }}
                            />
                        </Grid>

                        {/* Total Amount */}
                        <Grid mt={3} item xs={12} sm={12}>
                            <FlotingLableInput
                                name="totalAmount"
                                // as={TextField}
                                label="Total Amount *"
                                type='text'
                                required
                                fullWidth
                                value={values.totalAmount}
                                onChange={(e) => { handleChange(e) }}
                            />
                        </Grid>

                        {/* How Often */}
                        <Grid mt={3} item xs={12}>
                            <FlotingLableInput
                                name="howOften"
                                // as={TextField}
                                label="How Often"
                                type='text'
                                fullWidth
                                value={values.howOften}
                                onChange={(e) => { handleChange(e) }}
                            />
                        </Grid>
                    </Grid>
                    <Grid xs={9} marginTop={2} spacing={2} item flexWrap='wrap' container>
                        {/* Do you have any debts? */}
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Do you have any debts? If so, please provide details.</Typography>
                            <FormGroup style={{ flexDirection: 'row' }}>
                                <FormControlLabel
                                    control={<Radio
                                        checked={values.debt === true}
                                        onChange={() => setValues((pre) => ({ ...pre, debt: true }))}
                                        name="debt"
                                        value={true}
                                    />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio
                                        checked={values.debts === false}
                                        onChange={() => setValues((pre) => ({ ...pre, debts: false }))}
                                        name="debts"
                                        value={false}
                                    />}
                                    label="No"
                                />
                            </FormGroup>
                            {values?.debt === true &&
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
                            <Typography variant="subtitle1">Do you have any issues with gambling? If so, please provide details.</Typography>
                            <FormGroup style={{ flexDirection: 'row' }}>
                                <FormControlLabel
                                    control={<Radio checked={values.gamblingIssues === true} onChange={() => setValues((pre) => ({ ...pre, gamblingIssues: true }))} name="gamblingIssues" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.gamblingIssues === false} onChange={() => setValues((pre) => ({ ...pre, gamblingIssues: false }))} name="gamblingIssues" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                            {values?.gamblingIssues === true &&
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
                            <Typography variant="subtitle1">Do you have any Criminal Records?</Typography>
                            <FormGroup style={{ flexDirection: 'row' }}>
                                <FormControlLabel
                                    control={<Radio checked={values.criminalRecords === true} onChange={() => setValues((pre) => ({ ...pre, criminalRecords: true }))} name="criminalRecords" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.criminalRecords === false} onChange={() => setValues((pre) => ({ ...pre, criminalRecords: false }))} name="criminalRecords" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                            {values?.criminalRecords === true && (
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
                                            <Grid item xs={3}>
                                                <TextField
                                                    fullWidth
                                                    name={`records[${index}].sentence`}
                                                    label="Sentence"
                                                    value={record.sentence}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Button
                                                    onClick={() => removeRecord(index)}
                                                    color="error"
                                                    variant="contained"
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Grid container>

                                        <Grid item xs={3}>
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

                <Typography variant="h6" marginTop={4}>Support Needs</Typography>
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

                <Grid >
                    <Typography variant="h6" marginTop={4}>Tenant Signature</Typography>
                    <Divider sx={{ marginTop: 2 }} />
                    <Box flexDirection='column'>
                        <Typography variant='p'>I confirm that all the information provided is true to my knowledge and agree to follow a program of support based on this assessment</Typography>
                    </Box>
                    <Box>

                        <SignatureCanvas name='tenantSignature' setFieldValue={setFieldValue} onSave={(sign) => setFieldValue('tenantSignature', sign)} />
                    </Box>

                </Grid>

                <Box>
                    <Typography variant="h6" marginTop={4}>Support Worker Informations</Typography>
                    <Divider sx={{ marginTop: 2 }} />
                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">Full check completed with the tenant?</Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Radio checked={values.fullcheck === true} onChange={() => setValues((pre) => ({ ...pre, fullcheck: true }))} name="fullcheck" value={true} />}
                                label="Yes"
                            />
                            <FormControlLabel
                                control={<Radio checked={values.fullcheck === false} onChange={() => setValues((pre) => ({ ...pre, fullcheck: false }))} name="fullcheck" value={false} />}
                                label="No"
                            />
                        </FormGroup>
                    </Grid>

                </Box>
                {values?.fullcheck === true &&
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
                        name="howOften"
                        fullWidth
                        type='text'
                        onChange={(e) => { handleChange(e) }}
                        style={{ height: 100 }}
                    />
                </Box>

                <Grid >
                    <Box flexDirection='column'>
                        <Typography variant='p'>Support Worker Signature</Typography>
                    </Box>
                    <Box>
                        <SignatureCanvas name='supportWorkerSignature' setFieldValue={setFieldValue} onSave={(sign) => setFieldValue('supportWorkerSignature', sign)} />
                    </Box>

                </Grid>

                <Grid>
                    <Typography variant="h6" marginTop={4}>Stage 2 (Upon Placement Being Awarded)</Typography>
                    <Typography variant="subtitle1">Please give details if you receive regular support from any of the listed agencies:</Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={<Radio checked={values.supportFromAgencies === true} onChange={() => setValues((pre) => ({ ...pre, supportFromAgencies: true }))} name="supportFromAgencies" value={true} />}
                            label="Yes"
                        />
                        <FormControlLabel
                            control={<Radio checked={values.supportFromAgencies === false} onChange={() => setValues((pre) => ({ ...pre, supportFromAgencies: false }))} name="supportFromAgencies" value={false} />}
                            label="No"
                        />
                    </FormGroup>
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
                            <Typography variant="subtitle1">Do you have any physical health conditions?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.physicalHealthcon === true} onChange={() => setValues((pre) => ({ ...pre, physicalHealthcon: true }))} name="physicalHealthcon" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.physicalHealthcon === false} onChange={() => setValues((pre) => ({ ...pre, physicalHealthcon: false }))} name="physicalHealthcon" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
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

                            <Typography variant="subtitle1">Do you have any mental health conditions?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.mentalHealthcon === true} onChange={() => setValues((pre) => ({ ...pre, mentalHealthcon: true }))} name="mentalHealthcon" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.mentalHealthcon === false} onChange={() => setValues((pre) => ({ ...pre, mentalHealthcon: false }))} name="mentalHealthcon" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
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

                            <Typography variant="subtitle1">Have you been diagnosed with any mental health condition?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.mentalHealthdig === true} onChange={() => setValues((pre) => ({ ...pre, mentalHealthdig: true }))} name="mentalHealthdig" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.mentalHealthdig === false} onChange={() => setValues((pre) => ({ ...pre, mentalHealthdig: false }))} name="mentalHealthdig" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                            {values?.mentalHealthdig && (
                                <>
                                    <FlotingLableInput
                                        // placeholder="Psychiatrist/Psychologist"
                                        type="text"
                                        name="mentalHealthdigdetails"
                                        onChange={handleChange}
                                        fullWidth
                                        value={values?.mentalHealthdigdetails}
                                    />
                                </>
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
                                menuItems={[{ val: "DRR", label: "DRR" },
                                { val: "Yes", label: "Yes" },
                                { val: "No", label: "No" },]}
                                // type="text"
                                name="subjecttoorder"
                                onChange={handleChange}
                                fullWidth
                                value={values?.subjecttoorder}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>

                            <Typography variant="subtitle1">Are you prescribed medication?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.prescribedMedication === true} onChange={() => setValues((pre) => ({ ...pre, prescribedMedication: true }))} name="prescribedMedication" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.prescribedMedication === false} onChange={() => setValues((pre) => ({ ...pre, prescribedMedication: false }))} name="prescribedMedication" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
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

                            <Typography variant="subtitle1">Have you ever self-harmed, had suicidal thoughts or attempted suicide?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.selfHarmcon === true} onChange={() => setValues((pre) => ({ ...pre, selfHarmcon: true }))} name="selfHarmcon" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.selfHarmcon === false} onChange={() => setValues((pre) => ({ ...pre, selfHarmcon: false }))} name="selfHarmcon" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
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

                            <Typography variant="subtitle1">Have you been to prison?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.prison === true} onChange={() => setValues((pre) => ({ ...pre, prison: true }))} name="prison" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.prison === false} onChange={() => setValues((pre) => ({ ...pre, prison: false }))} name="prison" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                            {values.prison === true && (
                                <>
                                    <Grid flexDirection='column' container spacing={3} sx={{ padding: 2 }}>
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
                            <Typography variant="subtitle1">Related under any conditions</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.related_under_condition === true} onChange={() => setValues((pre) => ({ ...pre, related_under_condition: true }))} name="related_under_condition" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.related_under_condition === false} onChange={() => setValues((pre) => ({ ...pre, related_under_condition: false }))} name="related_under_condition" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                            {values?.related_under_condition && (
                                <>
                                    <Grid flexDirection='column' container spacing={3} sx={{ padding: 2 }}>
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
                            <Typography variant="subtitle1">Do you use drugs?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.drug === true} onChange={() => setValues((pre) => ({ ...pre, drug: true }))} name="drug" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.drug === false} onChange={() => setValues((pre) => ({ ...pre, drug: false }))} name="drug" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                        </Grid>
                        {values?.drug === true && (
                            <Grid container spacing={1} flexDirection='column'>
                                <Grid item xs={12} sm={6}>
                                    <FlotingLableInput
                                        type="text"
                                        name="drug_use"
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
                                        name={category.name}
                                        checked={values[category.name]}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFieldValue(category.name, true)
                                            } else {
                                                setFieldValue(category.name, false)
                                            }
                                        }}
                                    />
                                }
                                label={category.label}
                            />

                        </Box>
                    ))}


                    <Typography variant="h6" marginBottom={2}>Other</Typography>
                    <FormControlLabel
                        control={
                            <Radio
                                checked={values?.isotherRisk === true}
                                onChange={() => setValues((pre) => ({ ...pre, isotherRisk: true }))}
                                value={true}
                            />
                        }
                        label="Yes"
                    />
                    <FormControlLabel
                        control={
                            <Radio
                                checked={values?.isotherRisk === false}
                                onChange={() => setValues((pre) => ({ ...pre, isotherRisk: false }))}
                                value={false}
                            />
                        }
                        label="No"
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
                        <Typography variant="h6" marginBottom={2}>
                            Family Support
                        </Typography>

                        <RadioGroup
                            row
                            value={values.family_support}
                            onChange={(e) => setValues({ ...values, family_support: e.target.value })}
                        >
                            <FormControlLabel
                                control={<Radio />}
                                label="Yes"
                                value="yes"
                            />
                            <FormControlLabel
                                control={<Radio />}
                                label="No"
                                value="no"
                            />
                        </RadioGroup>

                        {/* Conditional fields based on the selected radio button */}
                        {values.family_support === "yes" && (
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




                    <Box width={{ xs: "100%", md: "80%", lg: "50%" }} my={4}>
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
                    </Box>

                    <Divider sx={{ marginTop: 4 }} />
                    <Typography variant="h5" marginTop={4}>Risk Assessment Reviews</Typography>
                    <Box
                        display="flex"
                        width="50%"
                        gap={2} // Use a numeric value for consistent spacing
                        flexDirection={{ xs: "column", md: "row" }} // Responsive: column on small screens, row on larger screens
                        justifyContent="space-between"
                        marginTop={2}
                    >
                        <FlotingLableInput
                            sx={{ flex: 1, marginBottom: { xs: 2, md: 0 } }} // Adjust margin for responsiveness
                            name="currentAssessmentDate"
                            label="Current Assessment Date"
                            type="date"
                            fullWidth
                            value={values.currentAssessmentDate}
                            onChange={(e) => handleChange(e)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FlotingLableInput
                            sx={{ flex: 1 }}
                            name="nextAssessmentDate"
                            label="Next Assessment Date"
                            type="date"
                            fullWidth
                            value={values.nextAssessmentDate}
                            onChange={(e) => handleChange(e)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>


                    <Button type="button" onClick={() => { handleSubmit(); }} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                        Add Tenant Assessment
                    </Button>
                </Grid>

            </Box>
        </>

    );
};

export default memo(Assessment); 