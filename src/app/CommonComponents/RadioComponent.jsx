import React, { useState } from 'react';
import { FormGroup, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ErrorMessage } from 'formik';
import { Small } from '@app/Components/Typography';

const RadioComponent = ({ title,title2, name, valArr, handleChange, value, error, direction = 'hor' }, props) => {


    const RoleButtonGroup = styled(RadioGroup)(({ theme }) => ({
        display: 'flex',
        flexDirection: direction === 'ver' ? 'column' : 'row',
        // alignItems: 'center',
        // justifyContent: "start",
    }));

    if (valArr && valArr.lenght != 0) {
        return (
            <>
                <FormGroup {...props}>
                    <FormLabel id="common-selector">
                        <Typography color='black' variant="subtitle1" component="label">
                            {title}
                        </Typography>
                    </FormLabel>
                        {title2 && <Small>{title2}</Small>}

                    <RoleButtonGroup defaultValue={false} row aria-labelledby="common-selector" value={value || false} name={name} onChange={handleChange}>
                        {valArr.map(({ value, label, checked, onChange, defaultChecked }) => (
                            <FormControlLabel defaultChecked={defaultChecked} value={value} control={<Radio value={value} checked={checked} onChange={onChange} />} label={label} />
                        ))}
                    </RoleButtonGroup>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {/* <ErrorMessage name={name} component="div" /> */}
                </FormGroup>
            </>
        )
    } else {
        return null
    }
}

export default RadioComponent