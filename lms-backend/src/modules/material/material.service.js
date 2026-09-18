// Material Module Service
import { prisma } from '../../config/db.js';

export const materialService = {
  async getByModule(moduleId) {
    return prisma.material.findMany({
      where: { moduleId },
      orderBy: { orderIndex: 'asc' },
    });
  },

  async create(data) {
    return prisma.material.create({ data });
  },

  async remove(id) {
    return prisma.material.delete({ where: { id } });
  },
};

export default materialService;
