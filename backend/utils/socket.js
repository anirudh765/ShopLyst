/**
 * Socket.io configuration and event handlers
 * Sets up real-time communication for price alerts and notifications
 */
module.exports = (io) => {
    // Store active user connections
    const userConnections = new Map();
    
    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
      let userId;
      
      // Handle user authentication for socket
      socket.on('authenticate', (data) => {
        if (data && data.userId) {
          userId = data.userId;
          
          // Add user to connections map
          if (!userConnections.has(userId)) {
            userConnections.set(userId, new Set());
          }
          userConnections.get(userId).add(socket.id);
          
          console.log(`User ${userId} authenticated on socket ${socket.id}`);
          
          // Confirm successful authentication
          socket.emit('authenticated', { success: true });
          
          // Join user-specific room for targeted broadcasts
          socket.join(`user:${userId}`);
        } else {
          socket.emit('authenticated', { 
            success: false, 
            message: 'Authentication failed' 
          });
        }
      });
      
      // Join specific product room to receive updates
      socket.on('watchProduct', (productId) => {
        if (productId && userId) {
          socket.join(`product:${productId}`);
          console.log(`User ${userId} joined product room: ${productId}`);
          socket.emit('watching', { productId });
        }
      });
      
      // Leave specific product room
      socket.on('unwatchProduct', (productId) => {
        if (productId) {
          socket.leave(`product:${productId}`);
          console.log(`Socket ${socket.id} left product room: ${productId}`);
          socket.emit('unwatching', { productId });
        }
      });
      
      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Remove socket from user connections
        if (userId && userConnections.has(userId)) {
          userConnections.get(userId).delete(socket.id);
          
          // Clean up if no connections left for this user
          if (userConnections.get(userId).size === 0) {
            userConnections.delete(userId);
          }
        }
      });
    });
    
    // Helper functions for sending notifications
    const socketUtils = {
      /**
       * Send price alert to specific user
       * @param {string} userId - The user ID to notify
       * @param {object} alertData - The alert data to send
       */
      sendPriceAlert: (userId, alertData) => {
        io.to(`user:${userId}`).emit('priceAlert', alertData);
        console.log(`Price alert sent to user ${userId}`);
      },
      
      /**
       * Send product update to everyone watching a specific product
       * @param {string} productId - The product ID that changed
       * @param {object} updateData - The update data to send
       */
      broadcastProductUpdate: (productId, updateData) => {
        io.to(`product:${productId}`).emit('productUpdate', updateData);
        console.log(`Product update broadcast for ${productId}`);
      },
      
      /**
       * Check if a user is currently connected
       * @param {string} userId - The user ID to check
       * @returns {boolean} Whether the user is connected
       */
      isUserConnected: (userId) => {
        return userConnections.has(userId) && userConnections.get(userId).size > 0;
      },
      
      /**
       * Get active connection count
       * @returns {object} Connection statistics
       */
      getConnectionStats: () => {
        return {
          totalUsers: userConnections.size,
          totalConnections: Array.from(userConnections.values())
            .reduce((total, set) => total + set.size, 0)
        };
      }
    };
    
    // Attach socket utility functions to io instance for use in other files
    io.socketUtils = socketUtils;
    
    return io;
  };