import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { handleDownload } from '@app/Utils/CustomHooks';
import { Box, Button, Typography } from '@mui/material';
import API from 'Constance';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
const PdfHandle = ({ documents = [] }) => {



    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tenantId = queryParams.get('t');
    const dispatch = useDispatch()
    const navigation = useNavigate();

    // const [documents, setDocuments] = useState([])




    if (documents.length == 0) {
        return null
    }


    return (
        <div>
            {documents.map((doc) => (
                <Box
                    key={doc?.name}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #eee',
                        py: 1
                    }}
                >
                    <Typography>{doc?.name}</Typography>
                    <Box>
                        <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            sx={{
                                bgcolor: '#337ab7',
                                color: 'white',
                                mr: 1,
                                '&:hover': {
                                    bgcolor: '#286090'
                                }
                            }}

                            onClick={() => {
                                // window.open(`/document?type=${doc.type}&t=${tenantId}`, '_blank')
                                handleDownload({ type: doc._id, id: tenantId, tempname:doc?.name }, dispatch)
                            }}
                        >
                            Download
                        </Button>
                        <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            sx={{
                                bgcolor: '#337ab7',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: '#286090'
                                }
                            }}
                            onClick={() => {
                                window.open(`/document?type=${doc?._id}&t=${tenantId}`, '_blank')
                                // handleView({ type: doc.type, id: tenantId })
                            }}
                        >
                            View
                        </Button>
                    </Box>
                </Box>
            ))}
        </div>
    )
}

export default PdfHandle