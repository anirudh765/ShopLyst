import api from './api';

export const getAlerts = async () => {
  const res = await api.get('/alerts');
  return res.data;
};

export const deleteAlert = async (productId) => {
  const res = await api.delete(`/alerts/${productId}`);
  return res.data;
};

export default {
  getAlerts,
  deleteAlert
};