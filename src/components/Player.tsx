import React, { useEffect, useState } from 'react';
import { Play, Pause, Eye, EyeOff } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';
import { usePlayer } from '../hooks/usePlayer';

interface PlayerProps {
  track: SpotifyTrack | null;
}

export const Player: React.FC<PlayerProps> = ({ track }) => {
  const { isPlaying, error, playTrack, togglePlayback } = usePlayer();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (track) {
      playTrack(track);
      setIsRevealed(false); // Hide info when new track starts
    }
  }, [track]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className={`relative ${!isRevealed ? 'filter blur-md' : ''} transition-all duration-300`}>
            <img
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="w-16 h-16 rounded"
            />
          </div>
          <div className={`ml-4 ${!isRevealed ? 'filter blur-md' : ''} transition-all duration-300`}>
            <h3 className="font-semibold">{track.name}</h3>
            <p className="text-sm text-gray-600">
              {track.artists.map(a => a.name).join(', ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {error ? (
            <div className="text-red-500 text-sm mr-4">{error}</div>
          ) : (
            <>
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label={isRevealed ? "Hide track info" : "Show track info"}
              >
                {isRevealed ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
              <button
                onClick={togglePlayback}
                className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};