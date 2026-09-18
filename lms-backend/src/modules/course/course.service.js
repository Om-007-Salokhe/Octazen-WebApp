// Course Module Service
import { prisma } from '../../config/db.js';

export const courseService = {
  async getAllCourses(filter = {}) {
    return prisma.course.findMany({
      where: filter,
      include: {
        modules: {
          include: {
            videos: true,
            materials: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getCourseById(id) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            videos: true,
            materials: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  },

  async createCourse(data) {
    return prisma.course.create({ data });
  },

  async updateCourse(id, data) {
    return prisma.course.update({
      where: { id },
      data,
    });
  },

  async deleteCourse(id) {
    return prisma.course.delete({
      where: { id },
    });
  },
};

export default courseService;
