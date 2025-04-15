import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Django backend
});

export const registerUser = (data) => API.post('/auth/users/', data);
export const loginUser = (data) => API.post('/auth/token/login/', data);
export const getUser = (token) =>
  API.get('/auth/users/me/', {
    headers: { Authorization: `Token ${token}` },
  });
export const updateUser = (data, token) =>
  API.patch('/auth/users/me/', data, {
    headers: { Authorization: `Token ${token}` },
  });
