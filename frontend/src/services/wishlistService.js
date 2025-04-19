import api from './api';

export const getWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data;
};

export const addToWishlist = async ({ productId, source,price, watched, targetPrice }) => {
  console.log('Sending to backend:', { productId, source,price, watched, targetPrice });
  const res = await api.post('/wishlist', {
    productId,
    source,
    price,
    watched,
    targetPrice
  });
  return res.data;
};

export const removeFromWishlist = async (id) => {
  const res = await api.delete(`/wishlist/${id}`);
  return res.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};