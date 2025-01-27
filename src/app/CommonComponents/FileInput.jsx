import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleFileUpload } from '@app/Utils/utils';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import API from 'Constance';


const FileInput = (
    {
        label = 'Upload File',
        accept,
        maxSize = 5,
        allowedTypes = [],
        allowedExtensions = [],
        onChange,
        value,
        error,
        helperText,
        required = false,
        disabled = false,
        showPreview = true,
        apiEndPoint,
        uploadFile
    }
) => {


    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fileObj, setFileObj] = useState({})
    const dispatch = useDispatch()
    const handleChange = async (event) => {
        const files = event.target.files;

        for (const file of files) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                dispatch(showSnackbar({ message: `Invalid file type: ${file.name}`, severity: 'error' }))
                event.target.value = ''; // Clear the invalid selection
                break;
            }
        }

        const file = event.target.files[0];
        if (!file) return;
        onChange && onChange(file);
        setFileObj(file)
    };


   
    const handleRemove = () => {
        setFileObj({})
        onChange && onChange(null);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>

            <Box
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    bgcolor: disabled ? '#f5f5f5' : 'background.paper',
                    cursor: disabled ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? (
                    <CircularProgress size={24} />
                ) : value ? (
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            {value.name}
                        </Typography>
                        {showPreview && (
                            <img
                                src={URL.createObjectURL(value)}
                                alt="preview"
                                style={{ maxWidth: '100%', maxHeight: 200 }}
                            />
                        )}
                        {!success && <>
                            <Button
                                startIcon={<DeleteIcon />}
                                onClick={handleRemove}
                                disabled={disabled}
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                Remove
                            </Button>
                            <Button
                                onClick={() => uploadFile()}
                                disabled={disabled}
                                sx={{ mt: 1 }}
                                color="success"
                                variant='outlined'
                            >
                                Upload File
                            </Button>
                        </>

                        }
                    </Box>
                ) : (
                    <Box>
                        <input
                            accept={accept}
                            style={{ display: 'none' }}
                            id={`file-upload-${label}`}
                            type="file"
                            onChange={handleChange}
                            disabled={disabled}
                        />
                        <label htmlFor={`file-upload-${label}`}>
                            <Button
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                disabled={disabled}
                            >
                                Choose File
                            </Button>
                        </label>

                        <Typography variant="caption" display="block" color="textSecondary">
                            {`Max size: ${maxSize}MB${allowedExtensions.length ? `, Allowed types: ${allowedExtensions.join(', ')}` : ''}`}
                        </Typography>
                    </Box>
                )}
            </Box>

            {error && (
                <Typography color="error" variant="caption">
                    {helperText}
                </Typography>
            )}
        </Box>
    )
}
export default FileInput;