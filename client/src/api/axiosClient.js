import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      console.log('[axiosClient] request ->', config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`, config.data || '');
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle unauth globally
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (typeof window !== 'undefined') {
      console.log('[axiosClient] response error <-', error.config?.method?.toUpperCase(), `${error.config?.baseURL || ''}${error.config?.url || ''}`, error.response?.status, error.response?.data || error.message);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
