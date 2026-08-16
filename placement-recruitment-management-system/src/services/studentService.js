import api from './api';

export const studentService = {
  getProfile: async () => {
    const response = await api.get('/api/student/profile');
    return response.data;
  },
  saveProfile: async (profileData) => {
    let response;
    try {
      response = await api.put('/api/student/profile', profileData);
    } catch (e) {
      const isNotFound = e.response && (e.response.status === 404 || (e.response.status === 400 && e.response.data?.message?.includes('not found')));
      if (isNotFound) {
        response = await api.post('/api/student/profile', profileData);
      } else {
        throw e;
      }
    }
    return response.data;
  },
  uploadResume: async (formData) => {
    const response = await api.post('/api/student/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  uploadProfileImage: async (formData) => {
    const response = await api.post('/api/student/profile/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getJobs: async (searchFilters = {}) => {
    const { title, location, department, employmentType, workMode, page, size } = searchFilters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    if (title) params.title = title;
    if (location) params.location = location;
    if (department) params.department = department;
    if (employmentType) params.employmentType = employmentType;
    if (workMode) params.workMode = workMode;
    
    // Check if any search filters exist
    const hasFilters = Object.keys(params).some(key => !['page', 'size'].includes(key));
    
    const response = await api.get(hasFilters ? '/api/student/jobs/search' : '/api/student/jobs', { params });
    return response.data;
  },
  getJobById: async (id) => {
    const response = await api.get(`/api/student/jobs/${id}`);
    return response.data;
  },
  applyJob: async (jobId, coverLetter) => {
    const response = await api.post(`/api/student/jobs/${jobId}/apply`, { coverLetter });
    return response.data;
  },
  getApplications: async (searchFilters = {}) => {
    const { page, size } = searchFilters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    const response = await api.get('/api/student/applications', { params });
    return response.data;
  },
  getApplicationById: async (id) => {
    const response = await api.get(`/api/student/applications/${id}`);
    return response.data;
  },
  withdrawApplication: async (id) => {
    const response = await api.put(`/api/student/applications/${id}/withdraw`);
    return response.data;
  },
  acceptOffer: async (id) => {
    const response = await api.put(`/api/student/applications/${id}/accept`);
    return response.data;
  },
  rejectOffer: async (id) => {
    const response = await api.put(`/api/student/applications/${id}/reject`);
    return response.data;
  },
  getPlacements: async (searchFilters = {}) => {
    const { page, size } = searchFilters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    const response = await api.get('/api/student/placements', { params });
    return response.data;
  }
};
