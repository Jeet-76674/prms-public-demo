import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://prms-backend-jlrr.onrender.com' : '');
const baseURL = rawBaseURL ? rawBaseURL.replace(/\/+$/, '') : '';

// Create Axios Instance
const api = axios.create({
  baseURL,
  timeout: 35000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject JWT Token if it exists
api.interceptors.request.use(
  (config) => {
    // Skip ngrok warning page only when interacting with ngrok endpoints
    if (baseURL.includes('ngrok')) {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally without duplicate toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        toast.error('Server is waking up (cold start) or taking too long. Please wait a moment and try again.', { id: 'network-error-toast' });
      } else {
        toast.error('Network Error: Please check if the backend server is running.', { id: 'network-error-toast' });
      }
      return Promise.reject(error);
    }

    const { status, data, headers } = response;
    const message = data?.message || data?.error || 'An error occurred';

    switch (status) {
      case 400:
        // Do not toast for auth endpoints where AuthContext/login form renders the specific failure
        if (!error.config?.url?.includes('/api/auth/') && !message?.toLowerCase().includes('profile not found')) {
          toast.error(message, { id: 'bad-request-toast' });
        }
        break;
      case 401:
        // If an explicit login request returned 401, AuthContext handles reporting invalid credentials
        if (error.config?.url?.includes('/api/auth/login')) {
          break;
        }
        toast.error('Unauthorized (401): Session expired or invalid.', { id: 'unauthorized-toast' });
        sessionStorage.clear();
        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.href = '/select-role';
        }
        break;
      case 403:
        toast.error(`Forbidden (403): ${message}`, { id: 'forbidden-toast' });
        break;
      case 404:
        toast.error(`Not Found (404): ${message}`, { id: 'not-found-toast' });
        break;
      case 409:
        toast.error(`Conflict (409): ${message}`, { id: 'conflict-toast' });
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
      case 502:
      case 503:
      case 504:
        toast.error(`Server Error (${status}): ${message || 'Backend service is temporarily unavailable.'}`, { id: 'server-error-toast' });
        break;
      default:
        toast.error(`Error (${status}): ${message}`, { id: `error-${status}` });
    }

    return Promise.reject(error);
  }
);

export default api;
