import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { getDate } from '@app/Utils/utils';
import { Edit, EditNotifications } from '@mui/icons-material';
import { Box, Button, Icon, IconButton, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditTenantModal from './EditTenatns';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import { mainuser, staffuser } from '@app/Utils/constant';
import { signOutTenant } from '@app/API/Tenant';

const TableCellstyle = styled(TableCell)(() => ({
    fontSize: 15,
    fontWeight: 'bold'

}));

const Tenants = () => {
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
            console.log(error)
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }


    useEffect(() => {
        fetchStaff()
    }, [rowsPerPage, page, searchQuery, todate])


    const fetchStaff = async () => {
        dispatch(setIsLoading({ data: true }))
        setListData([])
        try {
            try {
                const res = await API.get('api/tenents/ListTenents', {
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


    const handleSignOut = async (id, propertyid) => {
        dispatch(
            signOutTenant({
                id,
                propertyid,
                userId: user?._id,
                navigate: navigation,
            })
        ).then(() => {
            fetchStaff(); // Trigger a refresh of tenant data
        });
        // try {
        //     dispatch(setIsLoading({ data: true }))
        //     const res = await API.post(`api/tenents/signouttenants?_id=${id}&addedby=${user?._id}&propertyid=${propertyid}`);
        //     if (res.data.message) {
        //         dispatch(showSnackbar({
        //             message: res?.data?.message || "Successfull",
        //             severity: "success"
        //         }));
        //     }

        //     dispatch(setIsLoading({ data: false }))
        //     fetchStaff()
        // } catch (error) {
        //     dispatch(setIsLoading({ data: false }))
        //     if (error.response?.status === 409) {
        //         dispatch(logout());
        //         navigation('/auth/login');
        //     } else {
        //         dispatch(showSnackbar({
        //             message: error.response?.data?.message || "An error occurred",
        //             severity: "error"
        //         }));
        //     }
        // }
    }

    const checkHasOneStaff = async () => {
        if (staffuser.includes(user?.role)) {
            navigation('/services/addtenants')
        } else {
            try {
                dispatch(setIsLoading({ data: true }))
                const res = await API.get('/api/user/checkhasstaff')
                if (res.data.success && res.data.hasStaffOrAgent) {
                    dispatch(showSnackbar({
                        message: "You already have staff or agent. Please add tenants.",
                        severity: "info"
                    }));
                    navigation('/services/addtenants')
                    dispatch(setIsLoading({ data: false }))
                } else {
                    dispatch(showSnackbar({
                        message: "You don't have any staff or agent. Please add staff first.",
                        severity: "info"
                    }));
                    navigation('/services/staff?open=true')
                    dispatch(setIsLoading({ data: false }))
                }
            } catch (error) {
                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({
                    message: error.response?.data?.message || "An error occurred",
                    severity: "error"
                }));
            }
        }
    }

    return (
        <Box p={2}>
            {
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

            }

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
                                {mainuser.includes(user?.role) ? <IconButton onClick={() => { }}>
                                    <Icon>info</Icon>
                                </IconButton> : (
                                    <>
                                        {
                                            user?.permmission.includes(4) && <IconButton onClick={() => { }}>
                                                <Icon>info</Icon>
                                            </IconButton>
                                        }
                                    </>
                                )}
                                <IconButton onClick={() => { handleeditdata(item?._id) }}>
                                    <Edit />
                                </IconButton>
                                {mainuser.includes(user?.role) ? <IconButton onClick={() => { handleSignOut(item._id, item?.propertyDetails?._id) }}>
                                    <Icon>logout</Icon>
                                </IconButton> : (
                                    <>
                                        {
                                            user?.permmission.includes(2) && <IconButton onClick={() => { handleSignOut(item._id, item?.propertyDetails?._id) }}>
                                                <Icon>logout</Icon>
                                            </IconButton>
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
                    { label: "NINO", key: "nino" },
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
            <EditTenantModal open={open} setOpen={setOpen} editdata={editdata} />
        </Box>
    )
}

export default Tenants
