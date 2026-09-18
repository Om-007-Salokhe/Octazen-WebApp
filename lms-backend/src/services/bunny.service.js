// ALL Bunny.net API calls and CDN interactions live here
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const bunnyService = {
  /**
   * Uploads a video file or initializes a direct upload session in Bunny.net Stream
   */
  async createVideoSession(title, collectionId = null) {
    try {
      const libraryId = env.BUNNY_STREAM_LIBRARY_ID || '754518';
      const apiKey = env.BUNNY_STREAM_API_KEY || env.BUNNY_API_KEY;

      if (!libraryId || !apiKey) {
        logger.warn('[BunnyService] API Key or Library ID not set, returning mock video session ID');
        return {
          videoId: `mock-bunny-video-${Date.now()}`,
          libraryId: libraryId || '754518',
          uploadUrl: `https://video.bunnycdn.com/library/${libraryId || '754518'}/videos`,
          apiKey: '',
        };
      }

      const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
        method: 'POST',
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title: title || 'New Lecture Video',
          collectionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bunny.net create video failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        videoId: data.guid,
        libraryId: data.videoLibraryId || libraryId,
        directUploadUrl: `https://video.bunnycdn.com/library/${libraryId}/videos/${data.guid}`,
        apiKey,
      };
    } catch (error) {
      logger.error('[BunnyService.createVideoSession Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Directly upload video binary content/stream to Bunny.net
   */
  async uploadVideoStream(videoId, body) {
    try {
      const libraryId = env.BUNNY_STREAM_LIBRARY_ID || '754518';
      const apiKey = env.BUNNY_STREAM_API_KEY || env.BUNNY_API_KEY;

      const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/octet-stream',
        },
        body,
        duplex: 'half',
      });

      if (!response.ok) {
        throw new Error(`Failed to upload video to Bunny: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('[BunnyService.uploadVideoStream Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Fetch video details and encoding status from Bunny.net Stream
   */
  async getVideoDetails(videoId) {
    try {
      const libraryId = env.BUNNY_STREAM_LIBRARY_ID || '754518';
      const apiKey = env.BUNNY_STREAM_API_KEY || env.BUNNY_API_KEY;

      if (!libraryId || !apiKey) {
        return {
          guid: videoId,
          status: 4, // 4 = Finished
          length: 360,
          resolutions: ['1080p', '720p', '480p'],
          encodeProgress: 100,
        };
      }

      const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
        headers: {
          AccessKey: apiKey,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video details: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Status mapping:
      // 0 = Created, 1 = Uploaded, 2 = Processing, 3 = Transcoding, 4 = Finished, 5 = Error
      const statusMap = {
        0: 'Created',
        1: 'Uploaded',
        2: 'Processing',
        3: 'Transcoding',
        4: 'Ready',
        5: 'Failed',
      };

      return {
        ...data,
        statusText: statusMap[data.status] || 'Processing',
        isFinished: data.status === 4,
      };
    } catch (error) {
      logger.error('[BunnyService.getVideoDetails Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Delete a video from Bunny.net Stream
   */
  async deleteVideo(videoId) {
    try {
      const libraryId = env.BUNNY_STREAM_LIBRARY_ID || '754518';
      const apiKey = env.BUNNY_STREAM_API_KEY || env.BUNNY_API_KEY;

      if (!libraryId || !apiKey) {
        logger.info(`[BunnyService] Video deletion simulated for: ${videoId}`);
        return true;
      }

      const response = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          AccessKey: apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      logger.error('[BunnyService.deleteVideo Error]', { error: error.message });
      throw error;
    }
  },
};

export default bunnyService;

