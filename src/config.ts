import * as fs from 'fs';
import * as path from 'path';
import { BotConfig } from './types';

/**
 * Load configuration from config.json or environment variables
 */
export function loadConfig(): BotConfig {
  // Try to load from config.json first
  const configPath = path.join(process.cwd(), 'config.json');

  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('Failed to parse config.json:', error);
    }
  }

  // Fallback to environment variables
  const config: BotConfig = {
    teamspeak: {
      host: process.env.TS3_HOST || 'localhost',
      queryport: process.env.TS3_QUERYPORT ? parseInt(process.env.TS3_QUERYPORT, 10) : undefined,
      serverport: process.env.TS3_SERVERPORT ? parseInt(process.env.TS3_SERVERPORT, 10) : undefined,
      nickname: process.env.TS3_NICKNAME || 'SpotifyBot',
      password: process.env.TS3_PASSWORD,
      channel: process.env.TS3_CHANNEL
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:8888/callback',
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN
    }
  };

  // Validate required fields
  if (!config.spotify.clientId || !config.spotify.clientSecret) {
    throw new Error('Spotify credentials are required. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET or create config.json');
  }

  return config;
}
