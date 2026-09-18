// Video Controller - Manages video upload, status, and streaming
import { videoService } from './video.service.js';
import { sendSuccess } from '../../utils/response.js';

export const videoController = {
  async getStream(req, res, next) {
    try {
      const userIp = req.ip;
      const video = await videoService.getVideoById(req.params.id, userIp);
      if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found' });
      }
      return sendSuccess(res, video);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const videos = await videoService.listBunnyVideos();
      return sendSuccess(res, videos);
    } catch (error) {
      next(error);
    }
  },

  async listBunny(req, res, next) {
    try {
      const videos = await videoService.listBunnyVideos();
      return sendSuccess(res, videos);
    } catch (error) {
      next(error);
    }
  },

  async getByCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const videos = await videoService.getVideosByCourse(courseId);
      return sendSuccess(res, videos);
    } catch (error) {
      next(error);
    }
  },

  async initUpload(req, res, next) {
    try {
      const { title } = req.body;
      const session = await videoService.initBunnyUpload(title);
      return sendSuccess(res, session, 'Upload session initiated', 201);
    } catch (error) {
      next(error);
    }
  },

  async getStatus(req, res, next) {
    try {
      const { videoId } = req.params;
      const status = await videoService.getVideoStatus(videoId);
      return sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
  },

  async uploadStream(req, res, next) {
    try {
      const { videoId } = req.params;
      const result = await videoService.uploadVideoStream(videoId, req);
      return sendSuccess(res, result, 'Video stream uploaded successfully');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const video = await videoService.createVideo(req.body);
      return sendSuccess(res, video, 'Video recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await videoService.deleteVideo(req.params.id);
      return sendSuccess(res, null, 'Video removed successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default videoController;
