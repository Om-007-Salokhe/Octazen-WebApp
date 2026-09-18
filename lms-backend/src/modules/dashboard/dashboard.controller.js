// Dashboard Controller
import { dashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../utils/response.js';

export const dashboardController = {
  async getOverview(req, res, next) {
    try {
      const stats = await dashboardService.getAdminStats();
      return sendSuccess(res, stats, 'Dashboard metrics loaded');
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
