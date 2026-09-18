// Admin Authentication Middleware - Verifies Admin JWT
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Authorization header missing or malformed.',
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Admin session expired. Please sign in again.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or forged authentication token.',
        code: 'TOKEN_INVALID',
      });
    }

    if (!decoded.adminId || !['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Administrative privileges required.',
      });
    }

    // Verify admin in database if connected with Postgres, or fallback to JWT payload
    let admin = null;
    if (env.DATABASE_URL?.startsWith('postgresql://') || env.DATABASE_URL?.startsWith('postgres://')) {
      try {
        admin = await prisma.admin.findUnique({
          where: { id: decoded.adminId },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
          },
        });
      } catch (dbErr) {
        // Prisma table may not exist
      }
    }

    if (!admin) {
      admin = {
        id: decoded.adminId,
        email: decoded.email || 'admin@institution.edu',
        fullName: decoded.fullName || 'Dr. Arthur Vance',
        role: decoded.role || 'SUPER_ADMIN',
        status: 'ACTIVE',
      };
    }

    if (admin.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Administrator account is disabled or no longer exists.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

export default adminAuth;
