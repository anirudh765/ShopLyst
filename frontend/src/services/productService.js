import api from './api';

const searchProducts = async (query) => {
  const res = await api.get('/products/search', { params: { q: query } });
  return res.data;
};

const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

const compareProductPrices = async (id) => {
  const res = await api.get(`/products/${id}/compare`);
  return res.data;
};

export default {
  searchProducts,
  getProductById,
  compareProductPrices
};