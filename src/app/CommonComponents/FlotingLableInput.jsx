import { Autocomplete, Box, Button, MenuItem, Select, styled, TextField, Typography } from '@mui/material'
import React, { forwardRef, useState } from 'react'
import FileUpload from './FileUploas'
import FileInput from './FileInput'
// import { LocalizationProvider, } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers';

const FlotingLableInput = forwardRef(({ defaultValue, allowedExtensions, showPreview, accept, menuItems = [{ val: '', label: '' }], select, events, name, label, type, placeholder, className, onChange, value, errors, fullWidth, InputLabelProps, required, inputProps, disabled, apiEndPoint, uploadFile }, ref) => {

    const [selectedDate, setSelectedDate] = useState(value || '')
    const handleFileChange = (e) => {
        console.log(e.target.files[0])
    }
    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const capitalizedValue = capitalizeFirstLetter(value);
        if (onChange) {
            onChange({ target: { name, value: capitalizedValue } });
        }
    };



    if (!select && ['text', 'date', "datetime - local"].includes(type)) {
        return (
            <>
                <TextField
                    inputRef={ref}
                    disabled={disabled}
                    accept={accept}
                    required={required}
                    name={name}
                    label={label}
                    fullWidth={fullWidth}
                    onChange={(e) => handleChange(e)}
                    type={type}
                    placeholder={placeholder}
                    className={className}
                    {...events}
                    variant='outlined'
                    value={value || ''}
                    error={errors && errors[name]}
                    helperText={errors && errors[name]}
                    InputLabelProps={{ ...InputLabelProps, shrink: type === "date" || 'text' ? true : false, }}
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

    if (['offline-file'].includes(type)) {
        return (
            <FileInput
                apiEndPoint={apiEndPoint}
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
                uploadFile={uploadFile}
            />
        )
    }
    if (select) {



        // return (<TextField
        //     inputRef={ref}
        //     defaultValue={menuItems.length > 0 && menuItems[0].val}
        //     // default={default}
        //     select={select}
        //     required={required}
        //     name={name}
        //     label={label}
        //     fullWidth={fullWidth}
        //     onChange={onChange}
        //     type={type}
        //     placeholder={placeholder}
        //     className={className}
        //     {...events}
        //     variant='outlined'
        //     value={value || ''}
        //     error={errors && errors[name]}
        //     helperText={errors && errors[name]}
        //     InputLabelProps={{
        //         ...InputLabelProps
        //     }}
        //     inputProps={inputProps}
        // >
        //     {menuItems.length > 0 && menuItems.map(({ val, label }, i) => (<MenuItem key={i} value={val}>{label}</MenuItem>))}
        // </TextField>)
        return (
            <Autocomplete
                name={name}
                onChange={(event, value) =>
                    onChange({ target: { name, value: value?.val } })
                    // handleAutocompleteChange(event, value?.value, "myAutocomplete")
                }
                required={required}
                options={menuItems}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value}
                renderInput={(params) => (
                    <TextField
                        inputRef={ref}
                        onChange={onChange}
                        name={name}
                        error={errors && errors[name]}
                        helperText={errors && errors[name]}
                        {...params}
                        label={label}
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
        )
    }


    if (['textarea'].includes(type)) {
        return (

            // </TextField >
            <TextField
                inputRef={ref}
                multiline
                rows={2}
                required={required}
                name={name}
                label={label}
                fullWidth={fullWidth}
                onChange={(e) => handleChange(e)}
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

})



export default FlotingLableInput