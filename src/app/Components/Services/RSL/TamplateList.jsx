import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, Grid, IconButton, Icon } from '@mui/material';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import TemplateModal from './TemplateModal';
import { useLocation, useNavigate } from 'react-router-dom';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { Span } from '@app/Components/Typography';
import { getDate } from '@app/Utils/utils';
import When from '@app/CommonComponents/When';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const TemplateList = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [templates, setTemplates] = useState([])
    // Example template data
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editdata, setEditdata] = useState({})
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rslId = queryParams.get('rsl');
    useEffect(() => {
        fetchAllRSLtamplates()
    }, [navigate])
    // Filter templates based on search and date
    // const filteredTemplates = templates.filter(template => {
    //     const matchesSearch = template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    //     const matchesDate = selectedDate
    //         ? new Date(template.createdDate).toDateString() === new Date(selectedDate).toDateString()
    //         : true;
    //     return matchesSearch && matchesDate;
    // });


    const handleOpen = () => setOpen(true);
    const handleClose = () => { setEditdata({}); setOpen(false); }

    const handleSubmit = (data) => {
        console.log('Template Data:', data);
        // Add logic to save the data (e.g., send it to an API)
    };

    const fetchAllRSLtamplates = async () => {
        try {

            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/rsl/getallrsltemplates', { params: { maId: user?._id, rsl_Id: rslId, page, limit: rowsPerPage, search: searchQuery } })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            setTemplates(res.data.data)
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))

        } catch (error) {
            dispatch(showSnackbar({ message: error.response.data.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }

    }

    const handleEdit = async (id) => {
        try {

            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/rsl/gettemplatedetails', {
                params: {
                    rslId: rslId, templateId: id
                }
            })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            setEditdata(res.data.data)
            handleOpen()
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))

        } catch (error) {
            dispatch(showSnackbar({ message: error.response.data.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }

    }
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch
    });

    return (
        <Box
            sx={{
                maxHeight: '700px',
                display: 'flex',
                flexDirection: 'column', // Make the layout column-based
            }}>
            <Box
                sx={{

                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    border: '1px solid #ccc', // Add border
                    borderRadius: '8px', // Optional: Add rounded corners
                    p: 2, // Optional: Add padding for better spacing

                }}
            >
                <TextField
                    placeholder="Search templates..."
                    variant="outlined"
                    size="small"
                    sx={{ width: '60%' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add New Template
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    px: 2,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '4px',
                    },
                }}
            >
                {filteredTemplates.map(template => (
                    <Grid
                        item xs={12} sm={12} md={12}
                        sx={{
                            mb: 1
                            // display: 'flex',
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                width: '100%',
                                borderRadius: '8px',
                                position: 'relative', // Allows positioning of the edit button
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    transition: 'transform 0.2s ease-in-out',
                                },
                            }}
                        >
                            <CardContent>
                                {/* Edit Button */}
                                <IconButton
                                    aria-label="edit"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        // backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            // backgroundColor: 'primary.dark',
                                        },
                                    }}
                                    onClick={() => handleEdit(template?._id)} // Replace with your edit handler
                                >
                                    <Icon style={{ color: 'blue' }}>edit</Icon>
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    sx={{
                                        position: 'absolute',
                                        top: 50,
                                        right: 8,
                                        color: 'white',
                                        '&:hover': {
                                            // Optional hover effects can be added here
                                        },
                                    }}
                                // onClick={() => handleDelete(template?._id)} // Replace with your delete handler
                                >
                                    <Icon style={{ color: 'red' }}>delete</Icon>
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {template.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    Created on: <Span>{getDate(template.createdAt)}</Span>
                                </Typography>
                            </CardContent>
                        </Card>


                    </Grid>
                ))}
            </Box>

            <When
                when={open}
                component={<TemplateModal
                    refetch={fetchAllRSLtamplates}
                    open={open}
                    handleClose={handleClose}
                    onSubmit={handleSubmit}
                    editdata={editdata}
                />}
            />

        </Box>
        // </Box>
    );
};

export default TemplateList