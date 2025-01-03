import { showSnackbar } from '@app/Redux/Sclice/SnaackBarSclice';
import { Box, Button } from '@mui/material';
import { debounce } from 'lodash';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const SignatureCanvas = ({ width = 350, height = 160, onSave, name, setFieldValue, value, errors }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);
    const [signature, setSignature] = useState(value || "");
    const dispatch = useDispatch();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const scale = window.devicePixelRatio || 1;
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.scale(scale, scale);

        // Set drawing styles
        context.lineWidth = 2; // Adjust stroke width
        context.lineCap = 'round'; // Smooth rounded ends for the lines
        context.strokeStyle = 'black'; // Stroke color
        ctxRef.current = context;

        // If a signature is already saved, load it onto the canvas
        if (value) {
            loadSignature(value);
        }
    }, [width, height, value]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCursorPosition(e);
        setLastPoint({ x, y });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctxRef.current.closePath();
        setLastPoint(null);
        saveSignature();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCursorPosition(e);

        if (lastPoint) {
            const { x: lastX, y: lastY } = lastPoint;

            ctxRef.current.beginPath();
            ctxRef.current.moveTo(lastX, lastY);
            ctxRef.current.quadraticCurveTo(lastX, lastY, x, y);
            ctxRef.current.stroke();

            // Update the last point
            setLastPoint({ x, y });
        } else {
            setLastPoint({ x, y });
        }
    };

    const clearCanvas = () => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setFieldValue(name, '');
        setSignature('');
    };

    const saveSignature = useCallback(debounce(() => {
        if (errors && errors[name]) return
        const dataURL = canvasRef.current.toDataURL();
        setSignature(dataURL);
        setFieldValue(name, dataURL);

        if (onSave) onSave(dataURL);

        dispatch(
            showSnackbar({
                message: 'The signature has been preserved',
                severity: 'info',
            })
        );
    }, 500), [setFieldValue, name, onSave, dispatch]);

    const loadSignature = (dataURL) => {
        const image = new Image();
        image.onload = () => {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
            ctxRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height); // Draw the image
        };
        image.src = dataURL; // Set the image source to the Base64 string
    };

    // Helper function to get cursor/touch position
    const getCursorPosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return { x, y };
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <canvas
                ref={canvasRef}
                style={{ border: '1px solid rgb(221, 221, 221)', touchAction: 'none' }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                onChange={() => { console.log('change'); }}
            />
            {errors && errors[name] && <div style={{ color: 'red' }}>{errors[name]}</div>}
            <Box gap={3} display="flex" flexDirection="row">
                <Button variant="contained" color="error" onClick={clearCanvas}>
                    Clear
                </Button>
                {/* <Button variant="contained" color="success" onClick={saveSignature}>
                    Save Signature
                </Button> */}
            </Box>
        </Box>
    );
};

export default SignatureCanvas;
