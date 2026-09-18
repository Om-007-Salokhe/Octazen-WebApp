// Simple structured logger utility
import { env } from './env.js';

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
}

export const logger = {
  info(message, meta) {
    console.log(formatMessage(levels.INFO, message, meta));
  },
  warn(message, meta) {
    console.warn(formatMessage(levels.WARN, message, meta));
  },
  error(message, meta) {
    console.error(formatMessage(levels.ERROR, message, meta));
  },
  debug(message, meta) {
    if (env.NODE_ENV === 'development') {
      console.debug(formatMessage(levels.DEBUG, message, meta));
    }
  },
};

export default logger;
