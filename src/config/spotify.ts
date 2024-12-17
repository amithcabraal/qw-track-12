import { isProduction } from '../utils/environment';

interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

const PROD_REDIRECT_URI = 'https://qw-track.netlify.app/callback';
const DEV_REDIRECT_URI = 'http://localhost:5173/callback';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = isProduction() ? PROD_REDIRECT_URI : DEV_REDIRECT_URI;

if (!clientId) {
  throw new Error('Missing required Spotify client ID');
}

export const spotifyConfig: SpotifyConfig = {
  clientId: clientId || '',
  redirectUri,
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'streaming',
    'user-modify-playback-state',
    'user-read-playback-state'
  ]
};

export const getAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    redirect_uri: spotifyConfig.redirectUri,
    scope: spotifyConfig.scopes.join(' '),
    response_type: 'token',
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};