import { Box, Button } from '@mui/material';
import React, { useRef, useEffect, useState } from 'react';

const SignatureCanvas = ({ width = 350, height = 160, onSave, name, setFieldValue }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Scale the canvas for high-DPI devices
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
    }, [width, height]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCursorPosition(e);
        setLastPoint({ x, y }); // Store the starting point
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        ctxRef.current.closePath(); // Close the path when drawing stops
        setLastPoint(null); // Reset the last point
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCursorPosition(e);

        // If we have a last point, smooth the line using linear interpolation
        if (lastPoint) {
            const { x: lastX, y: lastY } = lastPoint;

            // Draw a smooth line using quadraticCurveTo
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
        setFieldValue(name, '')
    };
    const saveSignature = () => {
        if (onSave) {
            const dataURL = canvasRef.current.toDataURL();
            onSave(dataURL);
        }
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
                style={{ border: "1px solid rgb(221, 221, 221)", touchAction: "none" }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
            />
            <Box gap={3} display="flex" flexDirection="row">
                <Button variant="contained" color="error" onClick={clearCanvas}>
                    Clear
                </Button>
                <Button variant="contained" color="success" onClick={saveSignature}>
                    Save Signature
                </Button>
            </Box>
        </Box>
    );
};

export default SignatureCanvas;




// import { Box, Button } from '@mui/material';
// import React, { useRef, useEffect, useState } from 'react';

// const SignatureCanvas = ({ width = 350, height = 160, onSave }) => {
//     const canvasRef = useRef(null);
//     const ctxRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         // Scale the canvas for high-DPI devices
//         const scale = window.devicePixelRatio || 1;
//         canvas.width = width * scale;
//         canvas.height = height * scale;
//         canvas.style.width = `${width}px`;
//         canvas.style.height = `${height}px`;
//         context.scale(scale, scale);

//         // Set drawing styles
//         context.lineWidth = 2; // Adjust stroke width
//         context.lineCap = 'round'; // Smooth rounded ends for the lines
//         context.strokeStyle = 'black'; // Stroke color
//         ctxRef.current = context;
//     }, [width, height]);

//     const startDrawing = (e) => {
//         setIsDrawing(true);
//         const { x, y } = getCursorPosition(e);
//         ctxRef.current.beginPath();
//         ctxRef.current.moveTo(x, y); // Start the path at the cursor position
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//         ctxRef.current.closePath(); // Close the path when drawing stops
//     };

//     const draw = (e) => {
//         if (!isDrawing) return;
//         const { x, y } = getCursorPosition(e);
//         ctxRef.current.lineTo(x, y); // Draw a line to the current cursor position
//         ctxRef.current.stroke(); // Render the stroke
//     };

//     const clearCanvas = () => {
//         ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     };

//     const saveSignature = () => {
//         if (onSave) {
//             const dataURL = canvasRef.current.toDataURL();
//             onSave(dataURL);
//         }
//     };

//     // Helper function to get cursor/touch position
//     const getCursorPosition = (e) => {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = (e.clientX || e.touches[0].clientX) - rect.left;
//         const y = (e.clientY || e.touches[0].clientY) - rect.top;
//         return { x, y };
//     };

//     return (
//         <Box display='flex' flexDirection='column' gap={2}>
//             <canvas
//                 ref={canvasRef}
//                 style={{ border: "1px solid rgb(221, 221, 221)", "touch-action": "none" }}
//                 onMouseDown={startDrawing}
//                 onMouseUp={stopDrawing}
//                 onMouseMove={draw}
//                 onTouchStart={startDrawing}
//                 onTouchEnd={stopDrawing}
//                 onTouchMove={draw}
//             />
//             <Box gap={3} display='flex' flexDirection='row'>
//                 <Button variant='contained' color='error' onClick={clearCanvas}>Clear</Button>
//                 <Button variant='contained' color='success' onClick={saveSignature}>Save Signature</Button>
//             </Box>
//         </Box>
//     );
// };

// export default SignatureCanvas;
