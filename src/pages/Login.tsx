import React from 'react';
import { LoginButton } from '../components/LoginButton';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Spotify Random Track Player</h1>
      <LoginButton />
    </div>
  );
};