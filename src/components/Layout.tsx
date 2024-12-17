import React from 'react';
import { SpotifyUser } from '../types/spotify';

interface LayoutProps {
  user: SpotifyUser | null;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <header className="bg-white shadow p-4">
          <div className="max-w-4xl mx-auto flex items-center">
            {user.images[0] && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <span className="ml-3 font-semibold">{user.display_name}</span>
          </div>
        </header>
      )}
      {children}
    </div>
  );
};