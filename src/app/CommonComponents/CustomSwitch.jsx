import React, { useState } from 'react';
import { FormGroup, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ErrorMessage } from 'formik';

const RoleSelector = ({ errors, touched, handleChange, values }) => {
    const [selectedRole, setSelectedRole] = useState(values?.role ? values?.role : '1'); // Set default role

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        // console.log(values?.role)
        handleChange({ target: { name: 'role', value: event.target.value } });
    };

    const RoleButtonGroup = styled(RadioGroup)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "start",
    }));

    return (
        <FormGroup>
            <FormLabel id="role-selector">
                <Typography variant="h6" component="label">
                    Who Are You?
                </Typography>
            </FormLabel>
            <RoleButtonGroup row aria-labelledby="role-selector" name="role" value={selectedRole} onChange={handleRoleChange}>
                <FormControlLabel value="1" control={<Radio />} label="Doctor" />
                <FormControlLabel value="2" disabled control={<Radio />} label="Owner" />
            </RoleButtonGroup>
            <ErrorMessage  name="role" component="div" />
        </FormGroup>
    );
};

export default RoleSelector;
