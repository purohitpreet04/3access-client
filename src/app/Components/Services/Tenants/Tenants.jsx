import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { getDate } from '@app/Utils/utils';
import { Edit, EditNotifications, Email, SaveAlt } from '@mui/icons-material';
import { Box, Button, Grid, Icon, IconButton, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditTenantModal from './EditTenatns';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import { mainuser, staffuser } from '@app/Utils/constant';
import { CheckHasOneStaff, handleDeleteTenantData, handleExistingExelFileExport, handleTenantedit, listTenants, sendemailtoagent, signOutTenant } from '@app/API/Tenant';
import { confirm } from 'react-confirm-box';
import When from '@app/CommonComponents/When';
import SignOutModal from './SignOutModal';

const TableCellstyle = styled(TableCell)(() => ({
    fontSize: 15,
    fontWeight: 'bold'

}));

const Tenants = () => {
    const dispatch = useDispatch()
    const navigation = useNavigate();
    const [fromdate, setFromDate] = useState('');
    const [todate, setTodate] = useState('');
    const [filter, setFilter] = useState('');
    const [editdata, setEditData] = useState({});
    const [open, setOpen] = useState(false);
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [totalpage, setTotalPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const { user } = useSelector(state => state.auth)
    const [signout, setSignOut] = useState({});
    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])




    const handleeditdata = async (id) => {


        let res = await dispatch(handleTenantedit({ _id: id, }))
        setEditData({ ...res?.payload })
        setOpen(true)
        // dispatch(setIsLoading({ data: true }))
        // try {
        //     try {
        //         const res = await API.get('api/tenents/edittenatns', {
        //             params: {
        //                 _id: id,
        //             }
        //         });

        //         dispatch(setIsLoading({ data: false }))
        //         // console.log(res);
        //     } catch (error) {
        //         dispatch(setIsLoading({ data: false }))
        //         if (error.response?.status === 409) {
        //             dispatch(logout());
        //             navigation('/auth/login');
        //         } else {
        //             dispatch(showSnackbar({
        //                 message: error.response?.data?.message || "An error occurred",
        //                 severity: "error"
        //             }));
        //         }
        //     }
        // } catch (error) {
        //     console.log(error)
        //     dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        // }
    }


    useEffect(() => {
        fetchSignOutTenants()
    }, [rowsPerPage, page, searchQuery, todate, filter])


    const fetchSignOutTenants = async () => {
        // dispatch(setIsLoading({ data: true }))
        // setListData([])

        let params = {
            addedBy: user?._id,
            page: page,
            limit: rowsPerPage,
            search: searchQuery,
            fromDate: fromdate,
            toDate: todate,
            role: user?.role,
            filter: filter
        }
        let res = await dispatch(listTenants(params))
        // console.log(res?.payload);
        setListData([...res?.payload?.data])
        setTotalPage(res.payload?.pagination?.totalPages)
        setTotalCount(res.payload?.pagination?.total)
        // try {
        //     try {
        //         const res = await API.get('api/tenents/ListTenents', {
        //             params: {
        //                 addedBy: user?._id,
        //                 page: page,
        //                 limit: rowsPerPage,
        //                 search: searchQuery,
        //                 fromDate: fromdate,
        //                 toDate: todate,
        //                 role: user?.role,
        //                 filter: filter
        //             }
        //         });

        //         setListData([...res?.data?.data])
        //         setTotalPage(res?.data?.pagination?.totalPages)
        //         setTotalCount(res?.data?.pagination?.total)
        //         dispatch(setIsLoading({ data: false }))
        //         // console.log(res);
        //     } catch (error) {
        //         dispatch(setIsLoading({ data: false }))
        //         if (error.response?.status === 409) {
        //             dispatch(logout());
        //             navigation('/auth/login');
        //         } else {
        //             dispatch(showSnackbar({
        //                 message: error.response?.data?.message || "An error occurred",
        //                 severity: "error"
        //             }));
        //         }
        //     }
        // } catch (error) {
        //     console.log(error)
        //     dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        // }
    }
    const handleChangePage = (_, newPage) => {
        setPage(newPage + 1);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };


    const handleSignOut = async (id, propertyid) => {

        setSignOut({ isOpen: true, id, propertyid: propertyid, userId: user?._id, })
        return

    }

    const checkHasOneStaff = async () => {
        if (staffuser.includes(user?.role)) {
            navigation('/services/addtenants')
        } else {
            dispatch(CheckHasOneStaff({ navigation: navigation }))
        }
    }


    const navigateToTenantsDetails = (t_id, p_id) => {
        navigation(`/services/tenetdetails?t=${t_id}&p=${p_id}`)
    }


    const handleExportTenants = async () => {
        await dispatch(handleExistingExelFileExport({ _id: user?._id, role: user?.role }))
    }


    const handelSendEmail = async (status) => {
        await dispatch(sendemailtoagent({ _id: user?._id, email: user?.coruspondingEmail, status }))
    }


    const ButtonsForNotActiveTenants = () => {
        return (
            <>
                <Grid
                    mb={2}
                >
                    <Button
                        onClick={() => {
                            handleExportTenants()
                        }}
                        sx={{
                            p: 2,
                        }}
                        variant='contained'
                        color='secondary'
                    >
                        <SaveAlt sx={{ mr: 2 }} />
                        {/* <Icon component={FileDownloadIcon} /> */}
                        Export Not-Active Tenants
                    </Button>
                    <Button
                        sx={{
                            p: 2,
                            ml: 2,
                            // borderRadius: "20px"

                        }}
                        onClick={() => {
                            handelSendEmail(0)
                        }}
                        p={2}
                        variant='contained'
                        color='primary'
                    >
                        <Icon sx={{ mr: 2 }}>email</Icon>
                        Email for Not-Active Tenants
                    </Button>
                    <Button
                        sx={{
                            p: 2,
                            ml: 2,

                        }}
                        onClick={() => {
                            handelSendEmail(1)
                        }}
                        p={2}
                        variant='contained'
                        color='success'
                    >
                        <Icon sx={{ mr: 2 }}>email</Icon>
                        Email for Active Tenants
                    </Button>
                    {/* <Button
                        sx={{
                            p: 2,
                            ml: 2,
                            float: 'right'
                        }}
                        onClick={() => {
                            // handelSendEmail(1)
                        }}
                        p={2}
                        variant='contained'
                        color='error'
                    >
                        <Icon sx={{ mr: 2 }}>delete</Icon>
                        Delete all data
                    </Button> */}



                </Grid>
            </>
        )
    }

    const handledeleteData = async (data) => {
        await dispatch(handleDeleteTenantData({ _ids: data, userId: user?._id }))
        fetchSignOutTenants()
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
                <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    placeholder="First Name/Middel Name/Last Name/NINO/Claim Reference No/Property"
                    // value={searchQuery}
                    onChange={handleSearchChange}
                />
                <TextField
                    name="filter"
                    label="Tenant Status"
                    // type="date"
                    fullWidth
                    value={filter}
                    onChange={(val) => {
                        setFilter(val.target.value)
                    }}
                    select
                    defaultValue='Select'
                >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">Not-Active</MenuItem>
                </TextField>
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
                {
                    mainuser.includes(user.role) ? (
                        <>
                            <ButtonsForNotActiveTenants />
                        </>) :
                        (<>
                            {user?.permmission.includes(10) &&
                                <ButtonsForNotActiveTenants />
                            }
                        </>)
                }


                <PaginationTable
                    cellStye={(cell) => {
                        return ({
                            status: {
                                backgroundColor: cell.status != "active" ? '#ff000014' : '#4CAF50',
                                position: "relative",
                                "::after": {
                                    content: '""', // Required for pseudo-elements
                                    position: "absolute",
                                    left: "5px", // Adjust position
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: cell.status === 1 ? "#4CAF50" : "#ff0000",
                                },
                            }
                        })
                    }}
                    rowStye={(row) => ({
                        // backgroundColor: row?.status === 1 ? '#DFF2D8' : '#ff000014'
                    })}
                    data={listData}
                    actionBtn={(item) => {
                        return (
                            <>
                                {mainuser.includes(user?.role) ?
                                    <IconButton onClick={() => { navigateToTenantsDetails(item?._id, item?.propertyDetails?._id) }}>
                                        <Icon>info</Icon>
                                    </IconButton> : (
                                        <>
                                            {
                                                user?.permmission.includes(4) && <IconButton onClick={() => { navigateToTenantsDetails(item?._id, item?.propertyDetails?._id) }}>
                                                    <Icon>info</Icon>
                                                </IconButton>
                                            }
                                        </>
                                    )}
                                {mainuser.includes(user?.role) ?
                                    <IconButton onClick={() => { handleeditdata(item?._id) }}>
                                        <Edit />
                                    </IconButton>
                                    : user?.permmission.includes(4) && <IconButton onClick={() => { handleeditdata(item?._id) }}>
                                        <Edit />
                                    </IconButton>}
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
                        { label: '', key: "Select All", isCheckbox: true, CheckBoxCom: true },
                        { label: "Status", key: "status" },
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
                    getSelectedRows={(rows) => {
                        handledeleteData(rows)
                    }}
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
            <When
                when={signout?.isOpen === true}
                component={<SignOutModal
                    handleClose={() => { setSignOut({ isOpen: false }) }}
                    open={signout?.isOpen}
                    data={{ ...signout }}
                    signOut={{ ...signout }}
                    refetch={fetchSignOutTenants}
                />}
            />
        </Box>
    )
}

export default Tenants
