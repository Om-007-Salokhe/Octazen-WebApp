// Progress Controller
import { progressService } from './progress.service.js';
import { sendSuccess } from '../../utils/response.js';

export const progressController = {
  async recordProgress(req, res, next) {
    try {
      const studentId = req.student.id;
      const { videoId, watchedSeconds, isCompleted } = req.body;
      const progress = await progressService.updateProgress(studentId, videoId, watchedSeconds, isCompleted);
      return sendSuccess(res, progress, 'Progress updated');
    } catch (error) {
      next(error);
    }
  },

  async getCourseProgress(req, res, next) {
    try {
      const studentId = req.student.id;
      const courseId = req.params.courseId;
      const progress = await progressService.getProgressByCourse(studentId, courseId);
      return sendSuccess(res, progress);
    } catch (error) {
      next(error);
    }
  },
};

export default progressController;
