// Single centralized error handling middleware
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode} - ${message}`, {
    stack: err.stack,
    ip: req.ip,
    body: req.body,
  });

  const response = {
    success: false,
    message: statusCode === 500 && env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on the server.' 
      : message,
    code: err.code || 'INTERNAL_ERROR',
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
