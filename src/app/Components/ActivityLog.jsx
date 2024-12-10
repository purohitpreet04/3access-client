import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent, CardHeader, Avatar, Typography, Stack, Tooltip
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { green, blue, red } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { fetchActivityLogs } from '@app/API/ActivityLogs';
import { useLocation } from 'react-router-dom';
import PaginationTable from '@app/CommonComponents/TableComponent';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
const ActivityLog = () => {
    const { logs } = useSelector(state => state?.activitylog)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uId = queryParams.get('user');
    const [activitylogs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    // const [open, setOpen] = useState(false);
    const [totalcount, setTotalCount] = useState(0);
    const dispatch = useDispatch()
    const actionColor = (action) => {
        switch (action) {
            case 'ADD':
                return green[500];
            case 'EDIT':
                return blue[500];
            case 'DELETE':
                return red[500];
            default:
                return 'default';
        }
    };
    // console.log(logs)
    useEffect(() => {
        fetchLogs();
    }, [page, rowsPerPage, searchQuery, filter]);

    useEffect(() => {
        setLogs(logs?.data)
    }, [logs?.data])

    const fetchLogs = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            await dispatch(fetchActivityLogs({ userId: uId, page: page, rowsPerPage, searchQuery, Filter: filter }))
        } catch (error) {
            console.error('Error fetching logs:', error);
            dispatch(setIsLoading({ data: false }))
        } finally {
            dispatch(setIsLoading({ data: false }))
        }
    };
    const actionIcons = {
        ADD: <Tooltip title="Add Action"><AddIcon color="success" /></Tooltip>,
        EDIT: <Tooltip title="Edit Action"><EditIcon color="primary" /></Tooltip>,
        DELETE: <Tooltip title="Delete Action"><DeleteIcon color="error" /></Tooltip>,
    };


    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 3,
                p: 3,
            }}
        >
            {activitylogs?.length > 0 && activitylogs.map((log) => (
                <Card
                    key={log._id}
                    sx={{
                        boxShadow: 4,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 6,
                        },
                        borderRadius: 2,
                    }}
                >
                    <CardHeader
                        avatar={
                            <Avatar
                                sx={{
                                    bgcolor: log.actionType === 'DELETE' ? 'error.main' : 'primary.main',
                                    color: 'white',
                                }}
                            >
                                <AccountCircleIcon />
                            </Avatar>
                        }
                        title={
                            <Typography variant="h6" component="div" color="text.primary" noWrap>
                                {log.entityType}
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body2" color="text.secondary">
                                {format(new Date(log.timestamp), 'PPpp')}
                            </Typography>
                        }
                    />
                    <CardContent sx={{ px: 3, py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {actionIcons[log.actionType]}
                            <Typography variant="body1" fontWeight="bold" color="text.primary">
                                {log.actionType}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            {log.description || 'No description provided.'}
                        </Typography>
                        {/* {log.templateData && (
                            <Box mt={3} p={2} sx={{ background: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Details:
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                    {Object.entries(log.templateData)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')}
                                </Typography>
                            </Box>
                        )} */}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    // return (

    //     <Box sx={{ padding: 2 }}>
    //         <Typography variant="subtitle2" gutterBottom>
    //             Activity Logs
    //         </Typography>
    //         <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    //             <TextField
    //                 label="Search"
    //                 variant="outlined"
    //                 size="small"
    //                 value={searchQuery}
    //                 onChange={(e) => setSearchQuery(e.target.value)}
    //             />
    //             <FormControl size="small" sx={{ minWidth: 150 }}>
    //                 <InputLabel>Filter</InputLabel>
    //                 <Select
    //                     value={filter}
    //                     onChange={(e) => setFilter(e.target.value)}
    //                     label="Filter"
    //                 >
    //                     <MenuItem value="">All</MenuItem>
    //                     <MenuItem value="ADD">Add</MenuItem>
    //                     <MenuItem value="EDIT">Edit</MenuItem>
    //                     <MenuItem value="DELETE">Delete</MenuItem>
    //                 </Select>
    //             </FormControl>
    //         </Box>
    //         <PaginationTable
    //             data={activitylogs}
    //             headCells={[
    //                 { label: 'Action', key: 'actionType' },
    //                 { label: 'Action', key: 'actionType' },
    //                 { label: 'Action', key: 'actionType' },
    //                 { label: 'Action', key: 'actionType' },
    //                 { label: 'Action', key: 'actionType' },

    //             ]}
    //         />
    //     </Box>



    // );
};

export default ActivityLog;
