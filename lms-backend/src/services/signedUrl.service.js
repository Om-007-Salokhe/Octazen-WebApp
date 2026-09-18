// Generates tokenized and time-limited signed URLs for secure video streaming via Bunny.net CDN
import crypto from 'crypto';
import { env } from '../config/env.js';

export const signedUrlService = {
  /**
   * Generates secure signed URL for video playback
   * @param {string} videoId - Bunny video GUID
   * @param {number} expiresInSeconds - Token validity in seconds (default 4 hours)
   * @param {string} userIp - Optional user IP to lock playback to a specific IP
   */
  generateSignedVideoUrl(videoId, expiresInSeconds = 14400, userIp = '') {
    const securityKey = env.BUNNY_TOKEN_AUTHENTICATION_KEY;
    const pullZoneUrl = env.BUNNY_PULL_ZONE_URL || 'https://lms-stream.b-cdn.net';
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const path = `/${videoId}/playlist.m3u8`;

    if (!securityKey) {
      // Fallback in local development without security key configured
      return `${pullZoneUrl}${path}?token=dev_token&expires=${expires}`;
    }

    // Bunny.net SHA-256 token signing algorithm: SHA256(securityKey + path + expires + userIp)
    const hashableBase = `${securityKey}${path}${expires}${userIp}`;
    const hash = crypto.createHash('sha256').update(hashableBase).digest('base64');
    const token = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${pullZoneUrl}${path}?token=${token}&expires=${expires}`;
  },

  /**
   * Generates signed URL for downloadable materials/PDFs
   */
  generateSignedMaterialUrl(filePath, expiresInSeconds = 3600) {
    const securityKey = env.BUNNY_TOKEN_AUTHENTICATION_KEY;
    const pullZoneUrl = env.BUNNY_PULL_ZONE_URL || 'https://lms-stream.b-cdn.net';
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;

    if (!securityKey) {
      return `${pullZoneUrl}/${filePath}?token=dev_token&expires=${expires}`;
    }

    const hashableBase = `${securityKey}/${filePath}${expires}`;
    const hash = crypto.createHash('sha256').update(hashableBase).digest('base64');
    const token = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${pullZoneUrl}/${filePath}?token=${token}&expires=${expires}`;
  },
};

export default signedUrlService;
