const cron = require('node-cron');
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Alert = require('../models/Alert');
const comparisonService = require('../services/comparisonService');
const notificationService = require('../services/notificationService');

/**
 * Scheduler for checking price updates
 * Uses node-cron to schedule regular price checks for watched products
 */
const scheduler = {
  // The active cron job instance
  activeCronJob: null,
  
  /**
   * Initialize the scheduler with a configurable interval
   * Default: Run every hour (0 * * * *)
   */
  initScheduler: () => {
    // Cancel any existing job
    if (scheduler.activeCronJob) {
      scheduler.activeCronJob.stop();
    }
    
    // Schedule to run every hour by default, or as configured in .env
    const cronSchedule = process.env.PRICE_CHECK_CRON || '0 * * * *';
    
    scheduler.activeCronJob = cron.schedule(cronSchedule, async () => {
      console.log(`Running scheduled price check: ${new Date().toISOString()}`);
      await scheduler.checkPrices();
    });
    
    console.log(`Price check scheduler initialized with schedule: ${cronSchedule}`);
  },
  
  /**
   * Check prices for all watched products
   */
  checkPrices: async () => {
    try {
      // Get all watched products from wishlist
      const watchedItems = await Wishlist.find({ watched: true })
        .populate('userId', 'email')
        .populate('productId');
      
      console.log(`Checking prices for ${watchedItems.length} watched products`);
      
      // Group by product to avoid checking the same product multiple times
      const productMap = new Map();
      watchedItems.forEach(item => {
        if (!productMap.has(item.productId._id.toString())) {
          productMap.set(item.productId._id.toString(), {
            product: item.productId,
            users: [{ user: item.userId, wishlistId: item._id }]
          });
        } else {
          productMap.get(item.productId._id.toString()).users.push({ 
            user: item.userId, 
            wishlistId: item._id 
          });
        }
      });
      
      // Check prices for each unique product
      for (const [productId, data] of productMap.entries()) {
        try {
          const { product, users } = data;
          
          // Get latest prices from all sources
          const latestPriceData = await comparisonService.compareProductPrices(product.externalId);
          
          // Check if price has changed
          let priceChanged = false;
          let lowestOldPrice = product.lowestPrice;
          let lowestNewPrice = Infinity;
          let bestSource = '';
          
          // Find lowest new price across all sources
          for (const source in latestPriceData) {
            if (latestPriceData[source] && latestPriceData[source].price) {
              if (latestPriceData[source].price < lowestNewPrice) {
                lowestNewPrice = latestPriceData[source].price;
                bestSource = source;
              }
            }
          }
          
          // If we have a valid new price
          if (lowestNewPrice < Infinity) {
            // Check if price decreased
            if (lowestNewPrice < lowestOldPrice) {
              priceChanged = true;
              
              // Update product with new lowest price
              await Product.findByIdAndUpdate(productId, {
                lowestPrice: lowestNewPrice,
                priceHistory: [...(product.priceHistory || []), {
                  price: lowestNewPrice,
                  date: new Date(),
                  source: bestSource
                }],
                lastUpdated: new Date()
              });
              
              // Notify each user watching this product
              for (const { user, wishlistId } of users) {
                // Create alert record
                const alert = new Notification({
                  userId: user._id,
                  productId,
                  wishlistId,
                  oldPrice: lowestOldPrice,
                  newPrice: lowestNewPrice,
                  source: bestSource,
                  percentageChange: ((lowestOldPrice - lowestNewPrice) / lowestOldPrice) * 100
                });
                await alert.save();
                
                // Send notifications
                await notificationService.notifyPriceChange(
                  user._id,
                  product,
                  lowestOldPrice,
                  lowestNewPrice,
                  bestSource
                );
              }
              
              console.log(
                `Price drop detected for ${product.name}: ${lowestOldPrice} → ${lowestNewPrice}`
              );
            } else if (lowestNewPrice > lowestOldPrice) {
              // Price increased, update but don't notify
              await Product.findByIdAndUpdate(productId, {
                lowestPrice: lowestNewPrice,
                priceHistory: [...(product.priceHistory || []), {
                  price: lowestNewPrice,
                  date: new Date(),
                  source: bestSource
                }],
                lastUpdated: new Date()
              });
            }
          }
        } catch (productError) {
          console.error(`Error checking price for product ${productId}:`, productError);
          // Continue with next product
        }
      }
      
      console.log('Scheduled price check completed');
    } catch (error) {
      console.error('Error in price checking scheduler:', error);
    }
  },
  
  /**
   * Force an immediate price check
   */
  runImmediateCheck: async () => {
    console.log('Running immediate price check');
    return scheduler.checkPrices();
  }
};

module.exports = scheduler;