import { useState, useEffect, Fragment } from "react";
import { Autocomplete, CircularProgress, styled, TextField } from "@mui/material";
import axios from "axios";
import API from "Constance";
import { Paragraph } from "@app/Components/Typography";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@app/Redux/Sclice/SnaackBarSclice";

const AutoComplete = styled(Autocomplete)(() => ({ width: '100%' }));

function sleep(delay = 0) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export default function RealtimeAsyncAutoComplete({ url, label, otherParams, setSelectedId, selectedId, name, desirekey, error, setFieldValue, disabled, value, helptext }) {
    const [open, setOpen] = useState(false);
    // const [loading, setLoading] = useState(open);
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);
    const loading = open && options.length == 0
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState(value || null);
    // console.log(selectedOption)
    useEffect(() => {
        let active = true;

        // if (!loading) return;

        (async () => {
            // *https://www.registers.service.gov.uk/registers/country/use-the-api*
            const response = await API.get(url,
                { params: { name: search, ...otherParams } }
            );
            if (response.status != 200) {
                dispatch(showSnackbar({ message: response.data.message, severity: 'error' }))
                return 
            }
            await sleep(1000); // For demo purposes.
            // console.log(response)
            const data = await response.data;
            // console.log(countries)
            if (active) {
                setOptions(data);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) setOptions([]);
    }, [open]);

    const handleChange = (event, value) => {
        // console.log("value", value)
        setSelectedOption(value)
        if (value) {
            // console.log(value[desirekey])
            // setSelectedId((pre) => ({ ...pre, [name]: value[desirekey] }));
            setFieldValue(name, value[desirekey])
        } else {
            setSelectedId(null);
        }
    };

    return (
        <AutoComplete
            // value={selectedOption}
            defaultValue={selectedOption}
            disabled={disabled}

            fullWidth
            // onChange={(e) => { console.log(e.target) }}
            open={open}
            options={options}
            loading={loading}
            id="asynchronous-demo"
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleChange}
            getOptionLabel={(option) => {
                // console.log(option)
                return option?.name
            }}
            renderInput={(params) => (
                <>
                    <TextField

                        onChange={(e) => setSearch(e.target.value)}
                        {...params}
                        fullWidth
                        variant="outlined"
                        label={label}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            )
                        }}
                        error={error}
                        helperText={helptext}
                    />
                    {error !== '' && <Paragraph style={{ color: 'red' }} > {error}</Paragraph>}
                </>
            )}
        />
    );
}
