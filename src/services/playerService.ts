import { SpotifyTrack } from '../types/spotify';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

class PlayerService {
  private player: any = null;
  private deviceId: string | null = null;
  private isReady = false;
  private token: string | null = null;
  private initializationPromise: Promise<void> | null = null;

  async initialize(token: string): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.token = token;
    this.initializationPromise = this.initializePlayer();
    return this.initializationPromise;
  }

  private async initializePlayer(): Promise<void> {
    if (!document.querySelector('[src="https://sdk.scdn.co/spotify-player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Spotify Web Playback SDK initialization timed out'));
      }, 15000);

      window.onSpotifyWebPlaybackSDKReady = () => {
        clearTimeout(timeout);
        this.player = new window.Spotify.Player({
          name: 'QW Track Player',
          getOAuthToken: (cb: (token: string) => void) => {
            cb(this.token!);
          },
          volume: 0.5
        });

        this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
          console.log('Player ready with device ID:', device_id);
          this.deviceId = device_id;
          this.isReady = true;
          resolve();
        });

        this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
          this.isReady = false;
        });

        this.player.addListener('initialization_error', ({ message }: { message: string }) => {
          console.error('Failed to initialize player:', message);
          reject(new Error(message));
        });

        this.player.addListener('authentication_error', ({ message }: { message: string }) => {
          console.error('Failed to authenticate:', message);
          reject(new Error(message));
        });

        this.player.addListener('account_error', ({ message }: { message: string }) => {
          console.error('Failed to validate Spotify account:', message);
          reject(new Error(message));
        });

        this.player.connect();
      };
    });
  }

  async playTrack(track: SpotifyTrack): Promise<void> {
    if (!this.isReady || !this.deviceId) {
      throw new Error('Player not ready');
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`]
        })
      });

      if (!response.ok && response.status !== 204) {
        const error = await response.json();
        throw new Error(error.error.message);
      }
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    }
  }

  async togglePlayback(): Promise<void> {
    if (!this.player) {
      throw new Error('Player not initialized');
    }
    await this.player.togglePlay();
  }

  async getCurrentState(): Promise<boolean> {
    if (!this.player) return false;
    const state = await this.player.getCurrentState();
    return state?.paused ?? false;
  }

  disconnect(): void {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.isReady = false;
      this.initializationPromise = null;
    }
  }

  isInitialized(): boolean {
    return this.isReady;
  }
}

export const playerService = new PlayerService();