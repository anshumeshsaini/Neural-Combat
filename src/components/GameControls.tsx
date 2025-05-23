import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Timer, Camera, CameraOff, Settings, Activity, Zap, User, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameControlsProps {
  isCameraActive: boolean;
  isModelLoaded: boolean;
  isPlaying: boolean;
  playerChoice: string | null;
  aiChoice: string | null;
  result: string | null;
  performanceMetrics?: {
    fps: number;
    latency: number;
    accuracy: number;
  };
  onToggleCamera: () => void;
  onStartGame: () => void;
  onStopGame: () => void;
  onSettingsOpen?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isCameraActive,
  isModelLoaded,
  isPlaying,
  playerChoice,
  aiChoice,
  result,
  performanceMetrics,
  onToggleCamera,
  onStartGame,
  onStopGame,
  onSettingsOpen
}) => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  
  const handleToggleMic = () => {
    setIsMicActive(!isMicActive);
  };

  const getResultColor = () => {
    if (!result) return 'text-game-accent';
    if (result.includes('win')) return 'text-green-400';
    if (result.includes('lose')) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="relative">
      {/* Game Results Display */}
      {playerChoice && aiChoice && result && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-game-highlight mb-2">Round Result</h2>
            
            <div className="flex items-center justify-center space-x-8 mb-6">
              {/* Player Choice */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-lg text-game-accent mb-2">Your Choice</div>
                <div className="text-6xl bg-game-panel/50 p-6 rounded-full border-2 border-game-accent">
                  {playerChoice}
                </div>
              </motion.div>

              {/* VS */}
              <div className="text-xl font-bold text-game-border self-center">VS</div>

              {/* AI Choice */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="text-lg text-game-highlight mb-2">AI Choice</div>
                <div className="text-6xl bg-game-panel/50 p-6 rounded-full border-2 border-game-highlight">
                  {aiChoice}
                </div>
              </motion.div>
            </div>

            {/* Result Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-xl font-bold ${getResultColor()} mb-8`}
            >
              {result}
            </motion.div>
          </div>

          {/* Rematch Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStartGame}
              className="bg-gradient-to-r from-game-accent to-game-highlight text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg"
            >
              Rematch
            </Button>
          </motion.div>
        </div>
      )}

      {/* Performance metrics panel */}
      <AnimatePresence>
        {showPerformance && performanceMetrics && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute -top-24 left-0 right-0 bg-game-panel/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-game-border/50 z-10"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-game-highlight text-sm font-mono">FPS</div>
                <div className="text-2xl font-bold text-white">
                  {performanceMetrics.fps}
                  <span className="text-xs text-game-accent ml-1">/60</span>
                </div>
                <div className="h-1 bg-game-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-game-highlight" 
                    style={{ width: `${Math.min(100, performanceMetrics.fps / 60 * 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-game-highlight text-sm font-mono">LATENCY</div>
                <div className="text-2xl font-bold text-white">
                  {performanceMetrics.latency}
                  <span className="text-xs text-game-accent ml-1">ms</span>
                </div>
                <div className="h-1 bg-game-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-game-accent" 
                    style={{ width: `${Math.min(100, 100 - performanceMetrics.latency / 30)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-game-highlight text-sm font-mono">ACCURACY</div>
                <div className="text-2xl font-bold text-white">
                  {performanceMetrics.accuracy}
                  <span className="text-xs text-game-accent ml-1">%</span>
                </div>
                <div className="h-1 bg-game-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-game-accent to-game-highlight" 
                    style={{ width: `${performanceMetrics.accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center relative z-20">
        {/* Settings button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={onSettingsOpen}
            className="relative bg-game-panel/50 text-game-highlight hover:bg-game-panel/80 border border-game-border/30 rounded-full p-3 h-12 w-12 group transition-all duration-300"
          >
            <Settings className="h-5 w-5" />
            <span className="absolute inset-0 rounded-full border-2 border-game-highlight/0 group-hover:border-game-highlight/30 transition-all duration-300" />
          </Button>
        </motion.div>

        {/* Performance toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={() => setShowPerformance(!showPerformance)}
            className={`relative bg-game-panel/50 ${showPerformance ? 'text-game-highlight' : 'text-game-accent'} hover:bg-game-panel/80 border border-game-border/30 rounded-full p-3 h-12 w-12 group transition-all duration-300`}
          >
            <Activity className="h-5 w-5" />
            <span className="absolute inset-0 rounded-full border-2 border-game-highlight/0 group-hover:border-game-highlight/30 transition-all duration-300" />
          </Button>
        </motion.div>

        {/* Mic toggle */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            onClick={handleToggleMic}
            className={`relative bg-game-panel/50 ${isMicActive ? 'text-game-highlight' : 'text-game-accent'} hover:bg-game-panel/80 border border-game-border/30 rounded-full p-3 h-12 w-12 group transition-all duration-300`}
          >
            {isMicActive ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
            <span className="absolute inset-0 rounded-full border-2 border-game-highlight/0 group-hover:border-game-highlight/30 transition-all duration-300" />
          </Button>
        </motion.div>

        {/* Camera control */}
        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            variant="outline"
            onClick={onToggleCamera}
            disabled={isPlaying}
            className="relative bg-game-accent/10 text-white hover:bg-game-accent/20 border-game-accent/50 btn-primary-glow py-6 px-8 min-w-[200px] overflow-hidden group transition-all duration-300"
          >
            <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-accent/50 to-game-highlight/50"></span>
            <span className="absolute -z-10 inset-0 bg-gradient-to-br from-game-accent/5 to-game-highlight/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
            <span className="absolute -z-20 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <span className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-game-highlight/30 animate-ping"></span>
              <span className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-game-accent/30 animate-ping"></span>
              <span className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-game-highlight/30 animate-ping"></span>
            </span>
            <span className="mr-3">
              {isCameraActive ? (
                <CameraOff className="h-6 w-6 text-game-highlight animate-pulse" />
              ) : (
                <Camera className="h-6 w-6 text-game-accent group-hover:text-game-highlight transition-colors" />
              )}
            </span>
            <span className="relative font-medium tracking-wide">
              {isCameraActive ? 'Deactivate Scanner' : 'Activate Scanner'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-game-highlight group-hover:w-full transition-all duration-500"></span>
            </span>
          </Button>
        </motion.div>

        {/* Start game button */}
        {isCameraActive && isModelLoaded && !isPlaying && !playerChoice && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={onStartGame}
              className="bg-gradient-to-r from-game-accent to-game-highlight text-white hover:from-game-accent/90 hover:to-game-highlight/90 btn-primary-glow py-6 px-8 min-w-[200px] relative group overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
              <span className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white animate-ping"></span>
              </span>
              <span className="relative flex items-center">
                <Play className="mr-3 h-6 w-6" />
                <span className="relative overflow-hidden font-medium tracking-wide">
                  Start Match
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500"></span>
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30 group-hover:bg-white/50 transition-all duration-500"></span>
            </Button>
          </motion.div>
        )}

        {/* Stop game button */}
        {isPlaying && !playerChoice && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={onStopGame}
              variant="destructive"
              className="btn-primary-glow py-6 px-8 min-w-[200px] bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 relative group overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></span>
              <span className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white animate-ping"></span>
              </span>
              <span className="relative flex items-center">
                <Square className="mr-3 h-6 w-6" />
                <span className="font-medium tracking-wide">Stop Match</span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30 group-hover:bg-white/50 transition-all duration-500"></span>
            </Button>
          </motion.div>
        )}

        {/* Loading state */}
        {isCameraActive && !isModelLoaded && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button 
              disabled 
              className="bg-game-panel/80 text-white py-6 px-8 min-w-[200px] relative overflow-hidden border border-game-border/50"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="cyber-spinner"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-game-highlight/10 to-transparent animate-[sweep_2s_linear_infinite]"></div>
              </div>
              <span className="relative flex items-center opacity-90">
                <Timer className="mr-3 h-6 w-6 animate-pulse" />
                <span className="font-medium tracking-wide">Initializing System...</span>
              </span>
              <span className="absolute inset-x-1/4 bottom-0 h-0.5 bg-game-highlight/30 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-6 flex justify-between items-center text-xs text-game-accent/80">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isModelLoaded ? 'bg-game-highlight animate-pulse' : 'bg-game-border'}`} />
          <span>AI Model: {isModelLoaded ? 'Active' : 'Loading'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3" />
            <span>Performance: {performanceMetrics ? `${performanceMetrics.fps}fps` : '--'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>Voice: {isMicActive ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      {!isCameraActive && !playerChoice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-game-panel/50 p-6 rounded-xl border border-game-border/30 max-w-md mx-auto"
        >
          <h3 className="text-lg font-bold text-game-highlight mb-3 flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Neural System Guide
          </h3>
          <p className="text-game-accent/90 mb-4">
            To engage in neural combat, you must activate the visual scanner to enable gesture recognition.
          </p>
          <p className="text-game-accent/90">
            Click "Activate Scanner" above to initialize systems and begin your combat training.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GameControls;