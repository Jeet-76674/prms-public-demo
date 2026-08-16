import api from './api';

export const tpoService = {
  getDashboard: async () => {
    const response = await api.get('/api/tpo/dashboard');
    return response.data;
  },
  getRecruiters: async (params = {}) => {
    // params can contain page, size, search, verified
    const response = await api.get('/api/tpo/recruiters', { params });
    return response.data;
  },
  getRecruiterById: async (id) => {
    const response = await api.get(`/api/tpo/recruiters/${id}`);
    return response.data;
  },
  getStudents: async (params = {}) => {
    const response = await api.get('/api/tpo/students', { params });
    return response.data;
  },
  getStudentById: async (id) => {
    const response = await api.get(`/api/tpo/students/${id}`);
    return response.data;
  },
  updateStudentPlacementStatus: async (id, placementStatus) => {
    const response = await api.put(`/api/tpo/students/${id}/placement-status`, { placementStatus });
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await api.delete(`/api/tpo/students/${id}`);
    return response.data;
  },

  getPlacements: async (params = {}) => {
    const response = await api.get('/api/tpo/placements', { params });
    return response.data;
  },
  getPlacementById: async (id) => {
    const response = await api.get(`/api/tpo/placements/${id}`);
    return response.data;
  },
  createPlacement: async (data) => {
    const response = await api.post('/api/tpo/placements', data);
    return response.data;
  },
  updatePlacement: async (id, data) => {
    const response = await api.put(`/api/tpo/placements/${id}`, data);
    return response.data;
  },
  updateOfferStatus: async (id, offerStatus) => {
    const response = await api.put(`/api/tpo/placements/${id}/offer-status`, { offerStatus });
    return response.data;
  },

  // Jobs
  getJobs: async (params = {}) => {
    const response = await api.get('/api/tpo/jobs', { params });
    return response.data;
  },
  getJobById: async (id) => {
    const response = await api.get(`/api/tpo/jobs/${id}`);
    return response.data;
  },
  getJobApplications: async (id, params = {}) => {
    const response = await api.get(`/api/tpo/jobs/${id}/applications`, { params });
    return response.data;
  },
  getPendingConversions: async (params = {}) => {
    const response = await api.get('/api/tpo/jobs/applications/selected', { params });
    return response.data;
  },
  getRecruiterJobs: async (id) => {
    const response = await api.get(`/api/tpo/recruiters/${id}/jobs`);
    return response.data;
  },
  getStudentApplications: async (id) => {
    const response = await api.get(`/api/tpo/students/${id}/applications`);
    return response.data;
  }
};
