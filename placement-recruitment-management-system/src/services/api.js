import axios from 'axios';
import toast from 'react-hot-toast';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request Interceptor: Automatically inject JWT Token if it exists
api.interceptors.request.use(
  (config) => {
    // Skip ngrok warning page
    config.headers["ngrok-skip-browser-warning"] = "true";

    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (!response) {
      // Network Error (deduplicated by id)
      toast.error('Network Error: Please check if the backend server is running.', { id: 'network-error-toast' });
      return Promise.reject(new Error('Network offline'));
    }

    const { status, data, headers } = response;
    const message = data?.message || data?.error || 'An error occurred';

    switch (status) {
      case 400:
        if (!message?.toLowerCase().includes('profile not found')) {
          toast.error(message);
        }
        break;
      case 401:
        toast.error('Unauthorized (401): Session expired or invalid.', { id: 'unauthorized-toast' });
        sessionStorage.clear();
        // Redirect to selection or login
        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.href = '/select-role';
        }
        break;
      case 403:
        toast.error(`Forbidden (403): ${message}`);
        break;
      case 404:
        toast.error(`Not Found (404): ${message}`);
        break;
      case 409:
        toast.error(`Conflict (409): ${message}`);
        break;
      case 429: {
        const retryAfter = headers?.['retry-after'] || data?.retryAfterSeconds;
        const retryMsg = retryAfter 
          ? `Rate limit reached. Please wait ${retryAfter}s before retrying.` 
          : 'Too many requests. Please slow down and try again shortly.';
        toast.error(retryMsg, { id: 'rate-limit-toast', duration: 4000 });
        break;
      }
      case 500:
        toast.error(`Server Error: ${message}`);
        break;
      default:
        toast.error(`Error (${status}): ${message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
