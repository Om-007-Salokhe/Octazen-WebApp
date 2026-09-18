// JWT Token Service for signing and verifying tokens
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const tokenService = {
  /**
   * Generates Admin Access Token
   */
  generateAdminToken(admin) {
    return jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: 'ADMIN_ACCESS',
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  },

  /**
   * Generates Student Access Token with Device ID
   */
  generateStudentToken(student, deviceId) {
    return jwt.sign(
      {
        studentId: student.id,
        email: student.email,
        deviceId: deviceId,
        type: 'STUDENT_ACCESS',
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  },

  /**
   * Generates Refresh Token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  },

  /**
   * Verify standard JWT token
   */
  verifyToken(token, secret = env.JWT_SECRET) {
    return jwt.verify(token, secret);
  },
};

export default tokenService;
