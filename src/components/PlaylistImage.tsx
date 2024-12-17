import React from 'react';
import { Music } from 'lucide-react';
import { SpotifyPlaylist } from '../types/spotify';

interface PlaylistImageProps {
  playlist: SpotifyPlaylist;
  size?: 'sm' | 'md' | 'lg';
}

export const PlaylistImage: React.FC<PlaylistImageProps> = ({ playlist, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const imageUrl = playlist.images?.[0]?.url;
  const sizeClass = sizeClasses[size];

  if (!imageUrl) {
    return (
      <div className={`${sizeClass} bg-gray-200 rounded flex items-center justify-center`}>
        <Music size={size === 'sm' ? 20 : 24} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={playlist.name}
      className={`${sizeClass} rounded object-cover`}
    />
  );
};