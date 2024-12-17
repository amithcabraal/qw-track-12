import React from 'react';
import { LogIn } from 'lucide-react';
import { getAuthUrl } from '../config/spotify';

export const LoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
    >
      <LogIn size={20} />
      Login with Spotify
    </button>
  );
};