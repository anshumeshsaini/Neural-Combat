
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Timer } from 'lucide-react';

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
    <div className="flex flex-wrap gap-3 mt-4 justify-center">
      <Button
        variant="outline"
        onClick={onToggleCamera}
        disabled={isPlaying}
        className="bg-game-accent/20 text-white hover:bg-game-accent/30 border-game-accent btn-primary-glow"
      >
        {isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
      </Button>

      {isCameraActive && isModelLoaded && !isPlaying && (
        <Button
          onClick={onStartGame}
          className="bg-game-accent text-white hover:bg-game-accent/80 btn-primary-glow"
        >
          <Play className="mr-2 h-4 w-4" /> Play Game
        </Button>
      )}

      {isPlaying && (
        <Button
          onClick={onStopGame}
          variant="destructive"
          className="btn-primary-glow"
        >
          <Square className="mr-2 h-4 w-4" /> Stop Game
        </Button>
      )}

      {isCameraActive && !isModelLoaded && (
        <Button disabled className="bg-game-accent/50 text-white">
          <Timer className="mr-2 h-4 w-4 animate-spin" /> Loading Model...
        </Button>
      )}
    </div>
  );
};

export default GameControls;
