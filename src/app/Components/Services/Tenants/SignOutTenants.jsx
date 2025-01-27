import { logout } from '@app/Redux/Sclice/AuthSclice';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Edit, EditNotifications } from '@mui/icons-material';
import { Box, Button, Icon, IconButton, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import { mainuser, staffuser } from '@app/Utils/constant';
import PaginationTable from '@app/CommonComponents/TableComponent';

const SignOutTenants = () => {


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
    const { user } = useSelector(state => state.auth)

    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])



    useEffect(() => {
        fetchStaff()
    }, [rowsPerPage, page, searchQuery, todate])

    const fetchStaff = async () => {
        dispatch(setIsLoading({ data: true }))
        setListData([])
        try {
            try {
                const res = await API.get('api/tenents/signouttenantlist', {
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
            console.log(error)
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }
    const handleChangePage = (_, newPage) => {
        setPage(newPage + 1);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };

    const navigateToTenantsDetails = (ten_id, pro_id) => {
        navigation(`/services/tenetdetails?t=${ten_id}&p=${pro_id}`)
    }


    return (
        <Box p={2}>
            {/* {
                mainuser.includes(user.role) ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Button onClick={() => { checkHasOneStaff() }} variant="contained" color="primary">
                                Add New Tenants
                            </Button>
                        </Box>
                    </>) :
                    (<>
                        {user?.permmission.includes(7) && <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Button onClick={() => { checkHasOneStaff() }} variant="contained" color="primary">
                                Add New Tenants
                            </Button>
                        </Box>}
                    </>)
            } */}

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
                <TextField
                    name="fromDate"
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
                    name="toDate"
                    label="Date To"
                    type="date"
                    fullWidth
                    value={todate}
                    // onChange={(e) => { setTodate(e.target.value) }}
                    onChange={(val) => {
                        setTodate(val.target.value)
                    }}
                    inputProps={{
                        min: fromdate
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
                                {mainuser.includes(user?.role) ? (
                                    <IconButton onClick={() => {navigateToTenantsDetails(item?._id, item?.propertyDetails?._id)}}>
                                        <Icon>info</Icon>
                                    </IconButton>) : (
                                    <>
                                        {
                                            user?.permmission.includes(4) &&
                                            (<IconButton onClick={() => {navigateToTenantsDetails(item?._id, item?.propertyDetails?._id) }}>
                                                <Icon>info</Icon>
                                            </IconButton>)
                                        }
                                    </>
                                )}
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
                        { label: "Sign Out Date", key: "signOutDate", date: true },
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
            {/* <EditTenantModal open={open} setOpen={setOpen} editdata={editdata} /> */}
        </Box>
    );
}

export default SignOutTenants;
