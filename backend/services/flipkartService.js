const axiosFK = require('axios');

const FK_AFFILIATE_ID = process.env.FLIPKART_AFFILIATE_ID;
const FK_AFFILIATE_TOKEN = process.env.FLIPKART_AFFILIATE_TOKEN;
const FK_BASE = 'https://affiliate-api.flipkart.net/affiliate';

async function searchFlipkartProducts(query, page = 1, limit = 20) {
  if (!FK_AFFILIATE_ID || !FK_AFFILIATE_TOKEN) throw new Error('Flipkart API credentials missing');
  const url = `${FK_BASE}/search/json?query=${encodeURIComponent(query)}` +
    `&resultCount=${limit}&page=${page}`;
  const { data } = await axiosFK.get(url, {
    headers: {
      'Fk-Affiliate-Id': FK_AFFILIATE_ID,
      'Fk-Affiliate-Token': FK_AFFILIATE_TOKEN
    }
  });
  return data.products.map(item => ({
    source: 'flipkart',
    externalId: item.productBaseInfo.productIdentifier,
    title: item.productBaseInfo.title,
    price: item.productBaseInfo.flipkartSpecialPrice.amount,
    currency: item.productBaseInfo.flipkartSpecialPrice.currency,
    image: item.productBaseInfo.imageUrls['200x200'],
    url: item.productBaseInfo.productUrl
  }));
}

async function getFlipkartProductById(productId) {
  if (!FK_AFFILIATE_ID || !FK_AFFILIATE_TOKEN) throw new Error('Flipkart API credentials missing');
  const url = `${FK_BASE}/product/json?id=${productId}`;
  const { data } = await axiosFK.get(url, {
    headers: {
      'Fk-Affiliate-Id': FK_AFFILIATE_ID,
      'Fk-Affiliate-Token': FK_AFFILIATE_TOKEN
    }
  });
  const item = data.productBaseInfoV1;
  return {
    source: 'flipkart',
    externalId: productId,
    title: item.title,
    price: item.flipkartSpecialPrice.amount,
    currency: item.flipkartSpecialPrice.currency,
    image: item.imageUrls['200x200'],
    url: item.productUrl,
    description: item.productDescription
  };
}

module.exports = { searchFlipkartProducts, getFlipkartProductById };