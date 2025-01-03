import DynamicTitle from '@app/CommonComponents/DynamicTitle'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Chip,
    Stack,
    IconButton,
    Grid,
    Icon,
    TablePagination
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import API from 'Constance'
import { useLocation, useNavigate } from 'react-router-dom'
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice'
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice'
import PaginationTable from '@app/CommonComponents/TableComponent'
import { debounce } from 'lodash'

const Email = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rslId = queryParams.get('user');

    useEffect(() => {
        if (rslId != '') {
            FetchEmailData()
        }
    }, [rslId])

    const { user, isAuthenticate, token } = useSelector((state) => state.auth);
    const [editData, setEditData] = useState({ emailto: user?.emailto, })
    const [companyEmails, setCompanyEmails] = useState([...user?.emailcc.split(',')])
    const [companyEmailsLogs, setCompanyEmailLogs] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalpage, setTotalPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalcount, setTotalCount] = useState(0);
    useEffect(() => {
        if (user?._id) {
            FetchEmailLogsData()
        }
    }, [page, searchQuery, rowsPerPage])
    const handleSearchChange = useCallback(debounce((val) => {
        setSearchQuery(val.target.value.trim());
    }, 500), [])
    const dispatch = useDispatch()
    const navigation = useNavigate()
    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: true,
        initialValues: {
            ...editData
        },
        validationSchema: Yup.object({
            emailto: Yup.string().email('Invalid email address').required('Required'),
            emailcc: Yup.string().email('Invalid email address')
        }),
        onSubmit: async (values) => {
            const modifyVal = { ...values, emailcc: companyEmails.toString(), _id: user?._id, role: user?.role }
            try {
                dispatch(setIsLoading({ data: true }))
                const res = await API.post('/api/user/addemail', modifyVal)
                if (res.data?.message) {
                    dispatch(showSnackbar({ message: res.data?.message, severity: 'success' }))
                }
                FetchEmailData()
                dispatch(setIsLoading({ data: false }))
            } catch (error) {
                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: 'something went wrong!' || error.response.data.message, severity: 'error' }))
            }

        }
    })

    const FetchEmailLogsData = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/user/getemaillogs', {
                params: {
                    userId: user?._id,
                    page: page,
                    limit: rowsPerPage,
                    search: searchQuery,
                }
            })
            // if (res.data?.message) {
            //     dispatch(showSnackbar({ message: res.data?.message, severity: 'success' }))
            // }
            setCompanyEmailLogs([...res.data?.data])
            setTotalCount(res.data?.pagination?.total)
            setTotalPage(res.data?.pagination?.page)
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: 'something went wrong!' || error.response.data.message, severity: 'error' }))
        }
    }


    const FetchEmailData = async () => {
        try {
            dispatch(setIsLoading({ data: true }))
            const res = await API.get('/api/user/emails', { params: { _id: user?._id, role: user?.role } })
            // if (res.data?.message) {
            //     dispatch(showSnackbar({ message: res.data?.message, severity: 'success' }))
            // }
            if (res.data?.data?.emailcc !== '') {
                setCompanyEmails([...res.data?.data?.emailcc.split(',')])
            }
            setEditData(res.data?.data)
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: 'something went wrong!' || error.response.data.message, severity: 'error' }))
        }
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        // setPage(1);
    };
    const handleChangePage = (_, newPage) => {
        // if (newPage > 0) {
        setPage(newPage + 1);
        // }
    };


    const handleAddEmail = () => {

        if (formik.values.emailcc && !formik.errors.emailcc) {
            setCompanyEmails([...companyEmails, `${formik.values.emailcc}`])
            formik.setFieldValue('emailcc', '')
        }
    }

    const handleDeleteEmail = (emailToDelete) => {
        setCompanyEmails(companyEmails.filter(email => email !== emailToDelete))
    }

    return (
        <>

            <DynamicTitle title='Users' />
            <Box p={2} sx={{ backgroundColor: '#f2f2f2' }}>
                <Paper sx={{ p: 3, maxWidth: 900, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Production Environment
                    </Typography>

                    <form>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Email To
                            </Typography>
                            <TextField
                                fullWidth
                                name="emailto"
                                value={formik.values.emailto}
                                onChange={formik.handleChange}
                                error={formik.touched.emailto && Boolean(formik.errors.emailto)}
                                helperText={formik.touched.emailto && formik.errors.emailto}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Emails CC
                            </Typography>
                            <Grid >
                                <Stack display='flex' flexDirection='row' flexWrap='wrap' width='100%' gap={1} direction="row" spacing={1} sx={{ mb: 2 }}>
                                    {companyEmails.map((email, i) => (
                                        <Chip
                                            sx={{
                                                fontSize: 15,
                                                // backgroundColor: '#7f98e6',
                                                // color: '#fff', // White icon color
                                                // border: '1px solid #1565c0', // Slightly darker border
                                                padding: 1.5,
                                                '&:hover': {
                                                    backgroundColor: '#1565c0',
                                                    color: '#fff'// Darker blue on hover
                                                },
                                                '&:disabled': {
                                                    backgroundColor: '#e0e0e0', // Light grey when disabled
                                                    color: '#9e9e9e', // Grey for the icon when disabled
                                                },
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
                                                transition: 'all 0.3s ease', // Smooth transition
                                            }}
                                            key={i}
                                            label={email}
                                            onDelete={() => handleDeleteEmail(email)}
                                            deleteIcon={<DeleteIcon />}
                                        />
                                    ))}
                                </Stack>
                            </Grid>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    fullWidth
                                    name="emailcc"
                                    value={formik.values.emailcc}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (companyEmails.includes(value)) {
                                            formik.setErrors({ emailcc: 'Email already exists' });
                                            return
                                        } else {
                                            formik.setErrors({ emailcc: '' });
                                        }
                                        formik.handleChange(e);
                                    }}
                                    error={formik.touched.emailcc && Boolean(formik.errors.emailcc)}
                                    helperText={formik.touched.emailcc && formik.errors.emailcc}
                                    placeholder="Add new email"
                                />
                                <Box>

                                    <IconButton
                                        sx={{
                                            backgroundColor: '#1976d2', // Primary blue color
                                            color: '#fff', // White icon color
                                            // border: '1px solid #1565c0', // Slightly darker border
                                            padding: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#1565c0', // Darker blue on hover
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#e0e0e0', // Light grey when disabled
                                                color: '#9e9e9e', // Grey for the icon when disabled
                                            },
                                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
                                            transition: 'all 0.3s ease', // Smooth transition
                                        }}
                                        onClick={handleAddEmail}
                                        disabled={!formik.values.emailcc || Boolean(formik.errors.emailcc)}
                                        onKeyUp={(e) => {

                                            if (e.key === 'Enter') {
                                                handleAddEmail();
                                            }
                                        }}
                                    >
                                        <Icon>add</Icon>
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Box>

                        <Button type="button" onClick={() => formik.handleSubmit()} variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                </Paper>

                <Paper sx={{ p: 3, maxWidth: "100%", mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Email Log
                    </Typography>
                    <Box>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            mb={2}
                        >
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search..."
                                // value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{ width: 300 }}
                            />
                        </Box>
                        <PaginationTable
                            style={{
                                overflowY: 'auto',
                                maxHeight: '500px'
                            }}
                            data={companyEmailsLogs}
                            headCells={[
                                // { label: 'ID', key: 'id' },
                                { label: 'Email (To)', key: 'emailTo' },
                                { label: 'Subject', key: 'subject'},
                                { label: 'Message', key: 'body', html: true },
                                { label: 'Attechment', key: 'attachments' },
                                { label: 'CC', key: 'emailCC' },
                                { label: 'Time (Uk timezone)', key: 'createdAt', formate:"DD-MM-YYYY hh:mm A" },
                            ]} />
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
                </Paper>


            </Box>

        </>
    )
}

export default Email