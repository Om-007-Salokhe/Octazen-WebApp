// Material Module Service
import { prisma } from '../../config/db.js';
import { supabaseService } from '../../services/supabase.service.js';

export const materialService = {
  async getByCourse(courseId) {
    try {
      return await supabaseService.getStudyMaterials(courseId);
    } catch (e) {
      return [];
    }
  },

  async getByModule(moduleId) {
    try {
      return await prisma.material.findMany({
        where: { moduleId },
        orderBy: { orderIndex: 'asc' },
      });
    } catch (e) {
      return [];
    }
  },

  async create(data) {
    try {
      return await supabaseService.createStudyMaterial(data);
    } catch (e) {
      try {
        return await prisma.material.create({ data });
      } catch (prismaErr) {
        return {
          id: Date.now(),
          ...data,
        };
      }
    }
  },

  async remove(id) {
    try {
      await supabaseService.deleteStudyMaterial(id);
    } catch (e) {
      try {
        await prisma.material.delete({ where: { id } });
      } catch (prismaErr) {}
    }
    return true;
  },
};

export default materialService;
