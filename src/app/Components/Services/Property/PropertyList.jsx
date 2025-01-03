import PaginationTable from '@app/CommonComponents/TableComponent';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Button, Icon, IconButton, MenuItem, Select, TablePagination, TextField } from '@mui/material';
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddProperty from './AddProperty';
import { setComData, setPropertyData } from '@app/Redux/Sclice/MultiSelectSlice';
import { mainuser } from '@app/Utils/constant';
import { fetchProperties } from '@app/API/Property';
import { confirm } from 'react-confirm-box';

function PropertyList() {


    const { properties, restData } = useSelector(state => state.property)
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalcount, setTotalCount] = useState(0);

    const [listData, setListData] = useState([])
    const [editData, setEditData] = useState({})
    const { user } = useSelector(state => state.auth)
    const { comData } = useSelector(state => state.sideselect)

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


    useEffect(() => {
        setListData(properties);
        setTotalCount(restData.totalCount)
    }, [properties.length, restData?.totalCount])

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };


    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])
    const handleRoleFilterChange = useCallback(debounce((e) => {
        setRoleFilter(e.target.value);
    }, 500), []);

    const fetchStaff = async () => {
        try {
            dispatch(fetchProperties({ user, page, rowsPerPage, searchQuery, roleFilter }))
            // dispatch(setIsLoading({ data: true }))
            // try {
            //     const res = await API.get('/api/property/getallproperty', {
            //         params: {
            //             _id: user?._id,
            //             role: user?.role,
            //             page: page,
            //             limit: rowsPerPage,
            //             search: searchQuery,
            //             filterby: roleFilter
            //         }
            //     });
            //     if (res.data.message) {
            //         dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
            //     }
            //     dispatch(setIsLoading({ data: false }))
            //     setListData(res?.data?.result)
            //     setTotalCount(res?.data?.totalCount)
            //     console.log(res);

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
        } catch (error) {
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const getAllComapny = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                const res = await API.get('/api/property/getallcompany');
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
                }
                dispatch(setIsLoading({ data: false }))
                dispatch(setComData(res.data.data))

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
    const getpropertydetails = async (id) => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                const res = await API.get('/api/property/getpropertydetails', { params: { _id: id } });
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
                }
                dispatch(setPropertyData(res.data.result))
                navigation('/services/addproperty')
                dispatch(setIsLoading({ data: false }))
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
            // console.log(error)
            dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
        }
    }


    const deleteProperty = async (id) => {
        if (await confirm("Are you sure?")) {
            try {
                dispatch(setIsLoading({ data: true }))
                try {
                    const res = await API.get('/api/property/deleteProperty', { params: { _id: id } });
                    if (res.data.message) {
                        dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
                    }
                    if (res.data.success == true) {
                        dispatch(setPropertyData(res.data.result))
                        dispatch(setIsLoading({ data: false }))
                        // getAllComapny()
                        fetchStaff()
                    }
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
                // console.log(error)
                dispatch(showSnackbar({ message: 'error while fetching staff list', severity: 'error' }))
            }
        }

    }

    return (
        <Box p={2}>
            {
                mainuser.includes(user.role) ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Button onClick={() => { /* comData.length == 0 && getAllComapny(); */ navigation('/services/addproperty') }} variant="contained" color="primary">
                                Add New Property
                            </Button>
                        </Box>
                    </>) :
                    (<>
                        {user?.permmission.includes(1) && <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Button onClick={() => { /* comData.length == 0 && getAllComapny(); */ navigation('/services/addproperty') }} variant="contained" color="primary">
                                Add New Property
                            </Button>
                        </Box>}
                    </>)

            }

            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                <TextField
                    fullWidth
                    label="Search..."
                    variant="outlined"
                    onChange={handleSearchChange}
                />
            </Box>

            <Box width="100%" overflow="auto">
                <PaginationTable
                    headCells={[
                        { label: "Address", key: "address" },
                        { label: "City", key: "city" },
                        { label: "Pincode", key: "postCode" },
                        { label: "RSL", key: "rslTypeGroup" },
                        { label: "Added By", key: "role" },
                        { label: "Username", key: "username" },
                        { label: "Added At", key: "createdAt" },
                        { label: "Shared", key: "sharedWithOther" },
                    ]}
                    data={listData}
                    actionBtn={(cell) => (
                        <>
                            <IconButton onClick={() => { setOpen(true); getpropertydetails(cell?._id); }}>
                                <Icon style={{ color: 'blue' }}>edit</Icon>
                            </IconButton>
                            {cell?.tenants == 0 && <IconButton onClick={() => { setOpen(true); deleteProperty(cell?._id) }}>
                                <Icon style={{ color: 'red' }} color='red'>delete</Icon>
                            </IconButton>}
                        </>
                    )
                    }
                />
            </Box>

            <TablePagination
                sx={{ px: 2 }}
                page={page}
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
    )
}

export default PropertyList