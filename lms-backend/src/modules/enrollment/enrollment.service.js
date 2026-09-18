// Enrollment Module Service
import { prisma } from '../../config/db.js';

export const enrollmentService = {
  async enrollStudent(studentId, courseId, expiresAt = null) {
    return prisma.enrollment.upsert({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      update: {
        status: 'ACTIVE',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      create: {
        studentId,
        courseId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        course: true,
        student: true,
      },
    });
  },

  async getStudentEnrollments(studentId) {
    return prisma.enrollment.findMany({
      where: { studentId, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            modules: {
              include: {
                videos: true,
                materials: true,
              },
            },
          },
        },
      },
    });
  },
};

export default enrollmentService;
