// Supabase Service - REST API Client for LMS Database Operations
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

// Extract the Supabase REST base endpoint
const getBaseUrl = () => {
  const dbUrl = env.DATABASE_URL || '';
  if (dbUrl.startsWith('http://') || dbUrl.startsWith('https://')) {
    // If DATABASE_URL is e.g. "https://cqmrbxkodgzhmnextnex.supabase.co/rest/v1/Student"
    // Extract base "https://cqmrbxkodgzhmnextnex.supabase.co/rest/v1"
    const match = dbUrl.match(/^(https?:\/\/[^\/]+\/rest\/v1)/);
    if (match) return match[1];
    return dbUrl.replace(/\/Student\/?$/, '');
  }
  return 'https://cqmrbxkodgzhmnextnex.supabase.co/rest/v1';
};

const getHeaders = () => {
  const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
  return {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

export const supabaseService = {
  /**
   * ==========================================
   * STUDENT OPERATIONS
   * ==========================================
   */

  /**
   * Fetch all students from Supabase
   */
  async getAllStudents() {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/Student?select=*&order=id.desc`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students from Supabase: ${response.status} ${response.statusText}`);
      }

      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      logger.error('[SupabaseService.getAllStudents Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Fetch a student by ID
   */
  async getStudentById(id) {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/Student?id=eq.${id}&select=*`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student by ID: ${response.statusText}`);
      }

      const rows = await response.json();
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.error('[SupabaseService.getStudentById Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Create a new student in Supabase
   */
  async createStudent(studentData) {
    try {
      const baseUrl = getBaseUrl();
      
      const payload = {
        full_name: studentData.full_name || studentData.fullName || studentData.name || '',
        mobile: studentData.mobile || studentData.phoneNumber || '',
        email: studentData.email || '',
        username: studentData.username || `@${(studentData.full_name || studentData.fullName || studentData.name || 'student').toLowerCase().replace(/\s+/g, '.')}`,
        password_hash: studentData.password_hash || studentData.passwordHash || 'default_hashed_pwd',
        device_id: studentData.device_id || studentData.deviceId || `dev_${Date.now()}`,
        device_name: studentData.device_name || studentData.deviceName || 'Primary Device',
        Is_verify: studentData.Is_verify !== undefined ? studentData.Is_verify : true,
      };

      const response = await fetch(`${baseUrl}/Student`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create student in Supabase: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      logger.error('[SupabaseService.createStudent Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Update student in Supabase
   */
  async updateStudent(id, studentData) {
    try {
      const baseUrl = getBaseUrl();
      const payload = {};

      if (studentData.full_name || studentData.fullName || studentData.name) {
        payload.full_name = studentData.full_name || studentData.fullName || studentData.name;
      }
      if (studentData.mobile || studentData.phoneNumber) {
        payload.mobile = studentData.mobile || studentData.phoneNumber;
      }
      if (studentData.email) payload.email = studentData.email;
      if (studentData.username) payload.username = studentData.username;
      if (studentData.Is_verify !== undefined) payload.Is_verify = studentData.Is_verify;
      if (studentData.device_name) payload.device_name = studentData.device_name;

      const response = await fetch(`${baseUrl}/Student?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update student in Supabase: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      logger.error('[SupabaseService.updateStudent Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Delete student from Supabase
   */
  async deleteStudent(id) {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/Student?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      logger.error('[SupabaseService.deleteStudent Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * ==========================================
   * VIDEO OPERATIONS
   * ==========================================
   */

  /**
   * Fetch videos for a course from Supabase
   */
  async getVideos(courseId = null) {
    try {
      const baseUrl = getBaseUrl();
      const query = courseId
        ? `${baseUrl}/videos?course_id=eq.${courseId}&select=*&order=display_order.asc`
        : `${baseUrl}/videos?select=*&order=id.desc`;

      const response = await fetch(query, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos from Supabase: ${response.statusText}`);
      }

      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      logger.error('[SupabaseService.getVideos Error]', { error: error.message });
      return [];
    }
  },

  /**
   * Create video record in Supabase
   */
  async createVideo(videoData) {
    try {
      const baseUrl = getBaseUrl();
      const payload = {
        course_id: videoData.course_id || videoData.courseId || 7, // fallback to course 7
        title: videoData.title || 'Untitled Lecture',
        description: videoData.description || '',
        bunny_video_id: videoData.bunny_video_id || videoData.bunnyVideoId || '',
        bunny_library_id: String(videoData.bunny_library_id || videoData.bunnyLibraryId || env.BUNNY_STREAM_LIBRARY_ID || '754518'),
        duration_seconds: parseInt(videoData.duration_seconds || videoData.durationSeconds || 0, 10),
        thumbnail_url: videoData.thumbnail_url || videoData.thumbnailUrl || '',
        display_order: parseInt(videoData.display_order || videoData.displayOrder || 1, 10),
        status: videoData.status || 'processing',
        is_active: videoData.is_active !== undefined ? videoData.is_active : true,
      };

      const response = await fetch(`${baseUrl}/videos`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to insert video into Supabase: ${response.statusText} - ${errText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      logger.error('[SupabaseService.createVideo Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Update video record in Supabase
   */
  async updateVideo(id, videoData) {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/videos?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update video: ${response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      logger.error('[SupabaseService.updateVideo Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Delete video record from Supabase
   */
  async deleteVideo(id) {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/videos?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      return response.ok;
    } catch (error) {
      logger.error('[SupabaseService.deleteVideo Error]', { error: error.message });
      return false;
    }
  },

  /**
   * ==========================================
   * STUDY MATERIAL OPERATIONS
   * ==========================================
   */

  /**
   * Fetch study materials for a course from Supabase
   */
  async getStudyMaterials(courseId = null) {
    try {
      const baseUrl = getBaseUrl();
      const query = courseId
        ? `${baseUrl}/study_materials?course_id=eq.${courseId}&select=*&order=display_order.asc`
        : `${baseUrl}/study_materials?select=*&order=id.desc`;

      const response = await fetch(query, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch study materials from Supabase: ${response.statusText}`);
      }

      const rows = await response.json();
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      logger.error('[SupabaseService.getStudyMaterials Error]', { error: error.message });
      return [];
    }
  },

  /**
   * Create study material record in Supabase
   */
  async createStudyMaterial(materialData) {
    try {
      const baseUrl = getBaseUrl();
      const payload = {
        course_id: parseInt(materialData.course_id || materialData.courseId || 10, 10),
        title: materialData.title || 'Course Lecture Notes',
        file_path: materialData.file_path || materialData.filePath || materialData.url || '/uploads/materials/notes.pdf',
        file_type: materialData.file_type || materialData.fileType || 'pdf',
        file_size_kb: parseInt(materialData.file_size_kb || materialData.fileSizeKb || 1024, 10),
        display_order: parseInt(materialData.display_order || materialData.displayOrder || 1, 10),
      };

      const response = await fetch(`${baseUrl}/study_materials`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to insert study material into Supabase: ${response.statusText} - ${errText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      logger.error('[SupabaseService.createStudyMaterial Error]', { error: error.message });
      throw error;
    }
  },

  /**
   * Delete study material from Supabase
   */
  async deleteStudyMaterial(id) {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/study_materials?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      return response.ok;
    } catch (error) {
      logger.error('[SupabaseService.deleteStudyMaterial Error]', { error: error.message });
      return false;
    }
  },
};

export default supabaseService;
