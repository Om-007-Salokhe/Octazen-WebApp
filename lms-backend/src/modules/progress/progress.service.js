// Progress Module Service
import { prisma } from '../../config/db.js';

export const progressService = {
  async updateProgress(studentId, videoId, watchedSeconds, isCompleted) {
    return prisma.progress.upsert({
      where: {
        studentId_videoId: { studentId, videoId },
      },
      update: {
        watchedSeconds,
        isCompleted,
        lastWatchedAt: new Date(),
      },
      create: {
        studentId,
        videoId,
        watchedSeconds,
        isCompleted,
      },
    });
  },

  async getProgressByCourse(studentId, courseId) {
    return prisma.progress.findMany({
      where: {
        studentId,
        video: {
          module: {
            courseId,
          },
        },
      },
      include: {
        video: true,
      },
    });
  },
};

export default progressService;
