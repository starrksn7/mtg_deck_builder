import axios from 'axios';

//need to change axios calls to use this api instead, so that it will automatically attach the headers
const api = axios.create({
  baseURL: 'https://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
