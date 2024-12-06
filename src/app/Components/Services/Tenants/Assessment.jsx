import React from 'react';
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
} from '@mui/material';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { useFormik } from 'formik';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useNavigation } from 'react-router-dom';

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
    { label: "Finance / Gambling / Debt", name: "financeGamblingDebt" },
    { label: "Self-Harm / Injurious behaviour", name: "selfHarm" },
    { label: "Self-neglect / lack of personal care", name: "selfNeglect" },
    { label: "Alcohol misuse", name: "alcoholMisuse" },
    { label: "Drug misuse", name: "drugMisuse" },
    { label: "Offending behaviour", name: "offendingBehaviour" },
    { label: "Arson", name: "arson" },
    { label: "Damage to property", name: "damageToProperty" },
    { label: "Anti-social behaviour", name: "antiSocialBehaviour" },
    { label: "Physical health", name: "physicalHealth" },
    { label: "Mental health", name: "mentalHealth" },
    { label: "Professional boundaries", name: "professionalBoundaries" },
];
const Assessment = ({ Field }) => {
    const navigation = useNavigate()
    const formik = useFormik({
        initialValues: { supportNeeds: [], homeNo: false, workNo: false, communicationNeeds: false },
        onSubmit: (values) => {
            console.log(values)
        }

    })

    const { setValues, values, handleChange, handleSubmit, setFieldValue } = formik;


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
            <Box px={3}>
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
                            value={values?.dateOfAssessment || values?.signInDate}
                            onChange={(e) => { handleChange(e) }}
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
                                    label="Ethnic Origin"
                                    value={values.ethnicOrigin}
                                    onChange={(e) => { handleChange(e) }}
                                    required
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
                                    required
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
                    <Grid xs={9} marginTop={2} spacing={2} item flexDirection='column' flexWrap='wrap' container>
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
                        <canvas id="client_signature" width="350" height="160" style={{ border: "1px solid rgb(221, 221, 221)", "touch-action": "none" }}></canvas>
                    </Box>
                    <Button variant='contained' color='error' >Clear</Button>
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
                        <canvas id="client_signature" width="350" height="160" style={{ border: "1px solid rgb(221, 221, 221)", "touch-action": "none" }}></canvas>
                    </Box>
                    <Button variant='contained' >Clear</Button>
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

                    <Divider sx={{ marginTop: 4 }} />

                    <Typography variant="h6" marginTop={4}>PHYSICAL AND MENTAL HEALTH</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Do you have any physical health conditions?</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Radio checked={values.physicalHealthcon === true} onChange={() => setValues((pre) => ({ ...pre, physicalHealth: true }))} name="physicalHealthcon" value={true} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Radio checked={values.physicalHealthcon === false} onChange={() => setValues((pre) => ({ ...pre, physicalHealth: false }))} name="physicalHealthcon" value={false} />}
                                    label="No"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>

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
                        </Grid>
                    </Grid>

                    <Divider sx={{ marginTop: 4 }} />

                    <Typography variant="h6" marginTop={4}>Legal Status</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>

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
                        </Grid>
                        <Grid item xs={12} sm={6}>

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
                                    as={TextField}
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
                                        name={`is${category.name}`}
                                        checked={values[`is${category.name}`]}
                                        onChange={(e) => {
                                            // setValues((pre) => ({
                                            //   ...pre,
                                            //   [category.name]: e.target.checked,
                                            // }));
                                            if (e.target.checked) {

                                                setFieldValue(`is${category.name}`, true)
                                            } else {

                                                setFieldValue(`is${category.name}`, false)
                                            }
                                        }}
                                    />
                                }
                                label={category.label}
                            />
                            {values[`is${category.name}`] ? (
                                <Box marginLeft={2}>
                                    <TextField
                                        name={`${category.name}.whoIsAtRisk`}
                                        // as={TextField}
                                        onChange={(e) => { handleChange(e) }}
                                        label="Who is at risk?"
                                        fullWidth
                                        margin="normal"
                                        value={values[`${category.name}`]?.whoIsAtRisk || ''}
                                    />
                                    <TextField
                                        name={`${category.name}.howWillRiskBeManaged`}
                                        // as={TextField}
                                        label="How will the risk be managed?"
                                        fullWidth
                                        margin="normal"
                                        onChange={(e) => { handleChange(e) }}
                                        value={values[`${category.name}`]?.howWillRiskBeManaged || ''}
                                    />
                                    <TextField
                                        name={`${category.name}.riskRating`}
                                        // as={TextField}
                                        onChange={(e) => { handleChange(e) }}
                                        label="Risk rating – high/medium/low"
                                        fullWidth
                                        margin="normal"
                                        value={values[`${category.name}`]?.riskRating || ''}
                                    />
                                </Box>
                            ) : null}
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
                        <TextField
                            name="otherRisk"
                            // as={TextField}
                            label="Other"
                            fullWidth
                            margin="normal"
                            value={values?.otherRisk || ''}
                            onChange={(e) => { handleChange(e) }}
                        />

                        <FlotingLableInput
                            name="whoIsAtRisk"
                            // as={TextField}
                            label="Who is at risk?"
                            fullWidth
                            value={values.whoIsAtRisk || ''}
                            onChange={(e) => { handleChange(e) }}
                            margin="normal"
                        />
                        <FlotingLableInput
                            name="howWillRiskBeManaged"
                            // as={TextField}
                            label="How will the risk be managed?"
                            fullWidth
                            value={values.howWillRiskBeManaged || ''}
                            onChange={(e) => { handleChange(e) }}
                            margin="normal"
                        />
                        <FlotingLableInput
                            name="riskRating"
                            // as={TextField}
                            label="Risk rating – high/medium/low"
                            fullWidth
                            margin="normal"
                            value={values.riskRating || ''}
                            onChange={(e) => { handleChange(e) }}
                        />
                    </>
                    }

                    <Divider sx={{ marginTop: 4 }} />
                    <Typography variant="h5" marginTop={4}>Risk Assessment Reviews</Typography>
                    <Box display="flex" width='70%' gap='5' flexDirection='row' justifyContent="space-between" marginTop={2}>

                        <FlotingLableInput
                            style={{ marginBottom: 10 }}
                            name="currentAssessmentDate"
                            label="Current Assessment Date"
                            type="date"
                            fullWidth
                            value={values.currentAssessmentDate}
                            onChange={(e) => { handleChange(e) }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FlotingLableInput
                            name="nextAssessmentDate"
                            label="Next Assessment Date"
                            type="date"
                            fullWidth
                            value={values.nextAssessmentDate}
                            onChange={(e) => { handleChange(e) }}
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

export default Assessment; 