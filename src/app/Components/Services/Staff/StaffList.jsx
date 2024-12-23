import React, { useCallback, useEffect, useState } from 'react';
import { Box, TextField, Select, MenuItem, Typography, Card, CardContent, Grid, Button, styled, TableHead, TableRow, TableCell, TableBody, TablePagination, Table, IconButton, Icon } from '@mui/material';
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
const mockStaffData = [
    { id: 1, name: 'John Doe', role: 'Doctor', department: 'Veterinary' },
    { id: 2, name: 'Jane Smith', role: 'Nurse', department: 'Surgery' },
    { id: 3, name: 'Albert Thompson', role: 'Technician', department: 'Lab' },
    { id: 4, name: 'Emily Davis', role: 'Receptionist', department: 'Front Desk' },
    // Add more sample staff data as needed
];

const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
    }
}));




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

    const filteredStaff = mockStaffData.filter((staff) => {
        return (
            (staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '') &&
            (staff.role === roleFilter || roleFilter === '') &&
            (staff.department === departmentFilter || departmentFilter === '')
        );
    });


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
                        filterby: roleFilter
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
            console.log(error)
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }

    const deleteStaff = async (id) => {
        dispatch(setIsLoading({ data: true }))

        try {
            const res = await API.get('/api/staff/deleteStaff', {
                params: {
                    staffId: id
                }
            });
            if (res.data.success == true) {
                fetchStaff()
            }
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            console.log(error)
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: 'error while deleting staff ', severity: 'error' }))
        }
    }

    const openLogs = (id) => {
        navigation(`/logs?user=${id}`)
      }
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

                                <IconButton onClick={() => { setOpen(true); setEditData(cell) }}>
                                    <Icon style={{ color: 'blue' }} color='blue'>edit</Icon>
                                </IconButton>
                                <IconButton onClick={() => { deleteStaff(cell?._id) }}>
                                    <Icon style={{ color: 'red' }} color='red'>delete</Icon>
                                </IconButton>
                                <IconButton onClick={() => { openLogs(cell?._id) }}>
                                <HistoryIcon />
                                </IconButton>
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
            </Box>
        </>

    );
};

export default StaffList;
