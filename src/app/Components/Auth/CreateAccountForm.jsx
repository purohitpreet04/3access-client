import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Box, Card, useTheme, styled, FormGroup, Typography, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { H2, Paragraph } from '../Typography';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@app/Redux/Sclice/AuthSclice';
import RoleSelector from '@app/CommonComponents/CustomSwitch';
import { color } from 'framer-motion';
import MatxLoading from '../MatxLoading';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is Required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()\-_]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string().required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  firstName: Yup.string().required('First Name is required')
    .matches(/^[a-zA-Z]+$/, ' First Name must contain only letters')
    .min(2, 'First Name must be at least 2 characters long')
    .max(20, 'First Name must be at most 20 characters long'),
  lastName: Yup.string().required('Last Name is required')
    .matches(/^[a-zA-Z]+$/, ' Last Name must contain only letters')
    .min(2, 'Last Name must be at least 2 characters long')
    .max(20, 'Last Name must be at most 20 characters long'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .matches(
      /^(?:\+44|0)(?:\d\s?){9,10}$/,
      'Enter a valid phone number'
    ).required('Phone Number is Required'),
});

const RegisterRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1A2038",
  minHeight: "100vh !important",
  // width:'80vh',
  "& .card": { Width: "80vh", margin: 16, borderRadius: 12 }
});

const ContentBox = styled("div")(({ theme }) => ({
  height: "100%",
  padding: "32px",
  display: "flex",
  flexDirection: 'column',
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default
}));

const IMG = styled("img")({ width: "100%" });

const StyledParagraph = styled(Paragraph)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  textAlign: 'center',
}));



const CreateAccountForm = () => {
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const rolesEnum = [{ label: "Admin", val: 'admin' }, { label: "Docter", val: 'doctor' }, { label: "Nurse", val: 'nurse' }, { label: "Staff", val: 'staff' }]
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        gender: "",
        role: '',
      }}
      validationSchema={SignupSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={(values) => {
        // console.log(values)
        // return
        dispatch(register({ data: values, navigate: navigate }))
      }}
    >
      {({ errors, touched, handleChange, values, setValues, handleSubmit }) => (
        <RegisterRoot>
          <Card style={{ width: '80vh' }} className="card">
            <Grid container>
              <Grid p={4} item spacing={2} lg={12} md={12} sm={12} xs={12}>
                <Form>
                  {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="role-select-label">Role</InputLabel>
                      <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={values?.role}
                        label="Role"
                        name='role'
                        onChange={handleChange}
                      >
                        {rolesEnum.map(({ label, val }) => (
                          <MenuItem key={val} value={val}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.firstName && touched.firstName)}
                      helperText={errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.lastName && touched.lastName)}
                      helperText={errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup>
                      <FormLabel id="gender-selector">
                        <Typography variant="body2" component="label">
                          Gender
                        </Typography>
                      </FormLabel>
                      <RadioGroup row aria-labelledby="gender-selector" name="gender" value={values.gender} onChange={(e) => handleChange(e)}>
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                      <ErrorMessage name="gender" component="p" />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Address"
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.email && touched.email)}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.password && touched.password)}
                      helperText={errors.password}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                      helperText={errors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <TextField
                      fullWidth
                      id="phoneNumber"
                      name="phone"
                      label="Phone Number"
                      variant="outlined"
                      onChange={(e) => handleChange(e)}
                      margin="normal"
                      error={Boolean(errors.phone && touched.phone)}
                      helperText={errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} md={12}>
                    <Box mt={2} width='100%'>
                      {!loading ? (<Button onClick={(e) => handleSubmit(e)} variant="contained" color="primary" type="button">
                        Create Account
                      </Button>) : (<MatxLoading />)}
                    </Box>
                    <Paragraph>
                      {"Already have an account?"}
                      <NavLink
                        to='/auth/login'
                        style={{ color: theme.palette.primary.main, marginLeft: 5, cursor: 'pointer' }}>
                        {"Sign in"}
                      </NavLink>
                    </Paragraph>
                  </Grid>
                </Form>
              </Grid>
            </Grid>
          </Card>
        </RegisterRoot>
      )}
    </Formik>
  );
};

export default CreateAccountForm;
