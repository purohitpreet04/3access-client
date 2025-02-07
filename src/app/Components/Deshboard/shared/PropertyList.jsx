import PaginationTable from '@app/CommonComponents/TableComponent';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
// import { makeStyles } from '@mui/styles';
import API from 'Constance';
import { debounce } from 'lodash';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { mainuser, staffuser } from '@app/Utils/constant';
import { StackCards } from '.';
import { Bed, Group, House, Room } from '@mui/icons-material';
import { CheckHasOneStaff, signOutTenant } from '@app/API/Tenant';
import { getDate } from '@app/Utils/utils';
import clsx from 'clsx';
import When from '@app/CommonComponents/When';
import SignOutModal from '@app/Components/Services/Tenants/SignOutModal';

const PropertyList = () => {
    const theme = useTheme();
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
    const [signout, setSignOut] = useState({});
    const [listData, setListData] = useState([])
    const [stackData, setStackList] = useState([...stacklist])
    const [editData, setEditData] = useState({})
    const { user } = useSelector(state => state.auth)
    const location = useLocation();
    const dispatch = useDispatch()
    const navigation = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

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
        // fontSize: 20,
        fontWeight: 'bold',
        padding: "10px 16px !important",
        maxWidth: "fit-content !important",
        whiteSpace: "nowrap !important",
        width: "fit-content !important",
        overflow: "hidden !important",
        textOverflow: "ellipsis !important",
        fontSize: "clamp(12px, 1vw, 16px) !important"
    }));





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

        setSignOut({ isOpen: true, id, propertyid: propertyid, userId: user?._id, })
        return
        dispatch(
            signOutTenant({
                id,
                propertyid,
                userId: user?._id,
                isPresent,
                withOutMail,
                navigate: navigation,
            })
        ).then(() => {
            fetchStaff(); // Trigger a refresh of tenant data
        });
    }


    const checkHasOneStaff = async (pro_id, room) => {


        if (staffuser.includes(user?.role)) {
            navigation(`/services/addtenants?p=${pro_id}&r=${room}`)
        } else {
            dispatch(CheckHasOneStaff({ navigation: navigation, p: pro_id, r: room }))
        }
    }


    return (
        <>
            <Box width="100%" overflow="auto">
                <StackCards cardList={stackData} />
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    gap={2} // Spacing between dots
                    padding={2}
                >
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Box
                            width={16}
                            height={16}
                            borderRadius="50%" // Makes it a circle
                            bgcolor="#4CAF50" // Green if active
                            border="2px solid #2E7D32" // Border to emphasize
                        />
                        <Typography variant="body2" color="#2E7D32">
                            Active
                        </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Box
                            width={16}
                            height={16}
                            borderRadius="50%" // Makes it a circle
                            bgcolor="#D14747" // Red if not active
                            border="2px solid #C0392B" // Border to emphasize
                        />
                        <Typography variant="body2" color="#C0392B">
                            Not Active
                        </Typography>
                    </Box>
                </Box>
                <TableContainer
                    sx={{
                        padding: 1,
                        width: "100%",
                        overflowX: "auto",
                        boxShadow: theme.shadows[1],
                        // border:'5px solid gray 0.5',
                        // borderRadius: theme.shape.borderRadius,
                        "&::-webkit-scrollbar": {
                            width: 8,
                            height: 8,
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: theme.palette.grey[500],
                            borderRadius: 8,
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            backgroundColor: theme.palette.grey[700],
                        },

                        "& css-1w9byxw-MuiTableContainer-roo": {
                            width: "max-content"
                        },

                        "& span.MuiButtonBase-root.MuiTableSortLabel-root.css-1q574bi-MuiButtonBase-root-MuiTableSortLabel-root": {
                            // display: "block",
                            width: "max-content"
                        },

                        "& td.MuiTableCell-root.MuiTableCell-body.MuiTableCell-alignCenter.MuiTableCell-sizeMedium.css-1htgh2s-MuiTableCell-root": {
                            // width: "100%",
                            minWidth: "181px"
                        },

                        '& table.css-1ieb10p-MuiTable-root': {
                            tableLayout: 'auto',
                        }

                    }}
                    component={Paper}
                >
                    <StyledTable

                        sx={{
                            tableLayout: 'auto',
                            width: "100%",
                            borderCollapse: "collapse", // Ensure proper border spacing
                            "& thead": {
                                backgroundColor: theme.palette?.primary?.light,
                                "& th": {
                                    color: theme.palette.common.white,
                                    padding: theme.spacing(1),
                                    fontSize: 17,
                                    fontWeight: "bold",
                                    border: `1px solid ${theme.palette.divider}`
                                }
                            },
                            "& tbody": {
                                "& td": {
                                    // padding: theme.spacing(1),

                                    textTransform: "capitalize",
                                    border: `1px solid ${theme.palette.divider}`,
                                    wordBreak: "break-word",
                                },
                                "& tr:hover": {
                                    backgroundColor: theme.palette.action.hover
                                }
                            },

                            "& table": {
                                tableLayout: "auto",
                            },

                            "& .css-1ieb10p-MuiTable-root tbody tr td": {
                                // padding: '10px !important',
                                textTransform: "capitalize"
                            }

                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCellstyle
                                    width='5%'
                                    align='center'>Sr no.</TableCellstyle>
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
                                            <TableCell
                                                sx={{
                                                    padding: "10px 16px !important",
                                                    maxWidth: "fit-content !important",
                                                    whiteSpace: "nowrap !important",
                                                    width: "fit-content !important",
                                                    overflow: "hidden !important",
                                                    textOverflow: "ellipsis !important",
                                                    fontSize: "clamp(12px, 1vw, 16px) !important"
                                                }}
                                                style={{ wordBreak: 'break-word' }} align='center'>{index + 1}</TableCell>
                                            <TableCell
                                                sx={{
                                                    padding: "10px 16px !important",
                                                    maxWidth: "fit-content !important",
                                                    whiteSpace: "nowrap !important",
                                                    width: "fit-content !important",
                                                    overflow: "hidden !important",
                                                    textOverflow: "ellipsis !important",
                                                    fontSize: "clamp(12px, 1vw, 16px) !important"
                                                }}

                                                style={{ wordBreak: 'break-word' }} align='center'>{property.companyname}</TableCell>
                                            <TableCell
                                                sx={{
                                                    padding: "10px 16px !important",
                                                    maxWidth: "fit-content !important",
                                                    whiteSpace: "nowrap !important",
                                                    width: "fit-content !important",
                                                    overflow: "hidden !important",
                                                    textOverflow: "ellipsis !important",
                                                    fontSize: "clamp(12px, 1vw, 16px) !important"
                                                }}
                                                style={{ wordBreak: 'break-word' }} align='center'>{property.address}</TableCell>
                                            {rooms.map((room) => (
                                                <TableCell
                                                    sx={{
                                                        padding: "10px 16px !important",
                                                        maxWidth: "fit-content !important",
                                                        whiteSpace: "nowrap !important",
                                                        width: "fit-content !important",
                                                        overflow: "hidden !important",
                                                        textOverflow: "ellipsis !important",
                                                        fontSize: "clamp(12px, 1vw, 16px) !important"
                                                    }}
                                                    style={{ wordBreak: 'break-word' }} align="center" key={room.key}>
                                                    {property[room.key] ? (
                                                        property[room.key].tenant_id ? (
                                                            <Box
                                                                ml={1}
                                                                p={1}
                                                                flexDirection='column'
                                                                display='flex' justifyContent='center' alignItems='center'
                                                                // bgcolor={property[room.key].tenant_id?.status == 1 ? '#DFF2D8' : '#FADBD8'} // Soft green for active, soft red for not active
                                                                color={property[room.key].tenant_id?.status == 1 ? '#2E7D32' : '#C0392B'} // Darker matching text color
                                                            >
                                                                <Box
                                                                    width={16}
                                                                    height={16}
                                                                    position='relative'
                                                                    right={70}
                                                                    top={-5}
                                                                    borderRadius="50%" // Makes it a circle
                                                                    bgcolor={property[room.key].tenant_id?.status == 1 ? '#4CAF50' : '#D14747'} // Green if active
                                                                    border="2px solid #2E7D32" // Border to emphasize
                                                                />
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
                                                                <Clickablelink>
                                                                    Status: {property[room.key].tenant_id.status == 1 ? 'Active' : 'Not Active'}
                                                                </Clickablelink>

                                                            </Box>
                                                        ) : (
                                                            <Box flexDirection='column' display='flex' justifyContent='center' alignItems='center'>
                                                                {mainuser.includes(user.role) ? (<Clickablelink onClick={() => { checkHasOneStaff(property._id, room.roomNumber) }}>
                                                                    Signup new Tenant
                                                                </Clickablelink>) : (<>
                                                                    {user?.permmission.includes(7) ? <Clickablelink to={`/services/addtenants?p=${property._id}&r=${room.roomNumber}`} >
                                                                        Signup new Tenant
                                                                    </Clickablelink> : <Clickablelink>---</Clickablelink>}
                                                                </>)}
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
                                        <TableCell
                                            colSpan={12}


                                            sx={{
                                                padding: "10px 16px !important",
                                                maxWidth: "fit-content !important",
                                                whiteSpace: "nowrap !important",
                                                width: "fit-content !important",
                                                overflow: "hidden !important",
                                                textOverflow: "ellipsis !important",
                                                fontSize: "clamp(12px, 1vw, 16px) !important",
                                            borderBottom: 'none', padding: 0
                                            }}>
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
                </TableContainer>
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
                when={signout?.isOpen === true}
                component={<SignOutModal
                    handleClose={() => { setSignOut({ isOpen: false }) }}
                    open={signout?.isOpen}
                    data={{ ...signout }}
                    signOut={{ ...signout }}
                    refetch={fetchStaff}
                />}
            />
        </>
    )
}

export default PropertyList