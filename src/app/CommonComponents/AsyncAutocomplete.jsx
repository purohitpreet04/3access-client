import { useState, useEffect, Fragment } from "react";
import { Autocomplete, CircularProgress, styled, TextField } from "@mui/material";
import axios from "axios";
import API from "Constance";
import { Paragraph } from "@app/Components/Typography";

const AutoComplete = styled(Autocomplete)(() => ({ width: '100%' }));

function sleep(delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export default function AsyncAutocomplete({ url, label, otherParams, setSelectedId, selectedId, name, desirekey, error, setFieldValue, disabled , value, helptext}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [selectedOption, setSelectedOption] = useState(value || null);
  // const [selectedId, setSelectedId] = useState(null);
  // console.log(value)
  useEffect(() => {
    let active = true;

    if (!loading) return;

    (async () => {
      // *https://www.registers.service.gov.uk/registers/country/use-the-api*
      const response = await API.get(url,
        { params: { ...otherParams } }
      );
      await sleep(1000); // For demo purposes.
      // console.log(response)
      const countries = await response.data;

      if (active) {
        setOptions((countries).map((ele) => ele));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, search]);

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  const handleChange = (event, value) => {
    if (value) {
        
        setFieldValue(name, value[desirekey])
    } else {
        setSelectedId(null);
    }
};


  return (
    <AutoComplete
      // value={selectedOption}
      // defaultValue={value}
      defaultValue={selectedOption}
      disabled={disabled}
      fullWidth
      open={open}
      options={options}
      loading={loading}
      id="asynchronous-demo"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={handleChange}
      getOptionKey={(option) => {
        return option?._id
      }}
      getOptionLabel={(option) => {
        return option?.type
      }}
      renderInput={(params) => (
        <>
          <TextField
            onChange={(e) => setSearch(e.target.value)}
            {...params}
            fullWidth
            variant="outlined"
            label={label}
            name={name}
            value={value}
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
        </>
      )}
    />
  );
}
