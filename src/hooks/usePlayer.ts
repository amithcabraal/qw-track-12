import { useState, useEffect, useCallback } from 'react';
import { SpotifyTrack } from '../types/spotify';
import { playerService } from '../services/playerService';
import { getStoredAccessToken } from '../utils/auth';

export const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError('No access token available');
      return;
    }

    let mounted = true;

    const initializePlayer = async () => {
      try {
        await playerService.initialize(token);
        if (mounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to initialize player: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      playerService.disconnect();
    };
  }, []);

  const playTrack = useCallback(async (track: SpotifyTrack) => {
    if (!isInitialized) {
      setError('Player not ready. Please wait...');
      return;
    }

    try {
      setError(null);
      await playerService.playTrack(track);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play track: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setIsPlaying(false);
    }
  }, [isInitialized]);

  const togglePlayback = useCallback(async () => {
    if (!isInitialized) {
      setError('Player not ready. Please wait...');
      return;
    }

    try {
      await playerService.togglePlayback();
      const isPaused = await playerService.getCurrentState();
      setIsPlaying(!isPaused);
    } catch (err) {
      setError('Failed to toggle playback: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, [isInitialized]);

  return { 
    isPlaying, 
    error, 
    isInitialized,
    playTrack, 
    togglePlayback 
  };
};