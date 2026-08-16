import api from './api';

export const vcService = {
  getDashboard: async () => {
    const response = await api.get('/api/vc/dashboard');
    return response.data;
  },

  // Recruiter / Company Approvals
  getRecruiters: async (params = {}) => {
    const response = await api.get('/api/vc/recruiters', { params });
    return response.data;
  },
  getRecruiterById: async (id) => {
    const response = await api.get(`/api/vc/recruiters/${id}`);
    return response.data;
  },
  approveRecruiter: async (id) => {
    const response = await api.put(`/api/vc/recruiters/${id}/approve`);
    return response.data;
  },
  rejectRecruiter: async (id) => {
    const response = await api.put(`/api/vc/recruiters/${id}/reject`);
    return response.data;
  },
  updateRecruiterStatus: async (id, accountStatus) => {
    const response = await api.put(`/api/vc/recruiters/${id}/status`, { accountStatus });
    return response.data;
  },
  getRecruiterJobs: async (id) => {
    const response = await api.get(`/api/vc/recruiters/${id}/jobs`);
    return response.data;
  },

  // TPO Management
  getAllTpos: async () => {
    const response = await api.get('/api/vc/tpo');
    return response.data;
  },
  getTpoById: async (id) => {
    const response = await api.get(`/api/vc/tpo/${id}`);
    return response.data;
  },
  createTpo: async (data) => {
    const response = await api.post('/api/vc/tpo', data);
    return response.data;
  },
  updateTpoStatus: async (id, accountStatus) => {
    const response = await api.put(`/api/vc/tpo/${id}/status`, { accountStatus });
    return response.data;
  },
  resetTpoPassword: async (id, newPassword) => {
    const response = await api.put(`/api/vc/tpo/${id}/reset-password`, { newPassword });
    return response.data;
  }
};
