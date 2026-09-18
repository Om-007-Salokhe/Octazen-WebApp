// Student Authentication Middleware - Verifies Student JWT + Registered Device Fingerprint
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';

export const studentAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const deviceFingerprint = req.headers['x-device-fingerprint'] || req.headers['x-device-id'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Authorization token is missing.',
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
          message: 'Student session expired. Please sign in again.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid session token.',
        code: 'TOKEN_INVALID',
      });
    }

    if (!decoded.studentId) {
      return res.status(403).json({
        success: false,
        message: 'Invalid student authentication payload.',
      });
    }

    // Check Student existence and status
    const student = await prisma.student.findUnique({
      where: { id: decoded.studentId },
      include: {
        devices: true,
      },
    });

    if (!student || student.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Student account is suspended or inactive.',
      });
    }

    // Single-device / Registered device security verification
    if (deviceFingerprint) {
      const matchedDevice = student.devices.find(
        (d) => d.deviceFingerprint === deviceFingerprint && d.isTrusted
      );

      if (!matchedDevice && student.devices.length > 0) {
        return res.status(403).json({
          success: false,
          code: 'UNRECOGNIZED_DEVICE',
          message: 'Access denied: Unrecognized or untrusted device. Please verify your device.',
        });
      }
    }

    req.student = {
      id: student.id,
      email: student.email,
      fullName: student.fullName,
      status: student.status,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default studentAuth;
