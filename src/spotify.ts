import SpotifyWebApi from 'spotify-web-api-node';
import { Song } from './types';

export class SpotifyManager {
  private spotifyApi: SpotifyWebApi;
  private isAuthenticated: boolean = false;

  constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken?: string) {
    this.spotifyApi = new SpotifyWebApi({
      clientId,
      clientSecret,
      redirectUri
    });

    if (refreshToken) {
      this.spotifyApi.setRefreshToken(refreshToken);
    }
  }

  /**
   * Authenticate with Spotify using client credentials
   */
  async authenticate(): Promise<void> {
    try {
      // Try to use refresh token if available
      if (this.spotifyApi.getRefreshToken()) {
        const data = await this.spotifyApi.refreshAccessToken();
        this.spotifyApi.setAccessToken(data.body.access_token);
        this.isAuthenticated = true;
        console.log('Spotify authenticated using refresh token');
        return;
      }

      // Otherwise use client credentials flow
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body.access_token);
      this.isAuthenticated = true;
      console.log('Spotify authenticated using client credentials');

      // Refresh token before it expires
      setTimeout(() => {
        this.authenticate();
      }, (data.body.expires_in - 60) * 1000);
    } catch (error) {
      console.error('Failed to authenticate with Spotify:', error);
      throw error;
    }
  }

  /**
   * Extract Spotify track ID from a URL
   * Supports formats:
   * - https://open.spotify.com/track/TRACK_ID
   * - spotify:track:TRACK_ID
   */
  extractTrackId(url: string): string | null {
    // Match open.spotify.com URLs
    const urlMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Match spotify: URIs
    const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
    if (uriMatch) {
      return uriMatch[1];
    }

    return null;
  }

  /**
   * Get song information from a Spotify URL
   */
  async getSongFromUrl(url: string): Promise<Song | null> {
    if (!this.isAuthenticated) {
      throw new Error('Spotify is not authenticated');
    }

    const trackId = this.extractTrackId(url);
    if (!trackId) {
      return null;
    }

    try {
      const data = await this.spotifyApi.getTrack(trackId);
      const track = data.body;

      return {
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        url: url,
        duration: track.duration_ms
      };
    } catch (error) {
      console.error('Failed to fetch track from Spotify:', error);
      return null;
    }
  }

  /**
   * Check if authenticated
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
