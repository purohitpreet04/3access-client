// src/hooks/useApi.js
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../Redux/Sclice/SnaackBarSclice';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import API from 'Constance';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { useCallback, useState } from 'react';
import debounce from "lodash/debounce";
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';





export const postData = async (url, data, config = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  try {
    dispatch(setIsLoading({ data: true }))
    const response = await API.post(url, data, config);
    dispatch(showSnackbar({
      message: response?.data.message,
      severity: "success"
    }));
    dispatch(setIsLoading({ data: false }))
    return response.data; // Return the response data
  } catch (error) {
    // Handle error response
    if (error.response) {
      // Server responded with a status other than 2xx
      if (error.response?.status === 409) {
        dispatch(logout());
        navigate('/auth/login');
      } else {
        dispatch(showSnackbar({
          message: error.response?.data?.message || "An error occurred",
          severity: "error"
        }));
      }
    } else if (error.request) {
      // Request was made but no response received
      throw { message: 'No response from server' };
    } else {
      dispatch(showSnackbar({
        message: error.response?.data?.message || "An error occurred",
        severity: "error"
      }));
      // Something else caused an error
      throw { message: error.message };
    }
  }
  dispatch(setIsLoading({ data: false }))
};







export const FetchData = async (url, options) => {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  try {
    const res = await API.get(url, { params: options });
    if (res.data.message) {
      dispatch(showSnackbar({ message: res.data.message, severity: "success" }));
    }
    return res;
  } catch (error) {
    if (error.response?.status === 409) {
      dispatch(logout());
      navigation('/auth/login');
    } else {
      dispatch(showSnackbar({
        message: error.response?.data?.message || "An error occurred",
        severity: "error"
      }));
    }
  }
}









