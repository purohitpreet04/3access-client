import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { handeAgentCount } from '@app/Redux/Sclice/MultiSelectSlice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Icon, IconButton, Switch, TablePagination, TextField } from '@mui/material'
import API from 'Constance';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExistingFileModal from './ExistingFileModal';
import When from '@app/CommonComponents/When';

const Agents = () => {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isExistingData, setExistingData] = useState({ open: false })
    const [page, setPage] = useState(1);
    const [totalcount, setTotalCount] = useState(0);
    const [listData, setListData] = useState([])
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = useMemo(debounce((val) => {
        setSearchQuery(val?.target?.value.trim());
    }, 500), [])


    useEffect(() => {
        if (user?.isMainMA == 1) {
            fetchAllRSL()
        }
    }, [searchQuery, page, rowsPerPage])

    const fetchAllRSL = useCallback(async () => {
        try {

            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/user/agentdetials', { params: { _id: user?._id, search: searchQuery } })
            if (res.data.message) {
                dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))
            }
            dispatch(setIsLoading({ data: false }))
            setListData(res.data.data)
            setTotalCount(res.data?.total)
            const agentCount = { active: 0, inactive: 0 }
            res?.data?.data.forEach(element => {
                element.status === 1 ? agentCount.active = agentCount.active + 1 : agentCount.inactive = agentCount.inactive + 1
            });

            dispatch(handeAgentCount({ ...agentCount }))
            dispatch(showSnackbar({ message: res.data.message, severity: 'success' }))

        } catch (error) {
            console.log(error);

            dispatch(showSnackbar({ message: error?.response?.data?.error || 'Error while fetching agents!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }, [dispatch, user?._id, searchQuery])

    const handleStatusChange = useCallback(async (event, agentid) => {
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

        } catch (error) {
            dispatch(showSnackbar({ message: error.response?.data.error || 'Error while Add new RSL!', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }, [dispatch, user?._id, searchQuery]);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    };
    const handleChangePage = (_, newPage) => {
        setPage(newPage + 1);
    };
    const renderActionBtn = useCallback((cell) => (
        <>
            <IconButton onClick={() => navigate(`/services/agents/permission?agent=${cell?._id}`)}>
                <Icon style={{ color: 'blue' }}>edit</Icon>
            </IconButton>
            <IconButton>
                <Switch
                    checked={cell?.status === 1}
                    onChange={(e) => handleStatusChange(e, cell?._id)}
                    color="primary"
                />
            </IconButton>
            {cell?.exsitingTenantFile && <IconButton
                onClick={() => {
                    setExistingData({
                        open: true,
                        addedBy: cell?._id,
                        url: cell?.exsitingTenantFile,
                        addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
                        addedByRole: user?.role
                    })
                }}
                sx={{
                    color: 'blue',
                    '&:hover': {
                        color: 'darkblue',
                    },
                }}
            >
                <Icon>folder_open</Icon>
            </IconButton>}
        </>
    ), [navigate, handleStatusChange]);

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
                        { label: 'Staff', key: 'totalStaff' },
                        { label: 'Created At', key: 'createdAt' },
                    ]}
                    actionBtn={renderActionBtn}
                // actionBtn={(cell) => (
                //     <>
                //         <IconButton onClick={() => {
                //             navigate(`/services/agents/permission?agent=${cell?._id}`)
                //         }}>
                //             <Icon style={{ color: 'blue' }}>edit</Icon>
                //         </IconButton>
                //         <IconButton>
                //             <Switch
                //                 checked={cell?.status === 1 ? true : false}
                //                 onChange={(e) => handleStatusChange(e, cell?._id)}
                //                 color="primary" // Change to "secondary", "default" or other theme color
                //                 inputProps={{ "aria-label": "Switch Status" }}
                //             />
                //         </IconButton>
                //     </>
                // )
                // }
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
            <When
                when={isExistingData?.open}
                component={
                    <ExistingFileModal
                        open={isExistingData?.open}
                        data={isExistingData}
                        handleClose={() => { setExistingData({ open: false }) }}
                    />}
            />
        </Box>
    )
}

export default Agents