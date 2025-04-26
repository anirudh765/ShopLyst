const cron = require('node-cron');
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

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
        if (item.productId) {
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
        }
      });
      
      // Now, productMap contains the products and associated users
      for (const [productId, data] of productMap.entries()) {
        const { product } = data;
        
        // No price comparison, no notifications
        console.log(`Skipping price check and notification for product ${product.name} (${productId})`);
      }
      
      console.log('Scheduled check completed (no comparison, no notifications)');
    } catch (error) {
      console.error('Error in scheduler:', error);
    }
  },
  
  /**
   * Force an immediate check
   */
  runImmediateCheck: async () => {
    console.log('Running immediate check');
    return scheduler.checkPrices();
  }
};

module.exports = scheduler;
