import { Box, Button, MenuItem, Select, styled, TextField, Typography } from '@mui/material'
import React from 'react'
import FileUpload from './FileUploas'

const FlotingLableInput = ({ allowedExtensions, showPreview, accept, menuItems = [{ val: '', label: '' }], select, events, name, label, type, placeholder, className, onChange, value, errors, fullWidth, InputLabelProps, required, inputProps }) => {

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
    }
    // console.log(errors)
    if (!select && ['text', 'date', "datetime - local"].includes(type)) {
        return (
            <>
                <TextField
                    accept={accept}
                    required={required}
                    name={name}
                    label={label}
                    fullWidth={fullWidth}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    className={className}
                    {...events}
                    variant='outlined'
                    value={value || ''}
                    error={errors && errors[name]}
                    helperText={errors && errors[name]}
                    InputLabelProps={{ ...InputLabelProps, shrink: type === "date" || 'text' ? true : false }}
                    inputProps={inputProps}
                />
            </>
        )
    }
    if (['file'].includes(type)) {
        return (
            <FileUpload
                label={label}
                accept={accept}
                // accept="image/*"
                name={name}
                allowedExtensions={allowedExtensions}
                // allowedExtensions={['jpg', 'jpeg', 'png']}
                maxSize={5} // 10MB
                required={required}
                value={value}
                showPreview={showPreview}
                onChange={onChange}
                error={errors}
                helperText={errors}
            />
        )
        // return (
        //     <>
        //         <Typography>{label}</Typography>
        //         <Box justifyContent='start' alignItems='center' display='flex'>
        //             <input
        //                 id={name}
        //                 accept={accept}
        //                 required={required}
        //                 name={name}
        //                 label={label}
        //                 fullWidth={fullWidth}
        //                 onChange={(e) => { onChange(e); console.log(e); handleFileChange(e) }}
        //                 type={type}
        //                 placeholder={placeholder}
        //                 className={className}
        //                 {...events}
        //                 variant='outlined'
        //                 value={value}
        //                 error={errors && errors[name]}
        //                 helperText={errors && errors[name]}
        //                 InputLabelProps={InputLabelProps}
        //                 inputProps={inputProps}
        //             />
        //             <Button
        //                 variant="contained"
        //                 component="label"
        //                 color="primary"
        //                 htmlFor={name}
        //             >
        //                 Upload
        //             </Button>
        //         </Box>

        //     </>
        // )
    }
    if (select) {



        return (<TextField
            // default={default}
            select={select}
            required={required}
            name={name}
            label={label}
            fullWidth={fullWidth}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={className}
            {...events}
            variant='outlined'
            value={value || ''}
            error={errors && errors[name] || false}
            helperText={errors && errors[name] || ''}
            InputLabelProps={{
                ...InputLabelProps
            }}
            inputProps={inputProps}
        >
            {menuItems.length > 0 && menuItems.map(({ val, label }, i) => (<MenuItem key={i} value={val}>{label}</MenuItem>))}
        </TextField>)
    }


    if (['textarea'].includes(type)) {
        return (

            // </TextField >
            <TextField
                multiline
                rows={2}
                required={required}
                name={name}
                label={label}
                fullWidth={fullWidth}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className={className}
                {...events}
                variant='outlined'
                value={value}
                error={errors && errors[name]}
                helperText={errors && errors[name]}
                InputLabelProps={InputLabelProps}
                inputProps={{ style: { height: '50px', wordBreak: 'break-word' }, ...inputProps }}
            />
        )
    }

}

export default FlotingLableInput