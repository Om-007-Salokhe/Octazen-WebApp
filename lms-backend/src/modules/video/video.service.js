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
      const [dbVideos, bunnyVideos] = await Promise.all([
        supabaseService.getVideos(courseId),
        bunnyService.listVideos(),
      ]);

      const bunnyMap = new Map();
      bunnyVideos.forEach((bv) => {
        bunnyMap.set(bv.guid || bv.bunny_video_id, bv);
      });

      const defaultLibraryId = env.BUNNY_STREAM_LIBRARY_ID || '756353';
      const defaultCdnHost = env.BUNNY_CDN_HOSTNAME || 'vz-b294700e-43d.b-cdn.net';

      // Format db videos
      const formattedDb = (dbVideos || []).map((v) => {
        const bunnyInfo = bunnyMap.get(v.bunny_video_id);
        const durationSec = v.duration_seconds || bunnyInfo?.duration_seconds || 0;
        const mins = Math.floor(durationSec / 60);
        const secs = durationSec % 60;
        const durationFormatted = durationSec > 0 ? `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : '00:30';
        const libId = v.bunny_library_id || defaultLibraryId;
        const thumb = v.thumbnail_url || bunnyInfo?.thumbnail_url || `https://${defaultCdnHost}/${v.bunny_video_id}/thumbnail.jpg`;

        return {
          id: String(v.id),
          dbId: v.id,
          courseId: v.course_id,
          title: v.title,
          description: v.description || '',
          bunny_video_id: v.bunny_video_id,
          bunny_library_id: String(libId),
          duration_seconds: durationSec,
          duration: durationFormatted,
          status: v.status === 'ready' ? 'Ready' : (v.status === 'failed' ? 'Failed' : 'Processing'),
          thumbnail_url: thumb,
          thumbnail: thumb,
          embedUrl: `https://iframe.mediadelivery.net/embed/${libId}/${v.bunny_video_id}?autoplay=true&preload=true`,
        };
      });

      // If DB has videos for this course, return them
      if (formattedDb.length > 0) {
        return formattedDb;
      }

      // If DB has no specific videos mapped for this course yet, return all active Bunny library videos
      return bunnyVideos;
    } catch (error) {
      logger.error('[VideoService.getVideosByCourse Error]', { error: error.message });
      try {
        return await bunnyService.listVideos();
      } catch (e) {
        return [];
      }
    }
  },

  async listBunnyVideos() {
    return bunnyService.listVideos();
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
