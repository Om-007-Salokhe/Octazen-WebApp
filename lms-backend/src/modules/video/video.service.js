// Video Module Service - Handles Bunny.net video management, upload, and DB sync
import { prisma } from '../../config/db.js';
import { bunnyService } from '../../services/bunny.service.js';
import { supabaseService } from '../../services/supabase.service.js';
import { signedUrlService } from '../../services/signedUrl.service.js';
import { logger } from '../../config/logger.js';

export const videoService = {
  async getVideoById(id, userIp = '') {
    try {
      const video = await prisma.video.findUnique({
        where: { id },
        include: { module: { include: { course: true } } },
      });

      if (!video) return null;

      const streamUrl = signedUrlService.generateSignedVideoUrl(video.bunnyVideoId, 14400, userIp);
      return {
        ...video,
        streamUrl,
      };
    } catch (e) {
      return null;
    }
  },

  async getVideosByCourse(courseId) {
    try {
      return await supabaseService.getVideos(courseId);
    } catch (error) {
      logger.error('[VideoService.getVideosByCourse Error]', { error: error.message });
      return [];
    }
  },

  async createVideo(data) {
    try {
      // Save to Supabase
      const saved = await supabaseService.createVideo(data);
      return saved;
    } catch (error) {
      logger.warn('[VideoService.createVideo Supabase failed, attempting Prisma]:', error.message);
      try {
        return await prisma.video.create({ data });
      } catch (prismaErr) {
        return {
          id: Date.now(),
          ...data,
          status: data.status || 'ready',
        };
      }
    }
  },

  async initBunnyUpload(title) {
    return bunnyService.createVideoSession(title);
  },

  async uploadVideoStream(videoId, stream) {
    return bunnyService.uploadVideoStream(videoId, stream);
  },

  async getVideoStatus(videoId) {
    return bunnyService.getVideoDetails(videoId);
  },

  async deleteVideo(id) {
    try {
      await supabaseService.deleteVideo(id);
      await bunnyService.deleteVideo(id);
    } catch (e) {
      logger.warn('[VideoService.deleteVideo Error]', { error: e.message });
    }
    return true;
  },
};

export default videoService;
