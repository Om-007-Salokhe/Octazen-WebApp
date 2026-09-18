// Course Controller
import { courseService } from './course.service.js';
import { sendSuccess } from '../../utils/response.js';

export const courseController = {
  async getAll(req, res, next) {
    try {
      const courses = await courseService.getAllCourses();
      return sendSuccess(res, courses, 'Courses retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      return sendSuccess(res, course);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      return sendSuccess(res, course, 'Course created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      return sendSuccess(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      return sendSuccess(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default courseController;
