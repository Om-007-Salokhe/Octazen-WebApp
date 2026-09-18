// Student Controller
import { studentService } from './student.service.js';
import { sendSuccess } from '../../utils/response.js';

export const studentController = {
  async getAll(req, res, next) {
    try {
      const students = await studentService.getAllStudents();
      return sendSuccess(res, students);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return sendSuccess(res, student);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const newStudent = await studentService.createStudent(req.body);
      return sendSuccess(res, newStudent, 'Student profile created and saved to database successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await studentService.updateStudent(req.params.id, req.body);
      return sendSuccess(res, updated, 'Student updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await studentService.deleteStudent(req.params.id);
      return sendSuccess(res, null, 'Student deactivated and removed successfully');
    } catch (error) {
      next(error);
    }
  },

  async resetDevices(req, res, next) {
    try {
      await studentService.resetDevices(req.params.id);
      return sendSuccess(res, null, 'Student registered devices reset successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default studentController;
