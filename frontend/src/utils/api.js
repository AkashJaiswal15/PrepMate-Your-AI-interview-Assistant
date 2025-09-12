import axios from 'axios';

const API = axios.create({
  baseURL: 'https://prep-mate-your-ai-interview-assistant-hswm.vercel.app/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const resumeAPI = {
  upload: (formData) => API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const aiAPI = {
  generateQuestions: (data) => API.post('/ai/generate-questions', data),
  submitAnswer: (data) => API.post('/ai/submit-answer', data),
  togglePin: (data) => API.post('/ai/toggle-pin', data)
};

export const dashboardAPI = {
  getDashboard: () => API.get('/dashboard'),
  getSession: (id) => API.get(`/dashboard/session/${id}`)
};

export default API;