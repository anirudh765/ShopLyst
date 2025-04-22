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

// routes/productRoutes.js
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isadmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // support either req.body.source or req.body.platform
    const source = (req.body.source || req.body.platform || '').toLowerCase();
    const productData = { ...req.body };
    delete productData.source;
    delete productData.platform;

    console.log("Source in add:", source);
    console.log("Payload in add:", productData);

    let product;
    if (source === 'amazon') {
      product = new AmazonProduct(productData);
    } else if (source === 'flipkart') {
      product = new FlipkartProduct(productData);
    } else {
      return res.status(400).json({ message: 'Invalid source' });
    }

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// @route GET /api/products/:id
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // look in both collections
    let product =
      await AmazonProduct.findById(id).lean() ||
      await FlipkartProduct.findById(id).lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // attach a "source" field so the frontend knows which platform
    product.source = (product.asin) ? 'amazon' : 'flipkart';
    res.json(product);
  } catch (err) {
    console.error('GET /products/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;
    const updates = req.body; // e.g. { title, price, rating, reviews, url, image }

    // Try Amazon first
    let updated = await AmazonProduct.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();

    let source = 'amazon';

    // If not found in Amazon, try Flipkart
    if (!updated) {
      updated = await FlipkartProduct.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      }).lean();
      source = 'flipkart';
    }

    // If still not found, 404
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Attach source so frontend knows
    updated.source = source;

    return res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Try deleting from Amazon collection
    let deleted = await AmazonProduct.findByIdAndDelete(id);
    if (deleted) {
      return res.json({ message: 'Product deleted from Amazon' });
    }

    // Try deleting from Flipkart collection
    deleted = await FlipkartProduct.findByIdAndDelete(id);
    if (deleted) {
      return res.json({ message: 'Product deleted from Flipkart' });
    }

    return res.status(404).json({ message: 'Product not found' });

  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ message: 'Server error' });
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
    const { id } = req.params;

    // 1️⃣ Try to find in Amazon
    let amazon = await AmazonProduct.findById(id).lean();
    let flipkart = null;

    if (amazon) {
      // 2️⃣ If found in Amazon, search Flipkart by title (case‑insensitive)
      flipkart = await FlipkartProduct.findOne({
        title: { $regex: new RegExp(amazon.title.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }
      }).lean();
    } else {
      // 3️⃣ Otherwise, try the opposite
      flipkart = await FlipkartProduct.findById(id).lean();
      if (flipkart) {
        amazon = await AmazonProduct.findOne({
          title: { $regex: new RegExp(flipkart.title.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }
        }).lean();
      } else {
        return res.status(404).json({ error: 'Product not found in either collection' });
      }
    }

    // 4️⃣ Build the prices array
    const prices = [];
    if (amazon) {
      prices.push({
        source: 'amazon',
        id:     amazon._id,
        title:  amazon.title,
        price:  amazon.price,
        url:    amazon.url
      });
    }
    if (flipkart) {
      prices.push({
        source: 'flipkart',
        id:     flipkart._id,
        title:  flipkart.title,
        price:  flipkart.price,
        url:    flipkart.url
      });
    }

    return res.json({ productId: id, prices });
  } catch (err) {
    console.error('Compare error:', err);
    return res.status(500).json({ error: 'Failed to fetch price comparison' });
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
