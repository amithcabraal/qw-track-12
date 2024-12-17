import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">QW Track</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
}