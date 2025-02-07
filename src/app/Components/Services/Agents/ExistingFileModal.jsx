import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { handleExistingExelFileExport } from '@app/API/Tenant';
import API from 'Constance';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';

const ExistingFileModal = ({ open, handleClose, downloadUrl, data }) => {
    const { user } = useSelector(state => state.auth)
    const [filedata, setFileData] = useState({
        ...data
    })
    const dispatch = useDispatch()


    const handleDownload = () => {
        dispatch(setIsLoading({ data: true }))
        const link = document.createElement('a');
        link.href = data?.url;
        link.download = data.url.split('/')[2];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        handleClose()
        dispatch(setIsLoading({ data: false }))
    };

    const uploadExelforApproval = async () => {
        // addedBy: user?._id,
        // addedByRole: user?.role,
        // addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
        const formData = new FormData();

        formData.append('file', filedata?.file);
        formData.append('_id', user?._id);
        formData.append('addedBy', filedata?.addedBy);
        formData.append('addedByRole', filedata?.addedByRole);
        formData.append('addedByModel', filedata?.addedByModel);
        dispatch(handleExistingExelFileExport({ formData }));
        setFileData({})
        handleClose()
    }


    const uploadFile = async () => {
        const formData = new FormData();

        // addedBy: user?._id,
        // addedByRole: user?.role,
        // addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
        formData.append('file', filedata?.file);
        formData.append('addedBy', filedata?.addedBy);
        formData.append('addedByRole', filedata?.addedByRole);
        formData.append('addedByModel', ['company', 'agent'].includes(user?.role) ? "User" : "Staff");

        // return console.log(formData);

        dispatch(setIsLoading({ data: true }))
        // setLoading(true);
        try {
            const result = await API.post("api/tenents/import-tenants", formData)
            if (result.data.success) {

                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: result.data.message, severity: 'success' }))
                handleClose()
            } else {

                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: result.error, severity: 'error' }))
                // console.error(result.error);
            }
        } catch (error) {
            // setSuccess(false)
            dispatch(showSnackbar({ message: error.message || 'File upload error', severity: 'error' }))
            // console.error('File upload error:', error);
        } finally {
            dispatch(setIsLoading({ data: false }))
            // setLoading(false);
        }
    }



    return (
        <Dialog maxWidth='md' open={open} onClose={handleClose}>
            <DialogTitle>Download File</DialogTitle>
            <DialogContent>

                <FlotingLableInput
                    apiEndPoint=""
                    label="Add Excel or CSV File here"
                    accept=".xlsx, .csv"
                    allowedExtensions={["xlsx", "csv"]}
                    maxSize={10} // 10MB
                    required
                    type="offline-file"
                    value={filedata?.file || ''}
                    showPreview={false}
                    onChange={(file) => { setFileData((pre) => ({ ...pre, file })) }}
                    uploadFile={uploadFile}
                    // helperText={errors?.file || "Select a file to upload."}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Typography my={2}>
                    Click the button below to download the existing file.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleDownload} color="primary" variant="contained">
                    Download
                </Button>


            </DialogActions>
        </Dialog>
    );
};

export default ExistingFileModal;
