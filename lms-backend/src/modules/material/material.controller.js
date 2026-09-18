// Material Controller
import { materialService } from './material.service.js';
import { sendSuccess } from '../../utils/response.js';

export const materialController = {
  async getByModule(req, res, next) {
    try {
      const materials = await materialService.getByModule(req.params.moduleId);
      return sendSuccess(res, materials);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const material = await materialService.create(req.body);
      return sendSuccess(res, material, 'Material added successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await materialService.remove(req.params.id);
      return sendSuccess(res, null, 'Material deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default materialController;
