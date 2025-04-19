// src/services/authService.js
import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // { user, token }
};

export const signup = async (user, email, password) => {
  const res = await api.post('/auth/signup', { user, email, password });
  return res.data; // { user, token }
};

export const logout = async () => {
  await api.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const getUser = async () => {
  const token = localStorage.getItem('token');
  const res = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // user object
};

export default { login, signup, logout, getUser };
