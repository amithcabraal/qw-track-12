import { SpotifyPlaylist, SpotifyTrack } from '../types/spotify';

export const validatePlaylist = (playlist: Partial<SpotifyPlaylist>): playlist is SpotifyPlaylist => {
  return Boolean(
    playlist &&
    typeof playlist.id === 'string' &&
    (typeof playlist.name === 'string' || playlist.name === null) &&
    Array.isArray(playlist.images) &&
    typeof playlist.tracks === 'object' &&
    typeof playlist.tracks?.total === 'number'
  );
};

export const validateTrack = (track: Partial<SpotifyTrack> | null): track is SpotifyTrack => {
  if (!track) return false;
  
  return Boolean(
    typeof track.id === 'string' &&
    typeof track.name === 'string' &&
    Array.isArray(track.artists) &&
    track.artists.every(artist => typeof artist.name === 'string') &&
    typeof track.album === 'object' &&
    typeof track.album.name === 'string' &&
    Array.isArray(track.album.images) &&
    track.album.images.every(image => typeof image.url === 'string')
  );
};