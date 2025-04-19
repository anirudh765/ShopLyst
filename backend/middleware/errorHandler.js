const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      statusCode = 400;
      const errors = {};
      
      // Extract validation errors for each field
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      
      return res.status(statusCode).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    if (err.name === 'CastError') {
      // Mongoose casting error (e.g., invalid ObjectId)
      statusCode = 400;
      message = 'Resource not found or invalid ID format';
    }
    
    if (err.code === 11000) {
      // MongoDB duplicate key error
      statusCode = 409;
      message = 'Duplicate resource found';
      
      // Extract the field causing the duplicate
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      message = `${field} '${value}' already exists`;
    }
    
    // API error response
    res.status(statusCode).json({
      success: false,
      message,
      // Include stack trace in development mode only
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;