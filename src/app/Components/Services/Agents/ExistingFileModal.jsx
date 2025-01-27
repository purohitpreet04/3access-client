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
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { handleExistingExelFileExport } from '@app/API/Tenant';

const ExistingFileModal = ({ open, handleClose, downloadUrl, data }) => {

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
        formData.append('addedBy', filedata?.addedBy);
        formData.append('addedByRole', filedata?.addedByRole);
        formData.append('addedByModel', filedata?.addedByModel);
        dispatch(handleExistingExelFileExport({ formData }));
        setFileData({})
        handleClose()
    }


    return (
        <Dialog maxWidth='md' open={open} onClose={handleClose}>
            <DialogTitle>Download File</DialogTitle>
            <DialogContent>

                <FlotingLableInput
                    apiEndPoint=""
                    label="Add Excel or CSV File"
                    accept=".xlsx, .csv"
                    allowedExtensions={["xlsx", "csv"]}
                    maxSize={10} // 10MB
                    required
                    type="offline-file"
                    value={filedata?.file || ''}
                    showPreview={false}
                    onChange={(file) => { setFileData((pre) => ({ ...pre, file })) }}
                    uploadFile={uploadExelforApproval}
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
