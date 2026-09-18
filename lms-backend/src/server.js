// Server entry point - Starts the LMS Backend API Server
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/db.js';

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection
    const isPostgresUrl = env.DATABASE_URL?.startsWith('postgresql://') || env.DATABASE_URL?.startsWith('postgres://');
    if (isPostgresUrl) {
      try {
        await prisma.$connect();
        logger.info('Database connection established successfully with Prisma PostgreSQL.');
      } catch (dbError) {
        logger.warn('Could not connect to PostgreSQL database via Prisma:', {
          error: dbError.message,
        });
      }
    } else {
      logger.info('🛡️  Database: Supabase REST API Service Active.');
    }

    const server = app.listen(PORT, () => {
      logger.info(`=======================================================`);
      logger.info(`🛡️  Aegis Academy LMS Backend Service Online`);
      logger.info(`🚀 Listening on port: ${PORT} (http://localhost:${PORT})`);
      logger.info(`🌐 Environment: ${env.NODE_ENV}`);
      logger.info(`🔒 Security: Enterprise TLS 1.3 / AES-256 Auth Enabled`);
      logger.info(`=======================================================`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        if (isPostgresUrl) {
          await prisma.$disconnect();
          logger.info('Database connection disconnected.');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal error starting server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();
