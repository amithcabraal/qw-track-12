import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Callback } from './pages/Callback';
import { getStoredAccessToken } from './utils/auth';
import { getCurrentUser, getUserPlaylists, getPlaylistTracks } from './services/spotifyApi';
import { SpotifyPlaylist, SpotifyTrack, SpotifyUser } from './types/spotify';
import { validatePlaylist, validateTrack } from './utils/validators';

function App() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [playedTracks, setPlayedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = getStoredAccessToken();
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(err => {
          console.error('Failed to fetch user:', err);
          setError('Failed to load user profile');
        });

      getUserPlaylists()
        .then(data => {
          const validPlaylists = data.items
            .filter(validatePlaylist)
            .map(playlist => ({
              ...playlist,
              name: playlist.name || 'Untitled Playlist',
              images: playlist.images || [],
              tracks: { total: playlist.tracks?.total ?? 0 }
            }));
          setPlaylists(validPlaylists);
        })
        .catch(err => {
          console.error('Failed to fetch playlists:', err);
          setError('Failed to load playlists');
        });
    }
  }, []);

  const selectRandomTrack = (tracks: SpotifyTrack[]): SpotifyTrack | null => {
    const availableTracks = tracks.filter(track => !playedTracks.has(track.id));
    if (availableTracks.length === 0) return null;
    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
  };

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    try {
      setError(null);
      setCurrentPlaylist(playlist);
      
      if (playlist.tracks.total === 0) {
        setError('This playlist is empty');
        setCurrentTrack(null);
        return;
      }

      const response = await getPlaylistTracks(playlist.id);
      const validTracks = response.items
        .map(item => item.track)
        .filter(validateTrack);

      if (validTracks.length === 0) {
        setError('No playable tracks found in this playlist');
        setCurrentTrack(null);
        return;
      }

      const track = selectRandomTrack(validTracks);
      if (!track) {
        setError('You have played all tracks in this playlist!');
        setCurrentTrack(null);
        return;
      }

      setPlayedTracks(prev => new Set([...prev, track.id]));
      setCurrentTrack(track);
    } catch (err) {
      console.error('Failed to get playlist tracks:', err);
      setError('Failed to load tracks from this playlist');
      setCurrentTrack(null);
    }
  };

  const handlePlayAgain = async () => {
    if (currentPlaylist) {
      await handlePlaylistSelect(currentPlaylist);
    }
  };

  const isAuthenticated = Boolean(getStoredAccessToken());

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home
                  user={user}
                  playlists={playlists}
                  currentTrack={currentTrack}
                  error={error}
                  onPlaylistSelect={handlePlaylistSelect}
                  onPlayAgain={handlePlayAgain}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;