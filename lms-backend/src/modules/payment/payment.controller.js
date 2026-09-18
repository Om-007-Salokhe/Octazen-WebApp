// Payment Controller (Track 3)
import { paymentService } from './payment.service.js';
import { sendSuccess } from '../../utils/response.js';

export const paymentController = {
  async createOrder(req, res, next) {
    try {
      const studentId = req.student.id;
      const { courseId, amount, currency } = req.body;
      const order = await paymentService.createOrder(studentId, courseId, amount, currency);
      return sendSuccess(res, order, 'Payment order created', 201);
    } catch (error) {
      next(error);
    }
  },

  async verify(req, res, next) {
    try {
      const { transactionId, paymentMethod } = req.body;
      const result = await paymentService.verifyPayment(transactionId, paymentMethod);
      return sendSuccess(res, result, 'Payment verified and access granted');
    } catch (error) {
      next(error);
    }
  },
};

export default paymentController;
