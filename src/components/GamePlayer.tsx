import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Check, X, RotateCw, Loader } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';
import { usePlayer } from '../hooks/usePlayer';
import { calculateSimilarity } from '../utils/similarity';

interface GamePlayerProps {
  track: SpotifyTrack;
  onGameComplete: (score: number) => void;
  onPlayAgain: () => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ track, onGameComplete, onPlayAgain }) => {
  const { isPlaying, error, isInitialized, playTrack, togglePlayback } = usePlayer();
  const [timer, setTimer] = useState(0);
  const [isGuessing, setIsGuessing] = useState(false);
  const [titleGuess, setTitleGuess] = useState('');
  const [artistGuess, setArtistGuess] = useState('');
  const [result, setResult] = useState<{ score: number; isCorrect: boolean } | null>(null);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isInitialized) {
      playTrack(track);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [track, isInitialized]);

  useEffect(() => {
    if (isPlaying && !isGuessing && !result) {
      intervalRef.current = window.setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isGuessing, result]);

  const handlePauseAndGuess = async () => {
    await togglePlayback();
    setIsGuessing(true);
  };

  const calculateScore = () => {
    const titleSimilarity = calculateSimilarity(titleGuess, track.name);
    const artistSimilarity = calculateSimilarity(artistGuess, track.artists[0].name);
    const averageSimilarity = (titleSimilarity + artistSimilarity) / 2;
    const timeBonus = Math.max(0, 1 - (timer / 30)); // Bonus for guessing quickly
    const score = Math.round((averageSimilarity * 80 + timeBonus * 20) * 100);
    return {
      score,
      isCorrect: titleSimilarity > 0.8 && artistSimilarity > 0.8
    };
  };

  const handleSubmitGuess = () => {
    const result = calculateScore();
    setResult(result);
    onGameComplete(result.score);
  };

  const handlePlayAgain = () => {
    // Reset all state before calling onPlayAgain
    setTimer(0);
    setIsGuessing(false);
    setTitleGuess('');
    setArtistGuess('');
    setResult(null);
    onPlayAgain();
  };

  const formatTime = (time: number) => {
    return time.toFixed(1);
  };

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gray-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mb-4 mx-auto text-green-500" />
          <p className="text-gray-600">Initializing player...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fixed inset-0 bg-gray-100 pt-16">
        <div className="max-w-2xl mx-auto p-4 h-full flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
            <div className="mb-6">
              {result.isCorrect ? (
                <Check className="w-16 h-16 mx-auto text-green-500" />
              ) : (
                <X className="w-16 h-16 mx-auto text-red-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {result.isCorrect ? 'Correct!' : 'Nice Try!'}
            </h2>
            <p className="text-4xl font-bold text-green-500 mb-6">{result.score} points</p>
            <div className="mb-6">
              <p className="text-gray-600">Correct Answer:</p>
              <p className="font-bold text-lg">{track.name}</p>
              <p className="text-gray-600 mt-2">by</p>
              <p className="font-bold">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <img 
              src={track.album.images[0]?.url} 
              alt={track.album.name}
              className="w-48 h-48 mx-auto rounded-lg shadow-md mb-6"
            />
            <button
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <RotateCw size={20} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 pt-16">
      <div className="max-w-2xl mx-auto p-4 h-full flex flex-col">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          {isGuessing ? (
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-green-500">{formatTime(timer)}s</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Song Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={titleGuess}
                    onChange={(e) => setTitleGuess(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter song title..."
                  />
                </div>
                <div>
                  <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
                    Artist
                  </label>
                  <input
                    type="text"
                    id="artist"
                    value={artistGuess}
                    onChange={(e) => setArtistGuess(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter artist name..."
                  />
                </div>
                <button
                  onClick={handleSubmitGuess}
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Submit Guess
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-8">
                {formatTime(timer)}s
              </div>
              <button
                onClick={handlePauseAndGuess}
                className="bg-green-500 text-white p-6 rounded-full hover:bg-green-600 transition-colors"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};