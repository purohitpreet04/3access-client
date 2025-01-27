import FlotingLableInput from "@app/CommonComponents/FlotingLableInput";
import { setIsLoading } from "@app/Redux/Sclice/manageStateSclice";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";
import { Box, Button, Typography } from "@mui/material";
import API from "Constance";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ExistingTenant = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const { user } = useSelector(state => state?.auth)

    const formik = useFormik({
        initialValues: {},
        enableReinitialize: true,
    })

    let { values, errors, setFieldValue, setValues } = formik


    const fetchExistingTenantFile = async () => {
        try {
            const res = await API.get('')
        } catch (error) {
            dispatch(showSnackbar({ message: error.message || 'error while fetching file', severity: 'error' }))
            dispatch(setIsLoading({ data: false }))
        }
    }


    const uploadFile = async () => {
        const formData = new FormData();

        // addedBy: user?._id,
        // addedByRole: user?.role,
        // addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
        formData.append('file', values?.file);
        formData.append('addedBy', user?._id);
        formData.append('addedByRole', user?.role);
        formData.append('addedByModel', ['company', 'agent'].includes(user?.role) ? "User" : "Staff");

        // return console.log(formData);

        dispatch(setIsLoading({ data: true }))
        // setLoading(true);
        try {
            const result = await API.post("api/tenents/import-tenants", formData)
            if (result.success) {

                dispatch(setIsLoading({ data: false }))
                dispatch(showSnackbar({ message: result.message, severity: 'success' }))
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
            setLoading(false);
        }
    }

    const uploadExelforApproval = async () => {
        try {
            const formData = new FormData();
            // addedBy: user?._id,
            // addedByRole: user?.role,
            // addedByModel: ['company', 'agent'].includes(user?.role) ? "User" : "Staff",
            formData.append('file', values?.file);
            formData.append('addedBy', user?._id);
            formData.append('addedByRole', user?.role);
            formData.append('addedByModel', ['company', 'agent'].includes(user?.role) ? "User" : "Staff");
            dispatch(setIsLoading({ data: true }))
            const result = await API.post("api/user/upload-Excel", formData)
            if (result.success) {
                setFieldValue('path', result?.data?.path)
                setValues((pre) => ({ ...pre, file: '' }))
                dispatch(showSnackbar({ message: result.data.message || 'File Uploaded', severity: 'success' }))
                setValues({})
            } else {
                setValues({})
                dispatch(showSnackbar({ message: 'File Uploaded', severity: 'success' }))
            }
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: error.message || 'File upload error', severity: 'error' }))
        }
    }

    const downloadTemplate = async () => {

        try {
            dispatch(setIsLoading({ data: true }))
            const result = await API.get("api/download/demo-file")
            // const templateFileURL = "/path/to/template/file.xlsx"; // Replace with the actual URL
            const link = document.createElement("a");
            link.href = result?.data?.url;
            link.download = "Tenant_Template.xlsx";
            link.click();
            dispatch(setIsLoading({ data: false }))
        } catch (error) {
            dispatch(setIsLoading({ data: false }))
            dispatch(showSnackbar({ message: error.message || 'File upload error', severity: 'error' }))
        }

    };

    // return (
    //     <Box>
    //         <FlotingLableInput
    //             apiEndPoint=""
    //             label="Add Exal file for add Existing Tenants"
    //             accept=".xlsx, .csv"
    //             allowedExtensions={['xlsx', 'csv']}
    //             maxSize={10} // 10MB
    //             required
    //             type='offline-file'
    //             value={values.file}
    //             showPreview={false}
    //             onChange={(file) => { setFieldValue('file', file); }}
    //             uploadFile={uploadFile}
    //             error={errors?.file}
    //             helperText={errors?.file}
    //             InputLabelProps={{
    //                 shrink: true,
    //             }}
    //         />
    //     </Box>
    // )

    return (
        <Box sx={{ p: 3 }}>
            {/* Instructions for the user */}
            <Typography variant="h6" gutterBottom>
                Add Existing Tenants
            </Typography>
            <Typography variant="body2" gutterBottom>
                Upload an Excel (.xlsx) or CSV (.csv) file to add existing tenants. Make sure the file is properly formatted
                according to the requirements.
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Instructions:
                <ul>
                    <li>The file should include valid tenant data.</li>
                    <li>Only .xlsx or .csv file formats are accepted.</li>
                </ul>
            </Typography>
            <Typography variant="body2" gutterBottom>
                Follow the steps below to add existing tenants:
                <ol>
                    <li>
                        <strong>Download the template file:</strong> Click the button below to download the sample/template file.
                    </li>
                    <li>
                        <strong>Fill in the required data:</strong> Open the downloaded file and fill in the tenant data as per the format provided.
                    </li>
                    <li>
                        <strong>Upload the updated file:</strong> After filling in the data, upload the updated file using the file input below.
                    </li>
                </ol>
                {/* <strong>Note:</strong> Only Excel (.xlsx) or CSV (.csv) files are supported. The maximum file size allowed is 10MB. */}
            </Typography>
            {/* Download Template File Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={downloadTemplate}
                sx={{ mb: 2 }}
            >
                Download Template File
            </Button>

            {/* File upload input */}
            {[1].includes(user?.isMainMA) ? <FlotingLableInput
                apiEndPoint=""
                label="Add Excel or CSV File"
                accept=".xlsx, .csv"
                allowedExtensions={["xlsx", "csv"]}
                maxSize={10} // 10MB
                required
                type="offline-file"
                value={values.file}
                showPreview={false}
                onChange={(file) => setFieldValue("file", file)}
                uploadFile={uploadFile}
                error={errors?.file}
                helperText={errors?.file || "Select a file to upload."}
                InputLabelProps={{
                    shrink: true,
                }}
            />
                : <FlotingLableInput
                    apiEndPoint=""
                    label="Add Excel or CSV File"
                    accept=".xlsx, .csv"
                    allowedExtensions={["xlsx", "csv"]}
                    maxSize={10} // 10MB
                    required
                    type="offline-file"
                    value={values.file}
                    showPreview={false}
                    onChange={(file) => setFieldValue("file", file)}
                    uploadFile={uploadExelforApproval}
                    error={errors?.file}
                    helperText={errors?.file || "Select a file to upload."}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            }
        </Box>
    );
}

export default ExistingTenant