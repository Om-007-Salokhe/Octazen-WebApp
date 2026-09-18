// Payment Module Service (Track 3)
import { prisma } from '../../config/db.js';

export const paymentService = {
  async createOrder(studentId, courseId, amount, currency = 'INR') {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        currency,
        transactionId,
        status: 'PENDING',
        metadata: { courseId },
      },
    });

    return {
      orderId: payment.id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
    };
  },

  async verifyPayment(transactionId, paymentMethod = 'RAZORPAY') {
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      throw new Error('Payment record not found');
    }

    const updatedPayment = await prisma.payment.update({
      where: { transactionId },
      data: {
        status: 'COMPLETED',
        paymentMethod,
      },
    });

    // Automatically enroll student on payment success
    if (payment.metadata && payment.metadata.courseId) {
      await prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: payment.studentId,
            courseId: payment.metadata.courseId,
          },
        },
        update: { status: 'ACTIVE' },
        create: {
          studentId: payment.studentId,
          courseId: payment.metadata.courseId,
          status: 'ACTIVE',
        },
      });
    }

    return updatedPayment;
  },
};

export default paymentService;
