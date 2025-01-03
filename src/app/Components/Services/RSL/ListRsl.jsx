
import { Box, Button, Icon, IconButton, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { AddRsl } from '..'
import When from '@app/CommonComponents/When'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice'
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice'
import API from 'Constance'
import PaginationTable from '@app/CommonComponents/TableComponent'
import { debounce } from 'lodash'
import PasswordModal from './PasswordModal'

const ListRsl = () => {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const [open, setOpen] = useState(false)
    const [openPasssWordmodal, setOpenPasswordModal] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromdate, setFromDate] = useState('');
    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])

    useEffect(() => {
        fetchAllRSL()
    }, [])

    const handleClose = () => { 
        setOpenPasswordModal(!openPasssWordmodal)
        navigate('/services/listrsl')
    }
    const handleOpen = () => { navigate('/services/listrsl/add-new-rsl') }

    const fetchAllRSL = async () => {
        try {

            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/rsl/getrsl-list', { params: { _id: user?._id, } })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            setListData(res.data.data)
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))

        } catch (error) {
            dispatch(showSnackbar({ message: error.response.data.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }

    }

    const deleteProperty = async (id, password) => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                const res = await API.get('/api/rsl/deletersl', { params: { _id: id, password } });
                if (res.data.message) {
                    dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
                }
                if (res.data.success == true) {
                    // dispatch(setPropertyData(res.data.result))
                    dispatch(setIsLoading({ data: false }))
                    handleClose()
                    fetchAllRSL()
                    // getAllComapny()
                }
            } catch (error) {
                dispatch(setIsLoading({ data: false }))
                if (error.response?.status === 409) {
                    dispatch(logout());
                    navigate('/auth/login');
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

    const openPasssWordModal = (id) => {
        setOpenPasswordModal(true)
        navigate(`/services/listrsl?delete=${id}`)
    }
    return (
        <>

            <Box p={3}>
                <Box>
                    <Button onClick={() => handleOpen()} variant='contained' sx={{ display: 'flex', justifyContent: 'center', p: 1, mb: 2, alignItems: 'center', gap: 2 }}>
                        <Icon>add</Icon>
                        {/* <Typography color='' variant='button' align='center'> */}
                        Regester New RSL
                        {/* </Typography> */}
                    </Button>
                </Box>
                <Box width='100%'>
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
                        {/* Search Bar */}
                        <TextField
                            fullWidth
                            label="Search by Name"
                            variant="outlined"
                            // value={searchQuery}
                            onChange={handleSearchChange}
                        />

                    </Box>
                    <PaginationTable
                        data={listData}
                        headCells={[
                            { label: 'RSL', key: 'companyname' },
                            { label: 'First Name', key: 'fname' },
                            { label: 'Last Name', key: 'lname' },
                            { label: 'Email', key: 'email' },
                            { label: 'Phone Number', key: 'phonenumber' },
                            { label: 'Address', key: 'address' },
                            { label: 'Area', key: 'area' },
                            { label: 'City', key: 'city' },
                            { label: 'Post Code', key: 'pincode' },
                            { label: 'Created At', key: 'createdAt' },
                        ]}
                        actionBtn={(cell) => (
                            <>
                                <IconButton onClick={() => { navigate(`/services/listrsl/add-new-rsl?rsl=${cell?._id}`) }}>
                                    <Icon style={{ color: 'blue' }}>edit</Icon>
                                </IconButton>
                                <IconButton onClick={() => openPasssWordModal(cell?._id)}>
                                    <Icon style={{ color: 'red' }} color='red'>delete</Icon>
                                </IconButton>
                            </>
                        )
                        }
                    />
                </Box>
            </Box>

            <When component={<PasswordModal open={openPasssWordmodal} deleteProperty={deleteProperty} handleClose={handleClose} />} when={openPasssWordmodal === true} />
        </>
    )
}

export default ListRsl