import axios, { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError;
  
  if (axiosError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = axiosError.response.status;
    const data = axiosError.response.data as { message?: string };
    
    if (status === 401) return 'Unauthorized. Please login again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'The requested resource was not found.';
    if (status === 500) return 'A server error occurred. Please try again later.';
    
    return data?.message || `Error: ${status} - ${axiosError.message}`;
  } else if (axiosError.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your network connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return axiosError.message || 'An unexpected error occurred.';
  }
};
