const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const AmazonProduct  = require('../models/amazonProduct');
const FlipkartProduct = require('../models/flipkartProduct');

// Placeholder functions — replace with actual logic / API integration
const fetchExternalProductDetails = async (source, externalId) => {
  // TODO: Use 3rd-party API or scraper
  return {
    title: 'Mock Product',
    price: 999,
    source,
    externalId,
  };
};

/**
 * @route   GET /api/products/search
 * @desc    Search both Amazon and Flipkart collections by title
 * @query   {string} q     - search term
 * @query   {number} page  - page number (default: 1)
 * @query   {number} limit - items per page (default: 20)
 */
router.get('/search', async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;

  try {
    // Build a case‑insensitive regex from the query
    const regex = new RegExp(q, 'i');

    // Query both collections in parallel
    const [amazonDocs, flipkartDocs] = await Promise.all([
      AmazonProduct.find({ title: regex }).lean(),
      FlipkartProduct.find({ title: regex }).lean()
    ]);

    // Normalize to a single array with a `source` flag
    const unified = [
      ...amazonDocs.map(doc => ({
        _id:    doc._id,
        source: 'amazon',
        title:  doc.title,
        price:  doc.price,
        rating: doc.rating,
        reviews:doc.reviews,
        image:  doc.image,
        url:    doc.url
      })),
      ...flipkartDocs.map(doc => ({
        _id:    doc._id,
        source: 'flipkart',
        title:  doc.title,
        price:  doc.price,
        rating: doc.rating,
        reviews:doc.reviews,
        image:  doc.image,
        url:    doc.url
      }))
    ];

    // Total count before pagination
    const total = unified.length;

    // Simple in‑memory pagination
    const start = (page - 1) * limit;
    const results = unified.slice(start, start + +limit);

    res.json({
      results,
      total,
      page:  +page,
      limit: +limit
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// @route GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// @route GET /api/products/external/:source/:externalId
router.get('/external/:source/:externalId', async (req, res) => {
  const { source, externalId } = req.params;
  try {
    const data = await fetchExternalProductDetails(source, externalId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch external product' });
  }
});

// @route GET /api/products/:id/compare
router.get('/:id/compare', async (req, res) => {
  try {
    // TODO: Compare prices across platforms using stored external IDs
    res.json({
      productId: req.params.id,
      prices: [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price comparison' });
  }
});

// @route GET /api/products/:id/history
router.get('/:id/history', async (req, res) => {
  const { days = 30 } = req.query;
  try {
    // TODO: Query your price history model
    res.json({
      productId: req.params.id,
      history: [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// @route POST /api/products/track
router.post('/track', authMiddleware, async (req, res) => {
  const { externalId, source } = req.body;
  try {
    const existing = await Product.findOne({ externalId, source });
    if (existing) return res.json(existing);

    const data = await fetchExternalProductDetails(source, externalId);

    const newProduct = new Product({
      title: data.title,
      price: data.price,
      externalId,
      source,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to track product' });
  }
});

// @route GET /api/products/trending
router.get('/trending', async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const products = await Product.find()
      .sort({ watchCount: -1 }) // assuming this field exists
      .limit(+limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending products' });
  }
});

// @route GET /api/products/:id/similar
router.get('/:id/similar', async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(+limit);

    res.json(similar);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
});

module.exports = router;
