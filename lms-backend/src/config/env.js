// Reads and validates environment variables using Zod
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || 'https://cqmrbxkodgzhmnextnex.supabase.co/rest/v1/Student',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'dev_jwt_secret_key_aegis_academy_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || process.env.JWT_ACCESS_EXPIRY || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_default_change_in_prod',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || process.env.JWT_REFRESH_EXPIRY || '30d',
  
  // Bunny.net configuration
  BUNNY_STORAGE_ZONE_NAME: process.env.BUNNY_STORAGE_ZONE_NAME || '',
  BUNNY_API_KEY: process.env.BUNNY_API_KEY || process.env.BUNNY_STREAM_API_KEY || 'ba0a7b46-02f8-4712-bf62271f2b54-5861-4b98',
  BUNNY_STREAM_API_KEY: process.env.BUNNY_STREAM_API_KEY || process.env.BUNNY_API_KEY || 'ba0a7b46-02f8-4712-bf62271f2b54-5861-4b98',
  BUNNY_STORAGE_HOSTNAME: process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com',
  BUNNY_PULL_ZONE_URL: process.env.BUNNY_PULL_ZONE_URL || '',
  BUNNY_CDN_HOSTNAME: process.env.BUNNY_CDN_HOSTNAME || 'vz-b294700e-43d.b-cdn.net',
  BUNNY_TOKEN_AUTHENTICATION_KEY: process.env.BUNNY_TOKEN_AUTHENTICATION_KEY || process.env.BUNNY_TOKEN_SECURITY_KEY || 'f94a8812-a9f2-43e4-892c-8d279ada158a',
  BUNNY_STREAM_LIBRARY_ID: process.env.BUNNY_STREAM_LIBRARY_ID || '756353',

  // Client URL
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().optional().default('refresh_secret_key_default_change_in_prod'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // Bunny.net configuration
  BUNNY_STORAGE_ZONE_NAME: z.string().optional().default(''),
  BUNNY_API_KEY: z.string().optional().default('ba0a7b46-02f8-4712-bf62271f2b54-5861-4b98'),
  BUNNY_STREAM_API_KEY: z.string().optional().default('ba0a7b46-02f8-4712-bf62271f2b54-5861-4b98'),
  BUNNY_STORAGE_HOSTNAME: z.string().optional().default('storage.bunnycdn.com'),
  BUNNY_PULL_ZONE_URL: z.string().optional().default(''),
  BUNNY_CDN_HOSTNAME: z.string().optional().default('vz-b294700e-43d.b-cdn.net'),
  BUNNY_TOKEN_AUTHENTICATION_KEY: z.string().optional().default('f94a8812-a9f2-43e4-892c-8d279ada158a'),
  BUNNY_STREAM_LIBRARY_ID: z.string().optional().default('756353'),

  // Client URL
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(rawEnv);

export const env = parsed.success
  ? parsed.data
  : {
      ...rawEnv,
      PORT: parseInt(rawEnv.PORT, 10) || 5000,
    };

