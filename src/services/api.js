import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import { hideLoader, showLoader } from '../utils/loaderManager';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (config.method?.toLowerCase() === 'get') {
    showLoader();
    config.metadata = { showLoader: true };
  }
  
  const { token } = parseCookies();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  hideLoader();
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    
    if (response.config.metadata?.showLoader) {
      hideLoader();
    }
    return response;
  },
  error => {
    if (error.config?.metadata?.showLoader) {
      hideLoader();
    }

    
    
    if (error.response?.status === 401) {
      destroyCookie(null, 'token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      // window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export default api;