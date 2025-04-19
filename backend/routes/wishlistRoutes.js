const express = require('express');
const router = express.Router();
const authMiddleware    = require('../middleware/authMiddleware');
const Wishlist          = require('../models/Wishlist');
const AmazonProduct     = require('../models/amazonProduct');
const FlipkartProduct   = require('../models/flipkartProduct');

// All routes require auth
router.use(authMiddleware);

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate('amazonProduct')
      .populate('flipkartProduct');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// POST /api/wishlist
router.post('/', async (req, res) => {
  const { productId, source,price, watched = false, targetPrice } = req.body;
  try {
    let amazonProduct = null, flipkartProduct = null;

    if (source === 'amazon') {
      amazonProduct = await AmazonProduct.findById(productId);
      if (!amazonProduct) return res.status(404).json({ error: 'Amazon product not found' });
    } else if (source === 'flipkart') {
      flipkartProduct = await FlipkartProduct.findById(productId);
      if (!flipkartProduct) return res.status(404).json({ error: 'Flipkart product not found' });
    } else {
      return res.status(400).json({ error: 'Invalid source' });
    }

    const exists = await Wishlist.findOne({
      user: req.user.id,
      $and: [
        { amazonProduct: amazonProduct?._id },
        { flipkartProduct: flipkartProduct?._id }
      ]
    });
    if (exists) return res.status(400).json({ error: 'Product already in wishlist' });

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      amazonProduct:   amazonProduct?._id,
      flipkartProduct: flipkartProduct?._id,
      price,
      watched,
      targetPrice
    });

    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// DELETE /api/wishlist/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!item) return res.status(404).json({ error: 'Wishlist item not found' });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// @PUT /api/wishlist/:id
router.put('/:id', async (req, res) => {
  const { watched, targetPrice } = req.body;
  try {
    const updated = await Wishlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { watched, targetPrice },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist item' });
  }
});

// @PUT /api/wishlist/:id/watch
router.put('/:id/watch', async (req, res) => {
  try {
    const item = await Wishlist.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.watched = !item.watched;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle watch status' });
  }
});

// @GET /api/wishlist/watched
router.get('/watched', async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id, watched: true }).populate('product');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watched items' });
  }
});

// @POST /api/wishlist/bulk
router.post('/bulk', async (req, res) => {
  const { items } = req.body; // [{ productId, watched, targetPrice }]
  try {
    const added = await Wishlist.insertMany(
      items.map(item => ({
        user: req.user.id,
        product: item.productId,
        watched: item.watched || false,
        targetPrice: item.targetPrice || null,
      }))
    );
    res.status(201).json(added);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add bulk wishlist items' });
  }
});

// @DELETE /api/wishlist
router.delete('/', async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user.id });
    res.json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
});

// @GET /api/wishlist/stats
router.get('/stats', async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).populate('product');
    const count = items.length;
    const avgPrice =
      items.reduce((sum, item) => sum + (item.product?.price || 0), 0) / (count || 1);
    res.json({ count, avgPrice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get wishlist stats' });
  }
});

module.exports = router;
