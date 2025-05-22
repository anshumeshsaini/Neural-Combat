
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Timer, Camera, CameraOff } from 'lucide-react';

interface GameControlsProps {
  isCameraActive: boolean;
  isModelLoaded: boolean;
  isPlaying: boolean;
  onToggleCamera: () => void;
  onStartGame: () => void;
  onStopGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isCameraActive,
  isModelLoaded,
  isPlaying,
  onToggleCamera,
  onStartGame,
  onStopGame
}) => {
  return (
    <div className="flex flex-wrap gap-4 mt-6 justify-center">
      <Button
        variant="outline"
        onClick={onToggleCamera}
        disabled={isPlaying}
        className="relative bg-game-accent/10 text-white hover:bg-game-accent/20 border-game-accent/50 btn-primary-glow py-6 px-6 min-w-[180px] overflow-hidden group"
      >
        <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-accent/50 to-game-highlight/50"></span>
        <span className="absolute -z-10 inset-0 bg-gradient-to-br from-game-accent/5 to-game-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <span className="mr-2">
          {isCameraActive ? (
            <CameraOff className="h-5 w-5 text-game-highlight animate-pulse" />
          ) : (
            <Camera className="h-5 w-5 text-game-accent" />
          )}
        </span>
        <span className="relative">
          {isCameraActive ? 'Deactivate Scanner' : 'Activate Scanner'}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-game-highlight group-hover:w-full transition-all duration-300"></span>
        </span>
      </Button>

      {isCameraActive && isModelLoaded && !isPlaying && (
        <Button
          onClick={onStartGame}
          className="bg-gradient-to-r from-game-accent to-game-highlight text-white hover:from-game-accent/90 hover:to-game-highlight/90 btn-primary-glow py-6 px-6 min-w-[180px] relative group"
        >
          <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></span>
          <span className="relative flex items-center">
            <Play className="mr-2 h-5 w-5" />
            <span className="relative overflow-hidden">
              Initiate Match
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </span>
          </span>
        </Button>
      )}

      {isPlaying && (
        <Button
          onClick={onStopGame}
          variant="destructive"
          className="btn-primary-glow py-6 px-6 min-w-[180px] bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 relative group"
        >
          <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></span>
          <span className="relative flex items-center">
            <Square className="mr-2 h-5 w-5" />
            <span>Terminate Match</span>
          </span>
        </Button>
      )}

      {isCameraActive && !isModelLoaded && (
        <Button disabled className="bg-game-accent/30 text-white py-6 px-6 min-w-[180px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="cyber-spinner"></div>
          </div>
          <span className="relative flex items-center opacity-80">
            <Timer className="mr-2 h-5 w-5" />
            <span>Initializing System...</span>
          </span>
        </Button>
      )}
    </div>
  );
};

export default GameControls;
