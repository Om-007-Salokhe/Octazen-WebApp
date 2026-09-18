// Enrollment Controller
import { enrollmentService } from './enrollment.service.js';
import { sendSuccess } from '../../utils/response.js';

export const enrollmentController = {
  async enroll(req, res, next) {
    try {
      const { studentId, courseId, expiresAt } = req.body;
      const enrollment = await enrollmentService.enrollStudent(studentId, courseId, expiresAt);
      return sendSuccess(res, enrollment, 'Student enrolled successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getMyEnrollments(req, res, next) {
    try {
      const studentId = req.student.id;
      const enrollments = await enrollmentService.getStudentEnrollments(studentId);
      return sendSuccess(res, enrollments);
    } catch (error) {
      next(error);
    }
  },
};

export default enrollmentController;
