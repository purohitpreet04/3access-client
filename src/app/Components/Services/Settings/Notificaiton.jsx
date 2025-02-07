import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { is } from 'date-fns/locale';
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import { updateUserData } from '@app/Redux/Sclice/AuthSclice';
import API from 'Constance';

export default function EmailToggle() {
    // State to manage the toggle
    const { user } = useSelector(state => state?.auth)
    const [emailEnabled, setEmailEnabled] = useState(user?.sendEmail === 1 ? true : false);
    let dispatch = useDispatch();

    // useEffect(()=>{

    // },[user?._id, dispatch])

    // Handle the switch toggle
    const handleToggle = async (event) => {
        dispatch(setIsLoading({ data: true }));
        setEmailEnabled(event.target.checked);
        let status = event.target.checked ? 1 : 0;
        let res = await API.get('/api/user/email-notification', { params: { status, agentId: user?._id } });
        dispatch(setIsLoading({ data: false }));
        dispatch(showSnackbar({ message: res.data?.message, severity: res.data.success ? 'success' : 'error' }));
        // dispatch(updateUserData({sendEmail:status}))
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                Email Notifications
            </Typography>
            <FormControlLabel
                control={<Switch checked={emailEnabled} onChange={handleToggle} />}
                label={emailEnabled ? "Enabled" : "Disabled"}
            />
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                {emailEnabled ? "Email sending is enabled." : "Email sending is disabled."}
            </Typography>
        </Box>
    );
}
