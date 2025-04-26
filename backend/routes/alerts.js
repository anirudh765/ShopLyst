const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Wishlist         = require('../models/Wishlist');
const AmazonProduct    = require('../models/amazonProduct');
const FlipkartProduct  = require('../models/flipkartProduct');
const Alert = require('../models/alertmodel');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    const watchedItems = await Wishlist.find({
      user: userId,
      targetPrice: { $ne: null }
    });

    const alerts = [];

    for (let item of watchedItems) {
      let product, source;

      if (item.amazonProduct) {
        product = await AmazonProduct.findById(item.amazonProduct).lean();
        source = 'amazon';
      } else if (item.flipkartProduct) {
        product = await FlipkartProduct.findById(item.flipkartProduct).lean();
        source = 'flipkart';
      }

      if (!product) continue;

      if (product.price <= item.targetPrice) {
        const alreadyAlerted = await Alert.findOne({
          userId,
          productId: product._id,
          currentPrice: product.price
        });

        if (!alreadyAlerted) {
          alerts.push({
            wishlistItemId: item._id,
            productId: product._id,
            source,
            title: product.title,
            currentPrice: product.price,
            targetPrice: item.targetPrice,
            image: product.image,
            url: product.url
          });
        }
      }
    }

    res.json(alerts);
  } catch (err) {
    console.error('GET /api/alerts error', err);
    res.status(500).json({ message: 'Server error fetching alerts' });
  }
});

// DELETE /api/alerts/:id - delete alert
router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Try both sources
    let product = await AmazonProduct.findById(productId).lean();
    if (!product) {
      product = await FlipkartProduct.findById(productId).lean();
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Alert.create({
      userId,
      productId,
      currentPrice: product.price
    });

    res.status(200).json({ message: 'Alert logged successfully' });
  } catch (err) {
    console.error('DELETE /api/alerts/:productId error', err);
    res.status(500).json({ message: 'Server error logging alert' });
  }
});

module.exports = router;
