import api from './api';

export const authService = {
  login: async (email, password, role) => {
    const response = await api.post('/api/auth/login', { email, password, role });
    return response.data;
  },
  signup: async (signupData) => {
    const response = await api.post('/api/auth/signup', signupData);
    return response.data;
  },
  sendOtp: async (data, role = 'STUDENT') => {
    const response = await api.post('/api/otp/send', { ...data, role });
    return response.data;
  },
  verifyOtp: async (email, otp) => {
    const response = await api.post('/api/otp/verify', { email, otp });
    return response.data;
  },
  sendForgotPasswordOtp: async (data) => {
    const response = await api.post('/api/auth/forgot-password/send-otp', data);
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await api.post('/api/auth/forgot-password/reset', data);
    return response.data;
  }
};
