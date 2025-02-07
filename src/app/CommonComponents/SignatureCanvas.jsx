import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Button } from '@mui/material';
import { debounce } from 'lodash';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import SignaturePad from "react-signature-canvas";

const SignatureCanvas = ({ width = 350, height = 160, onSave, name, setFieldValue, value, errors }) => {
    const sigCanvas = useRef(null); // Reference for the Signature Pad
    const [signatureData, setSignatureData] = useState(null); // State to store Base64 string
    const dispatch = useDispatch();


    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);
    const [signature, setSignature] = useState(value || "");

    const handleEnd = (e) => {
        
        if (errors && errors[name]) return
        const dataURL = sigCanvas.current.toDataURL();
        setSignature(dataURL);
        setFieldValue(name, dataURL);

        if (onSave) onSave(dataURL);

        dispatch(
            showSnackbar({
                message: 'The signature has been preserved',
                severity: 'info',
            })
        );
    }

    const clearSignature = () => {
        sigCanvas.current.clear();
        setSignatureData(null);
        setFieldValue(name, '');
    };

    return (
        <Box display="flex" justifyContent='flex-start' flexDirection="column"
            sx={{
                mb:4,
                border: "1px solid #000",
                width: "400px",
                height: "200px",
            }} gap={2}>
         
            <SignaturePad

                ref={sigCanvas}
                penColor="black"
                onEnd={handleEnd} // Triggered when the user stops drawing
                canvasProps={{
                    width: 400,
                    height: 200,
                    className: "sigCanvas",
                }}
            />
            {errors && errors[name] && <div style={{ color: 'red' }}>{errors[name]}</div>}
            <Box gap={3} display="flex" flexDirection="row">
                <Button variant="contained" color="error" onClick={clearSignature}>
                    Clear
                </Button>
               
            </Box>
            
        </Box>
    );
};

export default SignatureCanvas;
