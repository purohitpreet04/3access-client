import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Icon, IconButton, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import API from 'Constance';
import { debounce } from 'lodash';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { mainuser, staffuser } from '@app/Utils/constant';
import { StackCards } from '.';
import { Bed, Group, House, Room } from '@mui/icons-material';
import { signOutTenant } from '@app/API/Tenant';
import { getDate } from '@app/Utils/utils';

const PropertyList = () => {
    let stacklist = [
        { name: 'Total Property', Icon: Room, count: 0, key: 'totalProperty' },
        { name: 'Total Rooms', Icon: House, count: 0, key: 'totalRooms' },
        { name: 'Active Tenants', Icon: Group, count: 0, key: 'activeTenants' },
        { name: 'Void Rooms', Icon: Bed, count: 0, key: 'voidRooms' },
    ]
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalcount, setTotalCount] = useState(0);

    const [listData, setListData] = useState([])
    const [stackData, setStackList] = useState([...stacklist])
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
    }, [page, rowsPerPage, searchQuery])


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };

    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])

    const fetchStaff = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            try {
                let params = {};
                if (staffuser.includes(user?.role)) {
                    params.staffAddedByrole = user?.addedBy?.role
                    params.staffAddedBy = user?.addedBy?._id
                }
                const res = await API.get('/api/desh/getallproperty', { params: { addedBy: user?._id, page: page, limit: rowsPerPage, search: searchQuery, role: user?.role, ...params } });
                const stackModyData = stacklist.map((stack) => {
                    if (Object.keys(res.data.stackcards).includes(stack.key)) {
                        return {
                            ...stack,
                            count: res.data.stackcards[stack.key]
                        }
                    }
                })
                setStackList([...stackModyData])
                setListData(res?.data?.data)
                setTotalCount(res?.data?.total)
                dispatch(setIsLoading({ data: false }))
                // console.log(res);
            } catch (error) {
                // console.log(error)
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

    const StyledTable = styled(Table)(() => ({
        whiteSpace: "pre",
        "& thead": {
            "& tr": { "& th": { paddingLeft: 0, paddingRight: 0, } }
        },
        "& tbody": {
            "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
        }
    }));
    const Clickablelink = styled(Link)(() => ({
        color: 'blue',
        fontSize: 15

    }));
    const TableCellstyle = styled(TableCell)(() => ({
        fontSize: 20,
        fontWeight: 'bold'

    }));




    const handleNavigate = () => {
        navigate('/services/addtenants');
    };
    const rooms = [
        { key: 'room1', roomNumber: 1 },
        { key: 'room2', roomNumber: 2 },
        { key: 'room3', roomNumber: 3 },
        { key: 'room4', roomNumber: 4 },
        { key: 'room5', roomNumber: 5 },
        { key: 'room6', roomNumber: 6 },
        { key: 'room7', roomNumber: 7 },
        { key: 'room8', roomNumber: 8 },
    ];

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
    }
    return (
        <>
            <Box width="100%" overflow="auto">
                <StackCards cardList={stackData} />
                <TableContainer component={Paper}>
                    <StyledTable>
                        <TableHead>
                            <TableRow>
                                <TableCellstyle align='center'>Sno.</TableCellstyle>
                                <TableCellstyle align='center'>RSL</TableCellstyle>
                                <TableCellstyle align='center'>Houses</TableCellstyle>
                                <TableCellstyle align='center'>Room 1</TableCellstyle>
                                <TableCellstyle align='center'>Room 2</TableCellstyle>
                                <TableCellstyle align='center'>Room 3</TableCellstyle>
                                <TableCellstyle align='center'>Room 4</TableCellstyle>
                                <TableCellstyle align='center'>Room 5</TableCellstyle>
                                <TableCellstyle align='center'>Room 6</TableCellstyle>
                                <TableCellstyle align='center'>Room 7</TableCellstyle>
                                <TableCellstyle align='center'>Room 8</TableCellstyle>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listData.length !== 0 ? (

                                <>
                                    {listData.map((property, index) => (
                                        <TableRow key={property._id}>
                                            <TableCell style={{ wordBreak: 'break-word' }} align='center'>{index + 1}</TableCell>
                                            <TableCell style={{ wordBreak: 'break-word' }} align='center'>{property.companyname}</TableCell>
                                            <TableCell style={{ wordBreak: 'break-word' }} align='center'>{property.address}</TableCell>
                                            {rooms.map((room) => (
                                                <TableCell style={{ wordBreak: 'break-word' }} align="center" key={room.key}>
                                                    {property[room.key] ? (
                                                        property[room.key].tenant_id ? (
                                                            <Box flexDirection='column' display='flex' justifyContent='center' alignItems='center'>
                                                                {
                                                                    mainuser.includes(user?.role) ? (
                                                                        <>
                                                                            <Clickablelink to={`/services/tenetdetails?t=${property[room.key].tenant_id._id}&p=${property?._id}`}>
                                                                                {`${property[room.key].tenant_id.firstName} ${property[room.key].tenant_id.lastName}`}
                                                                            </Clickablelink>
                                                                        </>) :
                                                                        (<>
                                                                            {user?.permmission.includes(4) ? <Clickablelink to={`/services/tenetdetails?t=${property[room.key].tenant_id._id}&p=${property?._id}`}>
                                                                                {`${property[room.key].tenant_id.firstName} ${property[room.key].tenant_id.lastName}`}
                                                                            </Clickablelink> : <Clickablelink>
                                                                                {`${property[room.key].tenant_id.firstName} ${property[room.key].tenant_id.lastName}`}
                                                                            </Clickablelink>}
                                                                        </>)

                                                                }

                                                                {
                                                                    mainuser.includes(user?.role) ? (
                                                                        <>
                                                                            <Clickablelink onClick={() => { handleSignOut(property[room.key].tenant_id?._id, property?._id) }} style={{ color: 'red' }}>
                                                                                Sign Out
                                                                            </Clickablelink>
                                                                        </>) :
                                                                        (<>
                                                                            {user?.permmission.includes(2) && <Clickablelink onClick={() => { handleSignOut(property[room.key].tenant_id?._id, property?._id) }} style={{ color: 'red' }}>
                                                                                Sign Out
                                                                            </Clickablelink>}
                                                                        </>)

                                                                }

                                                                <Clickablelink>
                                                                    Claim Ref: {property[room.key].tenant_id.claimReferenceNumber}
                                                                </Clickablelink>
                                                            </Box>
                                                        ) : (
                                                            <Box flexDirection='column' display='flex' justifyContent='center' alignItems='center'>
                                                                <Clickablelink to={`/services/addtenants?p=${property._id}&r=${room.roomNumber}`}>
                                                                    Add new Tenant
                                                                </Clickablelink>
                                                                {property[room.key]?.lastsignoutdate && (
                                                                    <>
                                                                        <Typography>
                                                                            {`Vaccent From: ${getDate(property[room.key]?.lastsignoutdate)}`}
                                                                        </Typography>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        )
                                                    ) : (
                                                        <Icon>do_not_disturb</Icon>
                                                    )}
                                                </TableCell>
                                            ))}

                                        </TableRow>
                                    ))}
                                </>
                            ) : (

                                <>
                                    <TableRow>
                                        <TableCell colSpan={12} sx={{ borderBottom: 'none', padding: 0 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: 300, // Adjust height to ensure it looks centered
                                                    backgroundColor: '#f9f9f9',
                                                    color: 'text.secondary',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <SearchOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" gutterBottom>
                                                    No data available
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Try adjusting your search or filter to find what you're looking for.
                                                </Typography>
                                            </Paper>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )}

                        </TableBody>
                    </StyledTable>
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
                </TableContainer>
            </Box>

        </>
    )
}

export default PropertyList