import { SpotifyPlaylist, SpotifyTrack, SpotifyUser } from '../types/spotify';
import { getStoredAccessToken } from '../utils/auth';

const BASE_URL = 'https://api.spotify.com/v1';

const fetchSpotify = async (endpoint: string) => {
  const token = getStoredAccessToken();
  if (!token) throw new Error('No access token');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Spotify API');
  }

  return response.json();
};

export const getCurrentUser = (): Promise<SpotifyUser> => {
  return fetchSpotify('/me');
};

export const getUserPlaylists = (): Promise<{ items: SpotifyPlaylist[] }> => {
  return fetchSpotify('/me/playlists');
};

export const getPlaylistTracks = (playlistId: string): Promise<{ items: { track: SpotifyTrack }[] }> => {
  return fetchSpotify(`/playlists/${playlistId}/tracks`);
};