export const useImageCompressor = () => {
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const compressImage = useCallback(async (imageFile) => {
    setLoading(true);
    setCompressedImage(null)
    setCompressedImageUrl(null)
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        quality: 0.7
      };

      const compressedBlob = await imageCompression(imageFile, options);
      const compressedFile = new File(
        [compressedBlob],
        imageFile.name,
        { type: compressedBlob.type, lastModified: Date.now() }
      );
      const compressedImageURL = URL.createObjectURL(compressedFile);
      setCompressedImageUrl(compressedImageURL)
      setCompressedImage(compressedFile);
      return compressedFile
    } catch (error) {
      console.error('Error compressing image:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    compressImage,
    compressedImage,
    compressedImageUrl,
    loading,
  };
};

export const handleView = async ({ type, id }) => {

  try {
    window.open(`/document?type=${type}&t=${id}`, '_blank');
    return
    const response = await API.get('/api/tenents/getdocument', { params: { type, id } })
    try {
      const htmlContent = response.data;

      const newWindow = window.open(`http://localhost:5173/document?type=${type}&t=${id}`, '_blank');
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
    catch (error) {
      console.error('Error fetching HTML:', error);
    }
  } catch (error) {
    console.error('Error fetching HTML:', error);
    alert('Failed to load HTML. Please try again.');
  }
};

// export const handleDownload = async ({ type, id }) => {
//   try {
//     const response = await API.get('/api/tenents/getdocument', { params: { type, id } })
//     const htmlContent = await response.data;
//     const tempElement = document.createElement('div');
//     tempElement.innerHTML = htmlContent;
//     document.body.appendChild(tempElement);
//     const canvas = await html2canvas(tempElement, { scale: 2 });
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     const imgData = canvas.toDataURL('image/png');
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${type}.pdf`);
//     document.body.removeChild(tempElement);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     alert('Failed to generate PDF. Please try again.');
//   }
// };


// export const handleDownload = async ({ type, id }) => {
//   try {
//     const response = await API.get('/api/tenents/getdocument', { params: { type, id } });
//     const htmlContent = response.data;

//     const tempElement = document.createElement('div');
//     tempElement.innerHTML = htmlContent;

//     tempElement.style.width = '210mm'; // A4 width in mm
//     tempElement.style.padding = '20px'; // Add padding
//     tempElement.style.boxSizing = 'border-box'; // Include padding in width calculation
//     document.body.appendChild(tempElement);

//     // Ensure all images in the content are loaded
//     const images = tempElement.querySelectorAll('img');

//     await Promise.all(
//       Array.from(images).map((img) => {
//         return new Promise((resolve) => {
//           if (img.complete) {
//             resolve();
//           } else {
//             img.onload = resolve;
//             img.onerror = resolve;
//           }
//         });
//       })
//     );

//     const canvas = await html2canvas(tempElement, { scale: 2, useCORS: true });
//     const totalHeight = canvas.height;
//     const pdf = new jsPDF('p', 'mm', 'a4');

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const margin = 10; // 10mm margin on all sides
//     const contentWidth = pdfWidth - 2 * margin;
//     const contentHeight = pdfHeight - 2 * margin;

//     const pageHeightInPx = (contentHeight * canvas.width) / contentWidth;
//     let position = 0;

//     while (position < totalHeight) {
//       const canvasSlice = document.createElement('canvas');
//       canvasSlice.width = canvas.width;
//       canvasSlice.height = Math.min(pageHeightInPx, totalHeight - position);

//       const context = canvasSlice.getContext('2d');
//       context.drawImage(
//         canvas,
//         0,
//         position,
//         canvas.width,
//         canvasSlice.height,
//         0,
//         0,
//         canvas.width,
//         canvasSlice.height
//       );

//       const imgData = canvasSlice.toDataURL('image/png');
//       pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);

//       position += pageHeightInPx;
//       if (position < totalHeight) {
//         pdf.addPage();
//       }
//     }

//     pdf.save(`${type}.pdf`);
//     document.body.removeChild(tempElement);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     alert('Failed to generate PDF. Please try again.');
//   }
// };
// export const handleDownload = async ({ type, id }, dispatch) => {
//   dispatch(setIsLoading({data:true}))
//   let tempContainer 
//   try {
//     const response = await API.get('/api/tenents/getdocument', { params: { type, id } });
//     const htmlContent = response.data;

//     tempContainer = document.createElement('div');
//     tempContainer.style.width = '210mm'; // A4 width in mm
//     tempContainer.style.padding = '20px'; // Add padding
//     tempContainer.style.boxSizing = 'border-box';
//     tempContainer.innerHTML = htmlContent;
//     document.body.appendChild(tempContainer);

//     // Ensure all images are loaded (wait for iframes to load if any)
//     const images = tempContainer.querySelectorAll('img');
//     await Promise.all(
//       Array.from(images).map((img) =>
//         new Promise((resolve) => {
//           if (img.complete) {
//             resolve();
//           } else {
//             img.onload = resolve;
//             img.onerror = resolve;
//           }
//         })
//       )
//     );

//     // Check for iframe elements and ensure they're fully loaded
//     const iframes = tempContainer.querySelectorAll('iframe');
//     await Promise.all(
//       Array.from(iframes).map((iframe) =>
//         new Promise((resolve) => {
//           iframe.onload = resolve; // Ensure iframe content is loaded
//         })
//       )
//     );

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const margin = 10; // 10mm margin
//     const contentWidth = pdfWidth - 2 * margin;
//     const contentHeight = pdfHeight - 2 * margin;

//     const pageHeightInPx = (contentHeight * window.devicePixelRatio * 96) / 25.4; // Convert mm to px

//     let currentPosition = 0;

//     while (currentPosition < tempContainer.scrollHeight) {
//       // Slice the content for the current page
//       const pageContent = document.createElement('div');
//       pageContent.style.width = `${tempContainer.offsetWidth}px`;
//       pageContent.style.height = `${Math.min(pageHeightInPx, tempContainer.scrollHeight - currentPosition)}px`;
//       pageContent.style.overflow = 'hidden';
//       pageContent.innerHTML = tempContainer.innerHTML;

//       // Adjust content position
//       tempContainer.style.position = 'relative';
//       tempContainer.style.top = `-${currentPosition}px`;

//       // Generate canvas for the current chunk
//       const canvas = await html2canvas(pageContent, {
//         scale: 2,
//         useCORS: true,
//       });

//       const imgData = canvas.toDataURL('image/png');
//       pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);

//       currentPosition += pageHeightInPx;

//       if (currentPosition < tempContainer.scrollHeight) {
//         pdf.addPage();
//       }
//     }

//     pdf.save(`${type}.pdf`);
//     document.body.removeChild(tempContainer);
//   } catch (error) {
//     document.body.removeChild(tempContainer);
//     console.error('Error generating PDF:', error);
//     alert('Failed to generate PDF. Please try again.');
//   }
//   dispatch(setIsLoading({data:false}))
// };

export const handleDownload = async ({ type, id, tempname, assesment_id }, dispatch) => {
  try {
    dispatch(setIsLoading({ data: true }))
    const response = await API.get('/api/user/generate-pdf', { params: { type, id, assessment_id:assesment_id }, responseType: 'arraybuffer', headers: { Accept: 'application/pdf' } });
    if (response.data.byteLength === 0) {
      alert('Received empty PDF data from server.');
    }
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' }); // Convert to Blob of PDF type
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tempname}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);// Release the object URL
    dispatch(setIsLoading({ data: false }))
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    dispatch(setIsLoading({ data: false }))
  }
}

