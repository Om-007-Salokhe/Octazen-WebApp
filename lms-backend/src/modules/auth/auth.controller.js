// Auth Controller - Handles incoming auth requests
import { authService } from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const authController = {
  /**
   * POST /api/auth/admin/login
   */
  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const result = await authService.adminLogin(email, password, ipAddress, userAgent);

      // Set cookie in HTTP response so it is visible in DevTools Application -> Cookies
      res.cookie('aegis_jwt_token', result.token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: false, // Visible in document.cookie / DevTools
        sameSite: 'lax',
        path: '/',
      });
      res.cookie('admin_token', result.token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
      });
      res.cookie('jwt_token', result.token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
      });

      return sendSuccess(res, result, 'Admin authenticated successfully', 200);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/student/login
   */
  async studentLogin(req, res, next) {
    try {
      const { email, password, deviceFingerprint, deviceName } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await authService.studentLogin(
        email,
        password,
        deviceFingerprint,
        deviceName,
        ipAddress,
        userAgent
      );

      return sendSuccess(res, result, 'Student authenticated successfully', 200);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(req, res, next) {
    try {
      if (req.admin) {
        return sendSuccess(res, { user: req.admin, type: 'ADMIN' });
      }
      if (req.student) {
        return sendSuccess(res, { user: req.student, type: 'STUDENT' });
      }
      return sendError(res, 'Unauthenticated', 401);
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
