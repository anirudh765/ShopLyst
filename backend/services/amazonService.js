const axios = require('axios');

// You can use Amazon Product Advertising API or Rainforest API for simplicity
const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;

/**
 * Search products on Amazon
 * @param {string} query
 * @param {string} category
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<Array>} Array of product objects
 */
async function searchAmazonProducts(query, category = 'All', page = 1, limit = 20) {
  if (!RAINFOREST_API_KEY) throw new Error('Rainforest API key not configured');
  const url = `https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}` +
    `&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(query)}` +
    `&category=${category}&page=${page}`;
  const { data } = await axios.get(url);
  return data.search_results.map(item => ({
    source: 'amazon',
    externalId: item.asin,
    title: item.title,
    price: item.price.value,
    currency: item.price.currency,
    image: item.image,
    url: item.link
  }));
}

/**
 * Get detailed product info by ASIN
 * @param {string} asin
 */
async function getAmazonProductById(asin) {
  if (!RAINFOREST_API_KEY) throw new Error('Rainforest API key not configured');
  const url = `https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}` +
    `&type=product&amazon_domain=amazon.com&asin=${asin}`;
  const { data } = await axios.get(url);
  const item = data.product;
  return {
    source: 'amazon',
    externalId: asin,
    title: item.title,
    price: item.buybox_winner.price.value,
    currency: item.buybox_winner.price.currency,
    image: item.images[0].link,
    url: item.link,
    features: item.features
  };
}

module.exports = { searchAmazonProducts, getAmazonProductById };