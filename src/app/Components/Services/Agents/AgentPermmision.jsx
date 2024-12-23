import DynamicTitle from '@app/CommonComponents/DynamicTitle'
import { Box, Checkbox, FormControlLabel, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { getAllRSL } from '@app/API/SideBarData';

const AgentPermmision = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { data } = useSelector(state => state.sideselect);
    const [checked, setChecked] = useState([]);
    const [allChecked, setAllChecked] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const agentId = queryParams.get('agent');


    useEffect(() => {
        if (data.length > 0) {
            const newPropertyPer = data
                .filter(property => property?.visibleTo.includes(agentId))
                .map(property => property?._id);

            setAllChecked(newPropertyPer.length === data.length);
            setChecked(newPropertyPer);
        }
    }, [data]);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            allCheck: allChecked, // Default value for the checkbox
            Property_per: checked, // Array for selected properties
        },
        onSubmit: async (values) => {
            try {
                const modifyVal = {
                    userId: agentId,
                    ...values
                }
                dispatch(setIsLoading({ data: true }))
                const res = await API.post('/api/rsl/setrslforagent', modifyVal)
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
                }
                // setListData(res.data.data)
                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
                dispatch(getAllRSL({ user: user, navigate, isMainMa: user?.isMainMa }))
            } catch (error) {
                dispatch(showSnackbar({ message: error.response.data.error || 'Error while Add new RSL!', severity: 'error' }))
                dispatch(setIsLoading({ data: false }))
            }
        },
    });

    const { values, setValues, handleChange, handleSubmit } = formik;

    const handlePropertyCheck = (e) => {
        const { checked } = e.target;
        if (checked) {
            let idArray = [];
            data.forEach((pro) => {
                idArray.push(pro?._id);
            });
            setValues((prev) => ({
                ...prev,
                Property_per: [...idArray],
                allCheck: true,
            }));
        } else {
            setValues((prev) => ({
                ...prev,
                Property_per: [],
                allCheck: false,
            }));
        }
    };

    return (
        <form>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
            </Toolbar>
            <Box p={3}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#eaf3fa' }}>
                                <TableCell padding="1" align="center">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="allCheck"
                                                checked={values?.allCheck} // Bind the Formik state
                                                onChange={(e) => {
                                                    handleChange(e); // Update Formik's state
                                                    handlePropertyCheck(e); // Custom handler
                                                }}
                                            />
                                        }
                                        label=""
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>RSL</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Address Line 1</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Area</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((permission, index) => (
                                <TableRow key={index}>
                                    <TableCell padding="1" align="center">
                                        <input
                                            id={`permissions_${permission?._id}`}
                                            type="checkbox"
                                            checked={values?.Property_per?.includes(permission?._id)}
                                            onChange={(e) => {
                                                handleChange(e);

                                                const willBeChecked = e.target.checked;
                                                const newPropertyPer = willBeChecked
                                                    ? [...values.Property_per, permission._id]
                                                    : values.Property_per.filter((p) => p !== permission._id);

                                                const allSelected = newPropertyPer.length === data.length;

                                                setValues((prev) => ({
                                                    ...prev,
                                                    Property_per: newPropertyPer,
                                                    allCheck: allSelected,
                                                }));
                                            }}
                                            name={`permissions_${permission?._id}`}
                                            style={{ width: "20px", height: "20px", marginRight: "10px" }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                        {permission?.lable}
                                    </TableCell>
                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                        {permission?.address}
                                    </TableCell>
                                    <TableCell style={{ wordBreak: 'break-word' }} align="center">
                                        {permission?.area}
                                    </TableCell>
                                    <TableCell style={{ wordBreak: 'break-word' }} align="left">
                                        {permission?.city}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" type="button" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default AgentPermmision;
