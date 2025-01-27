import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Box,
  Card,
  useTheme,
  styled,
  Link,
  Typography,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '@app/Redux/Sclice/AuthSclice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { values } from 'lodash';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';


const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;



const RegisterRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: `url('/assets/images/logos/bg-1.jpeg')`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '100%',
  height: '100vh',
});

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "100px",
  display: "flex",
  flexDirection: 'column',
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: '#010048',
  color: theme.palette.common.white,
}));

const Logo = styled("img")({
  width: '250px',
  marginBottom: '20px',
});

const LoginForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPage, setShowPage] = useState(searchParams.get('page') || 1)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
    companyname: showPage == 2 && Yup.string().required('Company name is required'),
    address: Yup.string().required('Address Line 1 is required'),
    area: Yup.string().required('Area is required'),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'City cannot contain numbers or special characters')
      .required('City is required'),
    pincode: Yup.string().test(
      'exact-length',
      'Postcode must have exactly 6 characters (excluding spaces)',
      (value) => {
        if (!value) return false;
        const trimmedValue = value.replace(/\s+/g, '');
        return trimmedValue.length === 6;
      }
    )
      .required('Postcode is required'),
    website: showPage == 2 && Yup.string()
      .matches(urlRegex, 'Enter a valid URL, e.g., https://example.com'),

    phonenumber: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .matches(
        /^(?:\+44|0)(?:\d\s?){9,10}$/,
        'Enter a valid UK phone number'
      ).required('Phone Number is Required'),
    fname: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'First name can only contain letters')
      .min(2, 'First name must be at least 2 characters')
      .max(30, 'First name cannot exceed 30 characters')
      .required('First name is required'),

    lname: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Last name can only contain letters')
      .min(2, 'Last name must be at least 2 characters')
      .max(30, 'Last name cannot exceed 30 characters')
      .required('Last name is required'),
  });

  const loginschma = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  })


  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <DynamicTitle title={showPage === 1 ? 'Login' : 'New Registration'} />
      <Formik
        initialValues={{
          companyname: '',
          coruspondingEmail: '',
          email: '',
          password: '',
          fname: '',
          lname: '',
          address: '',
          area: '',
          city: '',
          pincode: '',
          website: '',
          phonenumber: '',
        }}
        validationSchema={showPage != 1 ? RegisterSchema : loginschma}
        onSubmit={(values) => {
          const modifyValues = {
            ...values,
          }
          if (showPage == 2) {
            modifyValues['role'] = 'company'
            dispatch(register({ data: modifyValues, navigate: navigate }));
          }
          if (showPage == 3) {
            modifyValues['role'] = 'agent'
            delete modifyValues?.companyname
            delete modifyValues?.website
            dispatch(register({ data: modifyValues, navigate }));
          }
          if (showPage == 1) {
            const { email, password } = modifyValues
            dispatch(login({ data: { email, password }, navigate }));
          }
        }}
        enableReinitialize
        validateOnChange
        validateOnBlur={false}
        validateOnMount={false}
      >
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <RegisterRoot>
            <Card sx={{ width: { xs: '90%', md: '60%' }, borderRadius: 2 }}>
              <Grid container>
                {/* Left Panel */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0758',
                    padding: '40px',
                  }}
                >
                  <Logo src="/assets/images/logos/logo.png" alt="3access Logo" />
                </Grid>

                {/* Right Panel */}
                {showPage == 1 && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Logo src="/assets/images/logos/logo-blue.png" alt="3access Logo" />

                    {/* Form Fields for Login */}
                    <TextField
                      label="Email"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      required
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />

                    <TextField
                      label="Password"
                      variant="standard"
                      fullWidth
                      margin="normal"
                      required
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, fontWeight: 'bold' }}
                      onClick={() => handleSubmit()}
                    >
                      Login
                    </Button>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Link href="#" underline="hover" color="primary">
                        Forget Password?
                      </Link>
                      {/* <Link onClick={() => { setShowPage(2); setSearchParams({ page: 2 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      Get New Company Account?
                    </Link> */}
                      <Link onClick={() => { setShowPage(3); setSearchParams({ page: 3 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1, cursor: 'pointer' }} >
                        Get New Managing Agent Account?
                      </Link>
                    </Box>
                  </Grid>
                )}
                {/* company registretion starts here */}
                {showPage == 2 &&
                  (<Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      // display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px',
                      backgroundColor: '#ffffff',
                    }}
                  >

                    <Grid
                      item
                      xs={12}
                      md={12}
                    >
                      <TextField
                        label="Company name"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        required
                        value={values.companyname}
                        name="companyname"
                        onChange={handleChange}
                        error={touched.companyname && Boolean(errors.companyname)}
                        helperText={touched.companyname && errors.companyname}
                      />
                    </Grid>


                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="First name"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          name="fname"
                          value={values.fname}
                          onChange={handleChange}
                          error={touched.fname && Boolean(errors.fname)}
                          helperText={touched.fname && errors.fname}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6} // Adjust to take up the remaining half width in md
                      >
                        <TextField
                          label="Last name"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.lname}
                          type='text'
                          name="lname"
                          onChange={handleChange}
                          error={touched.lname && Boolean(errors.lname)}
                          helperText={touched.lname && errors.lname}

                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Email"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Password"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.password}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          onChange={handleChange}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>


                    <Grid
                      item
                      xs={12}
                      md={12}
                    >
                      <TextField
                        label="Address Line 1"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        required
                        value={values.address}
                        type='text'
                        name="address"
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}

                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Area"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          value={values.area}
                          type='text'
                          name="area"
                          onChange={handleChange}
                          error={touched.area && Boolean(errors.area)}
                          helperText={touched.area && errors.area}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6} // Adjust to take up the remaining half width in md
                      >
                        <TextField
                          label="City"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          type='text'
                          value={values.city}
                          name="city"
                          onChange={handleChange}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Post Code"
                          variant="standard"
                          fullWidth
                          value={values.pincode}
                          margin="normal"
                          required
                          name="pincode"
                          onChange={handleChange}
                          error={touched.pincode && Boolean(errors.pincode)}
                          helperText={touched.pincode && errors.pincode}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6} // Adjust to take up the remaining half width in md
                      >
                        <TextField
                          label="Web Site"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          value={values.website}
                          type='text'
                          name="website"
                          onChange={handleChange}
                          error={touched.website && Boolean(errors.website)}
                          helperText={touched.website && errors.website}

                        />
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                    >
                      <TextField
                        label="Phone Number"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        required
                        value={values.phonenumber}
                        name="phonenumber"
                        onChange={handleChange}
                        error={touched.phonenumber && Boolean(errors.phonenumber)}
                        helperText={touched.phonenumber && errors.phonenumber}
                      />
                    </Grid>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, fontWeight: 'bold' }}
                      type="button"
                      onClick={() => { handleSubmit() }}
                    >
                      Create Account
                    </Button>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>

                      <Link onClick={() => { setShowPage(1); setSearchParams({ page: 1 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Already have an Account?
                      </Link>
                      <Link onClick={() => { setShowPage(3); setSearchParams({ page: 3 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                        Get New Managing Agent Account?
                      </Link>
                    </Box>
                  </Grid>
                  )
                }
                {/* company registretion ends here */}

                {showPage == 3 &&
                  (<Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      // display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >

                      <Grid
                        item
                        xs={12}
                        md={12}
                      >
                        <TextField
                          label="Company name"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.companyname}
                          name="companyname"
                          onChange={handleChange}
                          error={touched.companyname && Boolean(errors.companyname)}
                          helperText={touched.companyname && errors.companyname}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="First name"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          name="fname"
                          value={values.fname}
                          onChange={handleChange}
                          error={touched.fname && Boolean(errors.fname)}
                          helperText={touched.fname && errors.fname}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6} // Adjust to take up the remaining half width in md
                      >
                        <TextField
                          label="Last name"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.lname}
                          type='text'
                          name="lname"
                          onChange={handleChange}
                          error={touched.lname && Boolean(errors.lname)}
                          helperText={touched.lname && errors.lname}

                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Email"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Password"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.password}
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          onChange={handleChange}
                          error={touched.password && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            ),
                          }}

                        />
                      </Grid>
                    </Grid>


                    <Grid
                      item
                      xs={12}
                      md={12} // Adjust to take up the remaining half width in md
                    >
                      <TextField
                        label="Currosponding Email"
                        variant="standard"
                        fullWidth
                        margin="normal"
                        required
                        value={values.coruspondingEmail}
                        type='text'
                        name="coruspondingEmail"
                        onChange={handleChange}
                        error={touched.coruspondingEmail && Boolean(errors.coruspondingEmail)}
                        helperText={touched.coruspondingEmail && errors.coruspondingEmail}

                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12} // Adjust to take up the remaining half width in md
                    >
                      <TextField
                        label="Address Line 1 "
                        variant="standard"
                        fullWidth
                        margin="normal"
                        required
                        value={values.address}
                        type='text'
                        name="address"
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}

                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Area"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          value={values.area}
                          required
                          type='text'
                          name="area"
                          onChange={handleChange}
                          error={touched.area && Boolean(errors.area)}
                          helperText={touched.area && errors.area}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6} // Adjust to take up the remaining half width in md
                      >
                        <TextField
                          label="City"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          type='text'
                          value={values.city}
                          name="city"
                          onChange={handleChange}
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}

                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2} // Add spacing at the container level for consistent gap
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Post Code"
                          variant="standard"
                          fullWidth
                          value={values.pincode}
                          margin="normal"
                          required
                          name="pincode"
                          onChange={handleChange}
                          error={touched.pincode && Boolean(errors.pincode)}
                          helperText={touched.pincode && errors.pincode}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <TextField
                          label="Phone Number"
                          variant="standard"
                          fullWidth
                          margin="normal"
                          required
                          value={values.phonenumber}
                          name="phonenumber"
                          onChange={handleChange}
                          error={touched.phonenumber && Boolean(errors.phonenumber)}
                          helperText={touched.phonenumber && errors.phonenumber}
                        />
                      </Grid>

                    </Grid>


                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, fontWeight: 'bold' }}
                      type="button"
                      onClick={() => { handleSubmit() }}
                    >
                      Create Account
                    </Button>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Link onClick={() => { setShowPage(1); setSearchParams({ page: 1 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1, cursor: 'pointer' }}>
                        Already have an Account?
                      </Link>
                      {/* <Link onClick={() => { setShowPage(2); setSearchParams({ page: 2 }) }} underline="hover" color="textSecondary" sx={{ display: 'block', mt: 1,cursor:'pointer' }}>
                      Get New Company Account?
                    </Link> */}
                    </Box>
                  </Grid>
                  )
                }
              </Grid>
            </Card>
          </RegisterRoot>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
