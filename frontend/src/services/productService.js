import api from './api';

// const searchProducts = async (query) => {
//   const res = await api.get('/products/search', { params: { q: query } });
//   return res.data;
// };

const searchProducts = async (q, page = 1, limit = 20, category = '') => {
  const res = await api.get('/products/search', {
    params: { q, page, limit, category }
  });
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

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || err.message;
  }
};

export const addProduct = async (productData) => {
  try {
    console.log("Request in productservice: ", productData);
    const res = await api.post(`/products`, productData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || err.message;
  }
};

export const getSuggestions = async (id) => {
  const res = await api.get(`/products/${id}/suggestions`);
  return res.data;
};

export default {
  searchProducts,
  getProductById,
  compareProductPrices,
  updateProduct,
  deleteProduct,
  addProduct,
  getSuggestions
};