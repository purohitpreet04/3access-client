// src/hooks/useApi.js
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../Redux/Sclice/SnaackBarSclice';
import { logout } from '@app/Redux/Sclice/AuthSclice';
import API from 'Constance';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { useCallback, useState } from 'react';
import { useInfiniteQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { setIsLoading } from '@app/Redux/Sclice/manageStateSclice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const queryClient = new QueryClient()


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


// Custom hook for GET request
export const useGetApi = (key, url, options) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const res = await API.get(url, { params: { ...options } });
        return res.data;
      } catch (error) {
        if (error.response?.status === 409) {
          dispatch(logout());
          navigate('/login');
        } else {
          dispatch(showSnackbar({
            message: error.response?.data?.message || "An error occurred",
            severity: "error"
          }));
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {

      if (error.response?.status !== 200) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (retryAttempt) => Math.min(1000 * 2 ** retryAttempt, 30000),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    ...options,
  });
};




// Custom hook for POST request
export const usePost = (url, invalidatekey, params) => {
  const dispatch = useDispatch();
  const navigation = useNavigate()
  return useMutation({
    mutationFn: async (data) => {
      try {
        dispatch(setIsLoading({ data: true }))
        const res = await API.post(url, data, { params: { ...params } });
        dispatch(showSnackbar({ message: res?.data?.message || "Request successful", severity: "success" }));
        dispatch(setIsLoading({ data: false }))
        return res.data;

      } catch (error) {
        if (error.response?.status === 409) {
          dispatch(logout());
          dispatch(setIsLoading({ data: false }))
          navigation('/auth/login')
        }
        dispatch(showSnackbar({ message: error.response?.data?.message || "An error occurred", severity: "error" }));
        dispatch(setIsLoading({ data: false }))
      }
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries([...invalidatekey]);
      const previousData = queryClient.getQueryData([...invalidatekey]);
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...invalidatekey] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...invalidatekey] });
    }
  });
};

// Custom hook for listing with pagination
export const useListing = (key, url, options = { page, limit, search, clinicID }) => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  return useQuery({
    queryKey: [key, page, limit, search],
    queryFn: async () => {
      try {
        const res = await API.get(url, {
          params: { page: page + 1, limit, search: search, clinicID, ...options },
        });
        return res.data;
      } catch (error) {
        if (error.response?.status === 409) {
          dispatch(logout());
          navigation('/login')
        }
        dispatch(showSnackbar({ message: error.response?.data?.message || "An error occurred", severity: "error" }));
        throw error;
      }
    },
    keepPreviousData: true,
  });
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



export const useInfiniteScroll = ({ queryKey, queryFn, getNextPageParam, initialPageParam, getPreviousPageParam }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    getPreviousPageParam,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialPageParam
  });
  // const a = getNextPageParam()
  // console.log(getNextPageParam)
  const handleScroll = (e) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchNextPage(); // Call fetchNextPage directly
    }
  }
  return {
    data: { listdata: data?.pages.flatMap((page) => page?.items) || [], total: data?.pages[0]?.Total },
    isLoading,
    isFetchingNextPage,
    error,
    handleScroll,
    fetchNextPage,
    refetch,
  };
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

export const handleDownload = async ({ type, id }) => {
  try {
    // Fetch the HTML content from the server
    const response = await API.get('/api/tenents/getdocument', { params: { type, id } })
    const htmlContent = await response.data;

    // Create a hidden element to render the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    document.body.appendChild(tempElement);

    // Use html2canvas to capture the element
    const canvas = await html2canvas(tempElement, { scale: 2 });

    // Generate PDF from canvas
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('user-details.pdf');

    // Clean up
    document.body.removeChild(tempElement);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};