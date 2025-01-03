import { Box } from '@mui/material';
import React from 'react';
import { SettingEmails } from '..';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';

const Profile = () => {
    return (
        <>
            <DynamicTitle title='User Profile' />
            <Box>
                {/* <SettingEmails /> */}
            </Box>
        </>
    );
};

export default Profile;