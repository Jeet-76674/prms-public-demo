import api from './api';

export const recruiterService = {
  getProfile: async () => {
    const response = await api.get('/api/recruiter/profile');
    return response.data;
  },
  saveProfile: async (profileData) => {
    let response;
    try {
      response = await api.put('/api/recruiter/profile', profileData);
    } catch (e) {
      const isNotFound = e.response && (e.response.status === 404 || (e.response.status === 400 && e.response.data?.message?.includes('not found')));
      if (isNotFound) {
        response = await api.post('/api/recruiter/profile', profileData);
      } else {
        throw e;
      }
    }
    return response.data;
  },
  uploadLogo: async (formData) => {
    const response = await api.post('/api/recruiter/profile/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getJobs: async (filters = {}) => {
    const { page, size, status } = filters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    if (status) params.status = status;
    const response = await api.get('/api/recruiter/jobs', { params });
    return response.data;
  },
  createJob: async (jobData) => {
    const response = await api.post('/api/recruiter/jobs', jobData);
    return response.data;
  },
  getJobById: async (id) => {
    const response = await api.get(`/api/recruiter/jobs/${id}`);
    return response.data;
  },
  updateJob: async (id, jobData) => {
    const response = await api.put(`/api/recruiter/jobs/${id}`, jobData);
    return response.data;
  },
  deleteJob: async (id) => {
    const response = await api.delete(`/api/recruiter/jobs/${id}`);
    return response.data;
  },
  uploadJD: async (id, formData) => {
    const response = await api.post(`/api/recruiter/jobs/${id}/jd`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updateJobStatus: async (id, status) => {
    const response = await api.patch(`/api/recruiter/jobs/${id}/status`, null, { params: { status } });
    return response.data;
  },
  getJobApplications: async (jobId, filters = {}) => {
    const { page, size } = filters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    const response = await api.get(`/api/recruiter/jobs/${jobId}/applications`, { params });
    return response.data;
  },
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/api/recruiter/applications/${applicationId}/status`, { applicationStatus: status });
    return response.data;
  },
  scheduleBulkInterviews: async (requestData) => {
    const response = await api.post('/api/recruiter/applications/bulk-schedule', requestData);
    return response.data;
  },
  updateBulkApplicationStatus: async (requestData) => {
    const response = await api.put('/api/recruiter/applications/bulk-status', requestData);
    return response.data;
  },
  getPlacements: async (filters = {}) => {
    const { page, size } = filters;
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;
    const response = await api.get('/api/recruiter/placements', { params });
    return response.data;
  }
};
