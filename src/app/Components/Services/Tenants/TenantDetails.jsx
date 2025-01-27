import React, { useEffect, useState } from 'react';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import {
    Box,
    Paper,
    Grid,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Divider,
    Avatar,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    IconButton
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import API from 'Constance';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import Loadable from '@app/Components/Loadable';
import { getDate } from '@app/Utils/utils';
import { handleDownload, handleView } from '@app/Utils/CustomHooks';
import EditTenantModal from './EditTenatns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PdfHandle from './PdfHandle';
function TenantDetails() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tenantId = queryParams.get('t');
    const dispatch = useDispatch()
    const navigation = useNavigate();
    useEffect(() => {
        getTenantDetails()
    }, [])
    const [isLoading, setLoading] = React.useState(false);
    const [tenantdata, setTenantData] = React.useState({});
    const [editdata, setEditData] = useState({});
    const [open, setOpen] = useState(false);
    const getTenantDetails = async () => {
        setLoading(true)
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/tenents/gettenantdetails', { params: { _id: tenantId } })

            setTenantData({ ...res.data.data, rslDocument: res.data?.rslDocuments })
            dispatch(setIsLoading({ data: false }))
            setLoading(false)
        } catch (error) {
            dispatch(showSnackbar({ message: error.message, severity: 'error' }))
            setLoading(false)
            dispatch(setIsLoading({ data: false }))
        }
    }


    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };




    const documents = {
        signup: [
            { name: 'Support Check List:', needsAssessment: false, type: 'supportchecklist' },
            { name: 'Personal Details:', needsAssessment: false, type: 'personal_details' },
            { name: 'Confidentiality Wavier Form:', needsAssessment: false, type: 'confidentiality_wavier_form' },
            { name: 'License To Occupy:', needsAssessment: false, type: 'license_to_occupy' },
            { name: 'License Charge Payments:', needsAssessment: false, type: 'license_charge_payments' },
            { name: 'Your Weekly Service Charge:', needsAssessment: false, type: 'your_weekly_service_charge' },
            { name: 'Fire Evacuation Procedure For All Residents:', needsAssessment: false, type: 'fire_evacuation_procedure_for_all_residents' },
            { name: 'Authorization Form:', needsAssessment: false, type: 'authorization_form' },
            { name: 'Missing Person Form:', needsAssessment: false, type: 'missing_person_form' },
            { name: 'Tenant Photographic Id Consent Form:', needsAssessment: false, type: 'tenant_photographic_id_consent_form' },
            { name: 'BCC Claim Form:', needsAssessment: false, type: '' }
        ],
        referral: [
            // { name: 'Interim Risk Review:', needsAssessment: true, navigate: '/services/tenetdetails/assesment' },
            { name: 'Referral and Risk Assessment:', needsAssessment: true, }
        ],
        support: [
            { name: 'Support Agreement:', needsAssessment: false },
            { name: 'Support Services:', needsAssessment: false },
            { name: 'Complaints Procedure Declaration:', needsAssessment: false },
            { name: 'Support Needs Assessment and Support Plan and Evaluation:', needsAssessment: false }
        ]
    };

    const handleeditdata = async (id) => {
        dispatch(setIsLoading({ data: true }))
        try {
            try {
                const res = await API.get('api/tenents/edittenatns', {
                    params: {
                        _id: id,
                    }
                });

                setEditData({ ...res?.data?.data })
                setOpen(true)
                dispatch(setIsLoading({ data: false }))
                // console.log(res);
            } catch (error) {
                dispatch(setIsLoading({ data: false }))
                if (error.response?.status === 409) {
                    dispatch(logout());
                    navigation('/auth/login');
                } else {
                    dispatch(showSnackbar({
                        message: error.response?.data?.message || "An error occurred",
                        severity: "error"
                    }));
                }
            }
        } catch (error) {
            dispatch(showSnackbar({ message: 'error while edit tenant', severity: 'error' }))
        }
    }



    if (isLoading) {
        return (
            <Loadable />
        )
    }


    return (
        <>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => { navigation(-1) }} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>

                <DynamicTitle title='Tenant Details' />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4
                    }}
                >
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            mb: 2
                        }}
                        alt={tenantdata?.firstName}
                        src="/path-to-avatar-image.png" // Add your avatar image path here
                    />
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        {`${tenantdata?.title_before_name || ''}. ${tenantdata?.firstName || ''} ${tenantdata?.middleName || ''} ${tenantdata?.lastName || ''}`}
                    </Typography>

                </Box>
               {tenantdata?.error && <Grid container xs={12} md={6} my={2}>
                    <Typography
                        variant="subtitle1"
                        component="p"
                        sx={{
                            fontWeight: 500,
                            textAlign: 'center',
                            color: 'white',  // Red color for errors (MUI default theme)
                            backgroundColor: 'error.light',  // Light red background to highlight the error
                            padding: 2,  // Adds padding inside the text box
                            borderRadius: 1,  // Rounds the corners of the box
                            border: '1px solid',  // Adds a border around the error message
                            borderColor: 'error.dark',  // Dark red color for the border
                            marginTop: 2,  // Adds some spacing at the top
                            marginBottom: 2,  // Adds some spacing at the bottom
                        }}
                    >
                        {tenantdata?.error}
                    </Typography>
                </Grid>}
                <Grid container spacing={3}>

                    {/* Left Panel - Document Upload */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'white',
                                    bgcolor: '#337ab7', // Blue header background
                                    p: 1,
                                    mb: 2,
                                    borderRadius: '4px'
                                }}
                            >
                                Birmingham City Council Housing Benefit Form
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                To Update BCC Form or Change of Circumstance
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        textTransform: 'none',
                                        border: '1px solid #ccc',
                                        color: '#333',
                                        bgcolor: '#fff',
                                        '&:hover': {
                                            bgcolor: '#e6e6e6',
                                            borderColor: '#adadad'
                                        }
                                    }}
                                >
                                    Choose File
                                    <input hidden accept="*/*" type="file" />
                                </Button>

                            </Box>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#337ab7',
                                    '&:hover': {
                                        bgcolor: '#286090'
                                    }
                                }}
                            >
                                Upload
                            </Button>
                        </Paper>

                        {/* Tenant Information */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'white',
                                    bgcolor: '#337ab7',
                                    p: 1,
                                    mb: 2,
                                    borderRadius: '4px'
                                }}
                            >
                                Tenant Informations
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                National Insurance Number:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.nationalInsuranceNumber}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Date of Birth:
                                            </TableCell>
                                            <TableCell>
                                                {getDate(tenantdata?.dateOfBirth)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Claim Reference Number:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.claimReferenceNumber}

                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Gender:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.gender}

                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Contact:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.tenantContactNumber}

                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Email:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.tenantEmail}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '200px',
                                                    color: '#666'
                                                }}
                                            >
                                                Status:
                                            </TableCell>
                                            <TableCell>
                                                {tenantdata?.status === 0 ? 'Not active' : 'Active'}

                                            </TableCell>
                                        </TableRow>
                                        {tenantdata?.Housing_benefit_weekly_amount && <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"

                                                sx={{
                                                    wordWrap: 'break-word',
                                                    width: '250px',
                                                    color: '#666'
                                                }}
                                            >
                                                Housing Benefit Weekly Amount:
                                            </TableCell>
                                            <TableCell>
                                                
                                                £ {tenantdata?.Housing_benefit_weekly_amount}
                                            </TableCell>
                                        </TableRow>}
                                        {tenantdata?.Next_HB_payment_amount && <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"

                                                sx={{
                                                    wordWrap: 'break-word',
                                                    width: '250px',
                                                    color: '#666'
                                                }}
                                            >
                                                Next HB Payment Amount:
                                            </TableCell>
                                            <TableCell>
                                                
                                                £ {tenantdata?.Next_HB_payment_amount}
                                            </TableCell>
                                        </TableRow>}
                                        {tenantdata?.Next_HB_payment_date && <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"

                                                sx={{
                                                    wordWrap: 'break-word',
                                                    width: '250px',
                                                    color: '#666'
                                                }}
                                            >
                                                Next HB Payment Date:
                                            </TableCell>
                                            <TableCell>
                                                {getDate(tenantdata?.Next_HB_payment_date)}
                                            </TableCell>
                                        </TableRow>}
                                        {/* {tenantInfo.map((row) => (
                            <TableRow
                                key={row.label}
                                sx={{
                                    '& td, & th': {
                                        border: 'none',
                                        padding: '8px 16px 8px 0'
                                    }
                                }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{
                                        width: '200px',
                                        color: '#666'
                                    }}
                                >
                                    {row.label}
                                </TableCell>
                                <TableCell>
                                    {row.value}
                                    {row.hasLink && (
                                        <LaunchIcon
                                            sx={{
                                                ml: 1,
                                                fontSize: 16,
                                                color: '#337ab7',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Button
                                    onClick={() => { handleeditdata(tenantdata?._id) }}
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        bgcolor: '#337ab7',
                                        '&:hover': {
                                            bgcolor: '#286090'
                                        }
                                    }}
                                >
                                    Edit Tenant Details
                                </Button>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'white',
                                    bgcolor: '#337ab7',
                                    p: 1,
                                    mb: 2,
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                RSL Information
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '120px',
                                                    color: '#666'
                                                }}
                                            >
                                                Name
                                            </TableCell>
                                            <TableCell>{tenantdata?.rslDetails?.rslname}</TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '& td, & th': {
                                                    border: 'none',
                                                    padding: '8px 16px 8px 0'
                                                }
                                            }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    width: '120px',
                                                    color: '#666'
                                                }}
                                            >
                                                Address
                                            </TableCell>
                                            <TableCell>{`${tenantdata?.rslDetails?.address} ${tenantdata?.rslDetails?.area} ${tenantdata?.rslDetails?.city}`}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: 'white',
                                    bgcolor: '#337ab7',
                                    p: 1,
                                    mb: 2,
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                Property Informations
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '140px', color: '#666' }}>
                                                Property Address:
                                            </TableCell>
                                            <TableCell>{tenantdata?.propertyDetails?.address}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                Room Number:
                                            </TableCell>
                                            <TableCell>{tenantdata?.room}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                Sign in Date:
                                            </TableCell>
                                            <TableCell>{getDate(tenantdata?.signInDate)}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                Area:
                                            </TableCell>
                                            <TableCell>{tenantdata?.propertyDetails?.area}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                City:
                                            </TableCell>
                                            <TableCell>{tenantdata?.propertyDetails?.city}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                Post Code:
                                            </TableCell>
                                            <TableCell>{tenantdata?.propertyDetails?.postCode}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td, & th': { border: 'none', padding: '8px 16px 8px 0' } }}>
                                            <TableCell component="th" scope="row" sx={{ width: '120px', color: '#666' }}>
                                                Eligible Rent:
                                            </TableCell>
                                            <TableCell>£ {tenantdata?.propertyDetails?.eligibleRent}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Right Panel - Documents List */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1"
                                sx={{
                                    color: 'white',
                                    bgcolor: '#337ab7',
                                    p: 1,
                                    mb: 2,
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>Tenant Documents</Typography>

                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    mb: 2
                                }}
                            >
                                <Tab label="Signup" />
                                <Tab label="Referral & Risk Assessments" />
                                <Tab label="Support Plan" />
                            </Tabs>

                            <Box role="tabpanel" hidden={tabValue !== 0}>
                                <PdfHandle documents={tenantdata?.rslDocument} />
                                {/* {documents.signup.map((doc) => (
                                    <Box
                                        key={doc.name}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid #eee',
                                            py: 1
                                        }}
                                    >
                                        <Typography>{doc.name}</Typography>
                                        <Box>
                                            <Button
                                                size="small"
                                                startIcon={<DownloadIcon />}
                                                sx={{
                                                    bgcolor: '#337ab7',
                                                    color: 'white',
                                                    mr: 1,
                                                    '&:hover': {
                                                        bgcolor: '#286090'
                                                    }
                                                }}

                                                onClick={() => {
                                                    // window.open(`/document?type=${doc.type}&t=${tenantId}`, '_blank')
                                                    handleDownload({ type: doc.type, id: tenantId }, dispatch)
                                                }}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{
                                                    bgcolor: '#337ab7',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: '#286090'
                                                    }
                                                }}
                                                onClick={() => {
                                                    window.open(`/document?type=${doc.type}&t=${tenantId}`, '_blank')
                                                    // handleView({ type: doc.type, id: tenantId })
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </Box>
                                ))} */}
                            </Box>

                            <Box role="tabpanel" hidden={tabValue !== 1}>
                                {documents.referral.map((doc, i) => (
                                    <Box>
                                        <Box
                                            key={doc.name}
                                            sx={{
                                                display: 'flex',
                                                direction: 'column',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderBottom: '1px solid #eee',
                                                py: 1
                                            }}
                                        >
                                            <Typography>{doc.name}</Typography>
                                            <Typography
                                                sx={{
                                                    color: '#337ab7',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                Assessment needs to be done
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        ml: 1,
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: '50%',
                                                        bgcolor: '#337ab7',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '14px',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => navigation(`${doc?.navigate}?sd=${tenantdata?.signInDate}&t=${i + 1}&tid=${tenantdata?._id}`)}
                                                >
                                                    +
                                                </Box>
                                            </Typography>
                                        </Box>
                                        {i === 1 && (
                                            <Box>
                                                {tenantdata?.assesment?.length > 0 && tenantdata?.assesment?.map((doc, index) => {

                                                    return (doc?.temp.map((asses) => {
                                                        return (
                                                            <>
                                                                <Box
                                                                    key={doc.name}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        borderBottom: '1px solid #eee',
                                                                        py: 1
                                                                    }}
                                                                >
                                                                    <Typography>
                                                                        {`${asses?.name} (${getDate(doc?.currentAssessmentDate)} - ${getDate(doc?.nextAssessmentDate)})`}
                                                                    </Typography>
                                                                    <Box>
                                                                        <Button
                                                                            size="small"
                                                                            startIcon={<DownloadIcon />}
                                                                            sx={{
                                                                                bgcolor: '#337ab7',
                                                                                color: 'white',
                                                                                mr: 1,
                                                                                '&:hover': {
                                                                                    bgcolor: '#286090'
                                                                                }
                                                                            }}
                                                                            onClick={() => {
                                                                                handleDownload({ type: asses?.key, id: tenantId, tempname: asses?.name, assesment_id: doc?._id }, dispatch)
                                                                            }}
                                                                        >
                                                                            Download
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => {
                                                                                window.open(`/document?type=${asses?.key}&t=${tenantId}&assessment=${doc?._id}`, '_blank')
                                                                                // handleView({ type: doc.type, id: tenantId })
                                                                            }}
                                                                            size="small"
                                                                            startIcon={<VisibilityIcon />}
                                                                            sx={{
                                                                                bgcolor: '#337ab7',
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    bgcolor: '#286090'
                                                                                }
                                                                            }}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            </>
                                                        )
                                                    }))

                                                })}
                                            </Box>
                                        )}
                                    </Box>

                                ))}
                            </Box>

                            <Box role="tabpanel" hidden={tabValue !== 2}>
                                {documents.support.map((doc, index) => (
                                    <Box
                                        key={doc.name}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid #eee',
                                            py: 1
                                        }}
                                    >
                                        <Typography>{doc.name}</Typography>
                                        <Box>
                                            <Button
                                                size="small"
                                                startIcon={<DownloadIcon />}
                                                sx={{
                                                    bgcolor: '#337ab7',
                                                    color: 'white',
                                                    mr: 1,
                                                    '&:hover': {
                                                        bgcolor: '#286090'
                                                    }
                                                }}
                                            >
                                                Download
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{
                                                    bgcolor: '#337ab7',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: '#286090'
                                                    }
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}

                                {/* Support Plan Upload Section */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 2
                                    }}
                                >
                                    <Typography sx={{ mr: 2 }}>Support Plan:</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        sx={{
                                            textTransform: 'none',
                                            border: '1px solid #ccc',
                                            color: '#333',
                                            mr: 2
                                        }}
                                    >
                                        Choose File
                                        <input hidden accept="*/*" type="file" />
                                    </Button>
                                    <Typography sx={{ color: '#555' }}>No file chosen</Typography>
                                    <Button
                                        sx={{
                                            ml: 'auto',
                                            bgcolor: '#337ab7',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: '#286090'
                                            }
                                        }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <EditTenantModal open={open} setOpen={setOpen} editdata={editdata} setEditdata={setEditData} refetch={getTenantDetails} />
            </Box>
        </>

    );
}

export default TenantDetails