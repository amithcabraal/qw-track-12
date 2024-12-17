import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { PlaylistSelector } from '../components/PlaylistSelector';
import { GamePlayer } from '../components/GamePlayer';
import { Header } from '../components/Header';
import { SpotifyPlaylist, SpotifyTrack, SpotifyUser } from '../types/spotify';

interface HomeProps {
  user: SpotifyUser | null;
  playlists: SpotifyPlaylist[];
  currentTrack: SpotifyTrack | null;
  error: string | null;
  onPlaylistSelect: (playlist: SpotifyPlaylist) => void;
  onPlayAgain: () => void;
}

export const Home: React.FC<HomeProps> = ({
  user,
  playlists,
  currentTrack,
  error,
  onPlaylistSelect,
  onPlayAgain,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gameScore, setGameScore] = useState<number | null>(null);

  const handleGameComplete = (score: number) => {
    setGameScore(score);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      
      <main className="pt-16">
        {!currentTrack ? (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            <PlaylistSelector playlists={playlists} onSelect={onPlaylistSelect} />
          </div>
        ) : (
          <GamePlayer 
            track={currentTrack} 
            onGameComplete={handleGameComplete}
            onPlayAgain={onPlayAgain}
          />
        )}
      </main>
    </div>
  );
};