import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Icon, IconButton, Switch, TextField } from '@mui/material'
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Agents = () => {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [Page, setPage] = useState(1);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])


    useEffect(() => {
        if (user?.isMainMA == 1) {
            fetchAllRSL()
        }
    }, [user?._id, searchQuery])

    const fetchAllRSL = async () => {
        try {

            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/user/agentdetials', { params: { _id: user?._id, search: searchQuery } })
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

    const handleStatusChange = async (event, agentid) => {
        // setStatus(event.target.checked);
        try {
            let status = event.target.checked ? 1 : 0
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/user/updatestatus', { params: { agentid, ma_id: user?._id, status } })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            setListData(res.data.data)
            fetchAllRSL()
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))

        } catch (error) {
            dispatch(showSnackbar({ message: error.response?.data.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    };


    return (
        <Box p={3}>
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
                        { label: 'First Name', key: 'fname' },
                        { label: 'Last Name', key: 'lname' },
                        { label: 'Email', key: 'email' },
                        { label: 'Properties', key: 'totalPropertyCount' },
                        { label: 'Tenants', key: 'totalTenantCount' },
                        { label: 'Created At', key: 'createdAt' },
                    ]}
                    actionBtn={(cell) => (
                        <>
                            <IconButton onClick={() => {
                                navigate(`/services/agents/permission?agent=${cell?._id}`)
                            }}>
                                <Icon style={{ color: 'blue' }}>edit</Icon>
                            </IconButton>
                            <IconButton>
                                <Switch
                                    checked={cell?.status === 1 ? true : false}
                                    onChange={(e) => handleStatusChange(e, cell?._id)}
                                    color="primary" // Change to "secondary", "default" or other theme color
                                    inputProps={{ "aria-label": "Switch Status" }}
                                />
                            </IconButton>
                        </>
                    )
                    }
                />
            </Box>
        </Box>
    )
}

export default Agents