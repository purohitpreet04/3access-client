import React, { useCallback, useEffect, useState } from 'react'
import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { getDate } from '@app/Utils/utils';
import { Edit, EditNotifications } from '@mui/icons-material';
import { Box, Button, Icon, IconButton, ListItemIcon, Menu, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import API from 'Constance';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditTenantModal from './EditTenatns';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import { mainuser, staffuser } from '@app/Utils/constant';
import { CheckHasOneStaff, HandleApprovalOfTenants, signOutTenant } from '@app/API/Tenant';
import { confirm } from 'react-confirm-box';
import When from '@app/CommonComponents/When';
import SignOutModal from './SignOutModal';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';  // Approve Icon
import CancelIcon from '@mui/icons-material/Cancel';



const PendingTenants = () => {

    const dispatch = useDispatch()
    const navigation = useNavigate();
    const [fromdate, setFromDate] = useState('');
    const [todate, setTodate] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editdata, setEditData] = useState({});
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [totalpage, setTotalPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const [signout, setSignOut] = useState({});
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        fetchPendingTenants()
    }, [page, rowsPerPage, searchQuery])


    const fetchPendingTenants = useCallback(async () => {
        dispatch(setIsLoading({ data: true }))
        setListData([])
        try {
            try {
                const res = await API.get('api/tenents/pending-tenants', {
                    params: {
                        addedBy: user?._id,
                        page: page,
                        limit: rowsPerPage,
                        search: searchQuery,
                        fromDate: fromdate,
                        toDate: todate,
                        role: user?.role
                    }
                });

                setListData([...res?.data?.data])
                setTotalPage(res?.data?.pagination?.totalPages)
                setTotalCount(res?.data?.pagination?.total)
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
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }, [navigation, dispatch, searchQuery, rowsPerPage, page])



    const handleSearchChange = useCallback(debounce((val, filterVal) => {
        setSearchQuery(val.target.value.trim());

    }, 500), [])




    const handleChangePage = (_, newPage) => {
        setPage(newPage + 1);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };


    const handleApprovalOfTenant = async (tenantId, approved_status, propertyid) => {

        try {
            dispatch(HandleApprovalOfTenants({ navigation, tenantId, approved_status, propertyid }))
        } catch (error) {
            dispatch(showSnackbar({ message: 'error while chaging status', severity: 'error' }))
        }
    }


    const navigateToTenantsDetails = (t_id, p_id) => {
        navigation(`/services/tenetdetails?t=${t_id}&p=${p_id}`)
    }
    const navigateToEditTenantsDetails = (t_id, p_id, r) => {
        navigation(`/services/addtenants?t=${t_id}&p=${p_id}&r=${r}&s=${1}`)
    }

    const ThreeDotMenu = ({ tenant }) => {
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
                    <MenuItem onClick={() => { handleClose(); navigateToEditTenantsDetails(tenant?._id, tenant?.propertyDetails?._id, tenant?.room); }}>
                        <ListItemIcon>
                            <EditIcon style={{ color: '#1976d2' }} fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); navigateToTenantsDetails(tenant?._id, tenant?.propertyDetails?._id); }}>
                        <ListItemIcon>
                            <InfoIcon style={{ color: '#0288d1' }} fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">More Info</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleApprovalOfTenant(tenant?._id, 1, tenant?.propertyDetails?._id) }}>
                        <ListItemIcon>
                            <CheckCircleIcon style={{ color: 'green' }} fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Approve</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleClose(); handleApprovalOfTenant(tenant?._id, 2, tenant?.propertyDetails?._id) }}>
                        <ListItemIcon>
                            <CancelIcon style={{ color: 'red' }} fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Reject</Typography>
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    return (
        <Box p={2}>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                {/* Search Bar */}
                <TextField
                    fullWidth
                    label="Search by Name"
                    variant="outlined"
                    // value={searchQuery}
                    onChange={handleSearchChange}
                />

                {/* <FlotingLableInput
                    fullWidth
                    label='Role Filter'
                    select
                    onChange={(e) => {
                        handleSearchChange(searchQuery, e.target.value)
                    }}
                    value={filter}
                    menuItems={[
                        { val: 0, label: 'Pending' },
                        { val: 1, label: 'Pending' },
                        { val: 2, label: 'Pending' },
                    ]}
                /> */}

                <TextField
                    name="signInDate"
                    label="Date From"
                    type="date"
                    fullWidth
                    value={fromdate}
                    onChange={(val) => {
                        setFromDate(val.target.value)
                    }}
                    // onChange={(e) => { setFromDate(e.target.value) }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    name="signInDate"
                    label="Date To"
                    type="date"
                    fullWidth
                    value={todate}
                    // onChange={(e) => { setTodate(e.target.value) }}
                    onChange={(val) => {
                        setTodate(val.target.value)
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box width="100%" overflow="auto">
                <PaginationTable
                    data={listData}
                    actionBtn={(item) => {
                        return (
                            <>
                                {/* 
                                {mainuser.includes(user?.role) ?
                                    <IconButton onClick={() => { handleeditdata(item?._id) }}>
                                        <Edit />
                                    </IconButton>
                                    : user?.permmission.includes(4) && <IconButton onClick={() => { handleeditdata(item?._id) }}>
                                        <Edit />
                                    </IconButton>} */}
                                <ThreeDotMenu tenant={item} />
                            </>

                        )
                    }}
                    headCells={[
                        { label: "Property", key: "property" },
                        { label: "First Name", key: "firstName" },
                        { label: "Middel Name", key: "middleName" },
                        { label: "Last Name", key: "lastName" },
                        { label: "Room", key: "room" },
                        { label: "Date Of Birth", key: "dateOfBirth", date: true },
                        { label: "NINO", key: "nationalInsuranceNumber" },
                        { label: "Claim Reference No", key: "claimReferenceNumber" },
                        { label: "Sign In Date", key: "signInDate", date: true },
                        { label: "Sign Out Date", key: "endDate", date: true },
                        { label: "Added By", key: "addedByusername" },
                        { label: "Role", key: "addedbyrole" },
                        { label: "Created Date", key: "createdAt" },
                    ]}
                />
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
            </Box>
        </Box>
    )
}

export default PendingTenants;