import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const formDataApi = axios.create({
  baseURL: API_URL + '/api/v1',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

formDataApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});