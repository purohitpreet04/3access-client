import React, { useCallback, useEffect, useState } from 'react';
import { Box, TextField, Select, MenuItem, Typography, Card, CardContent, Grid, Button, styled, TableHead, TableRow, TableCell, TableBody, TablePagination, Table, IconButton, Icon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ListItemIcon, Menu } from '@mui/material';
import AddStaffModal from './AddStaffModal';
import PaginationTable from '@app/CommonComponents/TableComponent';
import { useDispatch, useSelector } from 'react-redux';
import { FetchData } from '@app/Utils/CustomHooks';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import API from 'Constance';
import { debounce } from 'lodash';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import HistoryIcon from '@mui/icons-material/History';
import When from '@app/CommonComponents/When';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { Archive } from '@mui/icons-material';
import { HandleArchiveStaff } from '@app/API/StaffAction';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import TransferWorkDialog from './StaffUnAvailbilityModal';




const StaffList = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const o = queryParams.get('open') === 'true';
    // const o = queryParams('open')
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [open, setOpen] = useState(o || false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const [editData, setEditData] = useState({})
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState({})
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deactivateStaff, setDeactivateStaff] = useState({})
    const { user } = useSelector(state => state.auth)

    const dispatch = useDispatch()
    const navigation = useNavigate();

    const handleChangePage = (_, newPage) => {
        if (newPage > 0) {
            setPage(newPage);
        }
    };


    useEffect(() => {
        fetchStaff()
    }, [page, rowsPerPage, searchQuery, roleFilter])


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };

    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])
    const handleRoleFilterChange = useCallback(debounce((e) => {
        setRoleFilter(e.target.value);
    }, 500), []);



    const fetchStaff = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                const res = await API.get('/api/staff/liststaff', {
                    params: {
                        _id: user?._id,
                        page: page,
                        limit: rowsPerPage,
                        search: searchQuery,
                        filterby: roleFilter,
                        status: 0
                    }
                });
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
                }
                dispatch(setIsLoading({ data: false }))
                setListData(res?.data?.staff)
                setTotalCount(res?.data?.totalCount)
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
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }

    const deleteStaff = async (id, granted = 0) => {
        dispatch(setIsLoading({ data: true }))
        try {
            const res = await API.get('/api/staff/deleteStaff', {
                params: {
                    granted,
                    staffId: id,
                }
            });

            if (res?.data?.property > 0) {
                setConfirmDeleteOpen({ data: true, id })
                dispatch(setIsLoading({ data: false }))
            }

            if (res.data.success == true) {
                setConfirmDeleteOpen({})
                fetchStaff()
            }
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: 'error while deleting staff ', severity: 'error' }))
        }
    }




    const ConfirmDelete = () => {
        return (
            <Dialog
                open={confirmDeleteOpen?.data}
                onClose={() => setConfirmDeleteOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`This Staff has access for some property, are you sure to perform this action`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen({})} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => deleteStaff(confirmDeleteOpen?.id, 1)} color="primary" autoFocus>
                        Yes, I am sure
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }




    const openLogs = (id) => {
        navigation(`/logs?user=${id}`)
    }

    const handleArchiveStaff = async (id) => {
        await dispatch(HandleArchiveStaff({ staffId: id }))
        fetchStaff()
    }

    const handleDeactivateStaff = async (cell) => {
        let staffList = listData.filter((staff) => staff?._id !== cell?._id)
        setDeactivateStaff({ ...cell, open: true, staffList })
    }

    const ThreeDotMenu = ({ cell }) => {
        const [anchorEl, setAnchorEl] = useState(null);

        const open = Boolean(anchorEl);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <div>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            minWidth: '150px',
                        },
                    }}
                >
                    <MenuItem onClick={() => { handleClose(); setOpen(true); setEditData(cell) }}>
                        <ListItemIcon>
                            <EditIcon style={{ color: '#1976d2' }} fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit Staff</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleArchiveStaff(cell?._id) }}>
                        <ListItemIcon>
                            <Archive style={{ color: 'green' }} fontSize="medium" />
                            {/* <IconButton onClick={() => { }}>
                                <Icon style={{ color: 'red' }} fontSize='small' color='red'>delete</Icon>
                                </IconButton> */}
                        </ListItemIcon>
                        <Typography variant="inherit">Archive Staff</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleDeactivateStaff(cell) }}>
                        <ListItemIcon>
                            <PersonOffIcon style={{ color: 'tomato' }} fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Deactivate Staff</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); openLogs(cell?._id) }}>
                        <ListItemIcon>
                            <HistoryIcon style={{ color: 'steelblue' }} fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Logs</Typography>
                    </MenuItem>
                    {/* <MenuItem onClick={() => { handleClose(); deleteStaff(cell?._id) }}>
                        <ListItemIcon>
                            <DeleteIcon style={{ color: 'red' }} fontSize="medium" />
                           
                        </ListItemIcon>
                        <Typography variant="inherit">Delete Staff</Typography>
                    </MenuItem> */}

                </Menu>
            </div>
        );
    };


    return (
        <>
            <DynamicTitle title={open ? 'Add Staff' : 'Staff Menagement'} />
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button onClick={() => setOpen(true)} variant="contained" color="primary">
                        Add New Staff
                    </Button>
                </Box>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                    {/* Search Bar */}
                    <TextField
                        fullWidth
                        label="Search by Name"
                        variant="outlined"
                        // value={searchQuery}
                        onChange={handleSearchChange}
                    />

                    {/* Role Filter */}
                    <Select
                        fullWidth
                        displayEmpty
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                        variant="outlined"
                    >
                        <MenuItem value="">All Roles</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        {['company'].includes(user.role) && <MenuItem value="company-agent">Agent</MenuItem>}

                    </Select>
                </Box>

                {/* Staff List */}
                <Box width="100%" overflow="auto">
                    <PaginationTable
                        // headCells={{type:"Type",companyEmail:"Company Email",password:"Password",jobTitle:"Job Title",firstName:"First Name",lastName:"Last Name",phone:"Phone", gender:"Gender", username:"Username", email:'Email' }} 
                        headCells={[
                            { label: "Job Title", key: "jobTitle" },
                            { label: "Type", key: "role" },
                            { label: "Username", key: "username" },
                            { label: "First Name", key: "fname" },
                            { label: "Last Name", key: "lname" },
                            { label: "Phone", key: "phonenumber" },
                            { label: "Gender", key: "gender" },
                            { label: "Email", key: "email" },
                            { label: "RSL Email", key: "companyEmail" },
                            { label: "Added At", key: "createdAt" },
                        ]}
                        data={listData}
                        actionBtn={(cell) => (
                            <>
                                <ThreeDotMenu cell={cell} />
                                {/* <IconButton onClick={() => { setOpen(true); setEditData(cell) }}>
                                    <Icon style={{ color: 'blue' }} color='blue'>edit</Icon>
                                </IconButton>
                                <IconButton onClick={() => { deleteStaff(cell?._id) }}>
                                    <Icon style={{ color: 'red' }} color='red'>delete</Icon>
                                </IconButton>
                                <IconButton onClick={() => { openLogs(cell?._id) }}>
                                    <HistoryIcon />
                                </IconButton> */}
                            </>
                        )
                        }
                    />
                </Box>

                {/* No results found */}
                {open && <AddStaffModal refetch={fetchStaff} editData={editData} open={open} onClose={() => { setOpen(false); setEditData({}) }} />}
                <TablePagination
                    sx={{ px: 2 }}
                    page={page - 1}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    count={totalcount}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[10, 20, 35]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    nextIconButtonProps={{ "aria-label": "Next Page" }}
                    backIconButtonProps={{ "aria-label": "Previous Page" }}
                />

                {/* <When when={confirmDeleteOpen?.data} component={<ConfirmDelete />} /> */}
                <When when={deactivateStaff?.open}  component={<TransferWorkDialog onClose={() => { setDeactivateStaff(null) }} data={deactivateStaff} open={deactivateStaff?.open} />} />
            </Box>
        </>

    );
};

export default StaffList;
