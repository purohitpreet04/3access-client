import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DynamicTitle from '@app/CommonComponents/DynamicTitle';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { verifyOtp } from '@app/Redux/Sclice/AuthSclice';
import { useNavigate } from 'react-router-dom';

const OTPpage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef(new Array(6).fill(null));
    const { user } = useSelector(state => state.auth)
    // useEffect(() => {
    //     if (inputRefs.current[0]) {
    //         inputRefs.current[0].focus();
    //     }
    // }, []);
    // console.log(user);

    useEffect(() => {
        if (otp.every(num => num == '')) return
        let filledOTp = otp.filter((num) => num != '')
        if (filledOTp.length == 0) {
            inputRefs.current[0].focus();
            return
        }
        // console.log(filledOTp);

        if (filledOTp.length == 1) {
            inputRefs.current[1].focus();
            return;
        }
        if (inputRefs.current[filledOTp.length] && filledOTp.length != 6) {
            inputRefs.current[filledOTp.length].focus();
            return;
        }

    }, [otp]);





    const handleChange = (index, event) => {
        const value = event.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace") {
            event.preventDefault();
            const newOtp = [...otp];
            if (otp[index]) {
                newOtp[index] = "";
            } else if (index > 0) {
                newOtp[index - 1] = "";
                inputRefs.current[index - 1]?.focus();
            }
            setOtp(newOtp);
        } else if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
        if (pastedData.length === 6) {
            setOtp(pastedData.split(""));
        }
    };

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

    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(4),
        textAlign: 'center',
        maxWidth: 400,
        width: '90%',
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
    }));
    const handleOtpSubmit = useCallback(debounce((val) => {
        // let otpNumber = ''
        // otp.map((num) => {

        //     otpNumber += num
        // })
        const otpNumber = otp.toString().replace(',', '')
        console.log(otpNumber);

        let num = parseInt(otpNumber)
        dispatch(verifyOtp({ navigate, userId: user?._id, otp: num, email: user?.email }))
        // setOtp(new Array(6).fill(""))
        return
    }, 500), [])
    // const handleOtpSubmit = () => useCallback()
    return (
        <>
            <DynamicTitle title='OTP Verification' />
            <RegisterRoot>
                <StyledPaper>
                    <Typography variant="h6" gutterBottom>
                        Enter OTP
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                        {[...otp].map((digit, index) => (
                            <Grid item key={index}>
                                <TextField
                                    inputRef={(el) => (inputRefs.current[index] = el)}
                                    value={digit}
                                    onChange={(e) => { handleChange(index, e); if (index == 5) { handleOtpSubmit() } }}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        maxLength: 1,
                                        style: { textAlign: 'center', fontSize: '1.5rem' }
                                    }}
                                    sx={{ width: 40 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </StyledPaper>
            </RegisterRoot>
        </>
    );
};

export default OTPpage;
