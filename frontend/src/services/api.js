import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const savedAuth = localStorage.getItem('examverse-auth');
    if (savedAuth) {
      const { token } = JSON.parse(savedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('examverse-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Paper APIs
export const paperAPI = {
  getAll: (params) => api.get('/papers', { params }),
  getById: (id) => api.get(`/papers/${id}`),
  create: (data) => api.post('/papers', data),
  update: (id, data) => api.put(`/papers/${id}`, data),
  delete: (id) => api.delete(`/papers/${id}`),
  uploadPDF: (formData) => api.post('/papers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Question APIs
export const questionAPI = {
  getByPaper: (paperId) => api.get(`/questions/paper/${paperId}`),
  getById: (id) => api.get(`/questions/${id}`),
  generateAISolution: (questionId) => api.post(`/questions/${questionId}/ai-solution`),
  getVideoSolutions: (questionId, refresh = false) => 
    api.get(`/questions/${questionId}/videos`, { params: { refresh } }),
  reportIssue: (questionId, data) => api.post(`/questions/${questionId}/report`, data),
  vote: (questionId, voteType) => api.post(`/questions/${questionId}/vote/${voteType}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getSavedPapers: () => api.get('/user/saved/papers'),
  getSavedQuestions: () => api.get('/user/saved/questions'),
  savePaper: (paperId) => api.post(`/user/saved/papers/${paperId}`),
  saveQuestion: (questionId) => api.post(`/user/saved/questions/${questionId}`),
  unsavePaper: (paperId) => api.delete(`/user/saved/papers/${paperId}`),
  unsaveQuestion: (questionId) => api.delete(`/user/saved/questions/${questionId}`),
};

// Faculty APIs
export const facultyAPI = {
  getDashboard: () => api.get('/faculty/dashboard'),
  getMyPapers: () => api.get('/faculty/papers'),
  getAnalytics: (paperId) => api.get(`/faculty/papers/${paperId}/analytics`),
};

// Admin APIs
export const adminAPI = {
  getPendingFaculty: () => api.get('/admin/faculty/pending'),
  approveFaculty: (facultyId) => api.post(`/admin/faculty/${facultyId}/approve`),
  rejectFaculty: (facultyId, reason) => api.post(`/admin/faculty/${facultyId}/reject`, { reason }),
  getReports: () => api.get('/admin/reports'),
  getAnalytics: () => api.get('/admin/analytics'),
};

// Videos APIs (generic YouTube search via backend)
export const videosAPI = {
  search: (query, params = {}) =>
    api.get('/videos/search', { params: { query, ...params } }),
  byTopic: (topic, subject = '', params = {}) =>
    api.get('/videos/topic', { params: { topic, subject, ...params } }),
  details: (videoId) => api.get(`/videos/${videoId}`),
};
