import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Grid, Chip, Typography, Autocomplete, styled } from '@mui/material';
import TextEditor from '@app/CommonComponents/TextEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { debounce } from 'lodash';
import { signaturearray } from '@app/Utils/constant';


const AutoComplete = styled(Autocomplete)(() => ({ marginBottom: "16px" }))

const TemplateModal = ({ open, handleClose, onSubmit, editdata, refetch }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rslId = queryParams.get('rsl');
    const tempId = queryParams.get('temp');
    const { user } = useSelector(state => state.auth)
    const [template, setTemplate] = useState({ ...editdata });
    const [suggetions, setSuggetions] = useState({ RslArray: [] });
    const [signArray, setSignArray] = useState([...signaturearray]);
    const [feild, setFeild] = useState('RslArray');
    const [search, setSearch] = useState('');
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSave = () => {
        onSubmit({ ...template });
        ; // Close the dialog after saving
    };

    const handleDragStart = (e, val) => {
        e.dataTransfer.setData('text/plain', ` {{${val}}} `); // Set the data to be dragged
    };


    useEffect(() => {

        if (open) {
            fetchSuggetion()
        }

    }, [open])

    const fetchSuggetion = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/rsl/getallsuggetion')
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }

            setSuggetions({ ...res?.data })
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(showSnackbar({ message: error.response?.data?.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }
    const filteredTemplates = suggetions[feild].filter(template => {
        const matchesSearch = template?.label.toLowerCase().includes(search.toLowerCase());
        return matchesSearch
    });

    const handleSearchChange = useCallback(debounce((val) => {
        setSearch(val.target.value.trim());
    }, 500), [])

    const handleSubmit = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.post('/api/rsl/addnewtemplate', { ...template, rsl: rslId, addedBy: user?._id })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            if (refetch) {
                refetch()
            }
            handleClose()
            setTemplate({})
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(showSnackbar({ message: error.response?.data?.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullScreen fullWidth>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        mt: 1,
                        p: 2,
                        maxWidth: '100%',
                    }}
                >
                    <Grid container spacing={2}>
                        {/* Left Side: Form Section */}
                        <Grid item xs={12} md={4} lg={4} sm={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    pr: 2, // Add padding to separate the left and right sides
                                }}
                            >
                                {/* Template Name */}
                                {/* <TextField
                                    label="Template Name"
                                    variant="outlined"
                                    fullWidth
                                    value={template?.name}
                                    onChange={(e) =>
                                        setTemplate((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                /> */}
                                <AutoComplete
                                    fullWidth
                                    options={signArray}
                                    getOptionKey={(option) => option.name}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Template Name" variant="outlined" fullWidth />
                                    )}
                                    filterOptions={(options, state) => {
                                        const filtered = options.filter((option) =>
                                            option.label.toLowerCase().includes(state.inputValue.toLowerCase())
                                        );

                                        if (state.inputValue !== "" && !filtered.some((option) => option.label.toLowerCase() === state.inputValue.toLowerCase())) {
                                            filtered.push({
                                                name: state.inputValue,
                                                label: `${state.inputValue}`,
                                                isNew: true, // Flag for a new option
                                            });
                                        }

                                        return filtered;
                                    }}
                                    onInputChange={(e, newValue) => setInputValue(newValue)}
                                    onChange={(e, val) => {

                                        if (val?.isNew) {
                                            const cleanedName = inputValue.replace(/\s+/g, "")
                                            setSignArray((pre) => ([...pre, { name: cleanedName, label: inputValue }]))
                                            setTemplate((pre) => ({ ...pre, key: cleanedName, name: inputValue, newAdd: true }));
                                        } else {
                                            setTemplate((prev) => ({ ...prev, name: val?.label, key: val?.name }))
                                        }
                                    }}
                                    value={template?.key ? { name: template?.key, label: template?.name } : null}
                                />
                                {/* Subject */}
                                <TextField
                                    label="Subject"
                                    variant="outlined"
                                    fullWidth
                                    value={template?.subject}
                                    onChange={(e) =>
                                        setTemplate((prev) => ({ ...prev, subject: e.target.value }))
                                    }
                                />

                                {/* Search Section */}
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    onChange={handleSearchChange}
                                    sx={{
                                        mb: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />

                                {/* Dropdown */}
                                <FlotingLableInput
                                    onChange={(e) => setFeild(e.target.value)}
                                    select
                                    value={feild}
                                    menuItems={[
                                        { val: 'RslArray', label: 'RSL' },
                                        { val: 'propertyArray', label: 'Property' },
                                        { val: 'TenantArray', label: 'Tenant' },
                                    ]}
                                    sx={{ mb: 2 }}
                                />

                                {/* Drag and Drop Chips */}
                                <Typography mb={1}>Drag and Drop this Chips</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: 1.5,
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#ccc',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    {filteredTemplates.map((sug) => (
                                        <Chip
                                            key={sug.key}
                                            label={sug?.label}
                                            color="default"
                                            sx={{
                                                fontWeight: 'bold',
                                                p: 1,
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                ':hover': {
                                                    backgroundColor: '#92a8fc',
                                                    color: 'white',
                                                },
                                            }}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, sug.key)}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Side: Editor Section */}
                        <Grid item xs={12} md={8} lg={8} sm={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    borderRadius: 2,
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white',
                                    height: '100%',
                                }}
                            >
                                <TextEditor
                                    isPreviwe={false}
                                    onSave={(val) => {
                                        setTemplate((prev) => ({ ...prev, body: val }))
                                    }}
                                    value={template?.body}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => { handleClose() }} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TemplateModal;
