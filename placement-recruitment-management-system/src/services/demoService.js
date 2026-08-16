import api from './api';

export const demoService = {
  getDemoStatus: async () => {
    try {
      const response = await api.get('/api/demo/status');
      return response.data;
    } catch (error) {
      return { demoEnabled: false };
    }
  },

  resetDemoEnvironment: async () => {
    const response = await api.post('/api/demo/reset');
    return response.data;
  },
};
