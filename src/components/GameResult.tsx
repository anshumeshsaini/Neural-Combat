import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Choice, Result, getResultText, getChoiceEmoji, getResultColorClass } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from 'use-sound';
import confetti from 'canvas-confetti';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Share2, RotateCw, BarChart2, Info } from 'lucide-react';

interface GameResultProps {
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
  onRematch?: () => void;
  gameHistory?: { wins: number; losses: number; draws: number };
}

const GameResult: React.FC<GameResultProps> = ({ 
  playerChoice, 
  computerChoice, 
  result, 
  onRematch,
  gameHistory 
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [playWinSound] = useSound('/sounds/win.mp3', { volume: 0.5 });
  const [playLoseSound] = useSound('/sounds/lose.mp3', { volume: 0.5 });
  const [playDrawSound] = useSound('/sounds/draw.mp3', { volume: 0.5 });
  const [playHoverSound] = useSound('/sounds/hover.mp3', { volume: 0.3 });

  useEffect(() => {
    if (result === 'win') {
      playWinSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (result === 'lose') {
      playLoseSound();
    } else {
      playDrawSound();
    }
  }, [result, playWinSound, playLoseSound, playDrawSound]);

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rock Paper Scissors Result',
        text: `I just ${getResultText(result)} against the AI! ${getChoiceEmoji(playerChoice)} vs ${getChoiceEmoji(computerChoice)}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I just ${getResultText(result)} against the AI! ${getChoiceEmoji(playerChoice)} vs ${getChoiceEmoji(computerChoice)}`
      );
      // Show toast notification
    }
  };

  if (!playerChoice || !computerChoice || !result) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <Card className={`w-full max-w-lg mx-auto mb-8 bg-gradient-to-br from-gray-900/80 to-gray-800/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${expandedView ? 'h-auto' : 'h-64'} transition-all duration-500 ease-in-out`}>
          {/* Holographic Header */}
          <CardHeader className="relative p-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-30"></div>
            <div className="relative z-10 p-6 pb-4">
              <motion.div 
                className={`text-center mb-2 ${getResultColorClass(result)}`}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => playHoverSound()}
              >
                <h2 className="text-3xl font-black tracking-wider relative">
                  <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 blur-sm opacity-70">
                    {getResultText(result)}
                  </span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    {getResultText(result)}
                  </span>
                </h2>
                {gameHistory && (
                  <p className="text-sm text-white/60 mt-1">
                    {gameHistory.wins}W • {gameHistory.losses}L • {gameHistory.draws}D
                  </p>
                )}
              </motion.div>
            </div>
          </CardHeader>

          {/* Animated Separator */}
          <Separator className="bg-gradient-to-r from-transparent via-game-accent/40 to-transparent h-[1px] mx-6" />

          {/* Main Content */}
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex justify-between items-center relative">
              {/* Player Choice */}
              <motion.div 
                className="text-center relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="mb-4 relative">
                  <motion.div 
                    className="text-6xl mb-1"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'mirror'
                    }}
                  >
                    {getChoiceEmoji(playerChoice)}
                  </motion.div>
                  <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-radial-gradient from-game-accent/20 via-transparent to-transparent"></div>
                </div>
                <p className="text-white/70 text-sm">Your Choice</p>
                <p className="text-lg font-bold text-white capitalize">
                  {playerChoice}
                </p>
              </motion.div>
              
              {/* VS Badge with Animation */}
              <motion.div 
                className="flex flex-col items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-lg">
                  <div className="text-white font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">VS</div>
                </div>
                <div className="mt-2 w-0.5 h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              </motion.div>
              
              {/* Computer Choice */}
              <motion.div 
                className="text-center relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div className="mb-4 relative">
                  <motion.div 
                    className="text-6xl mb-1"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: 0.5
                    }}
                  >
                    {getChoiceEmoji(computerChoice)}
                  </motion.div>
                  <div className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-radial-gradient from-game-highlight/20 via-transparent to-transparent"></div>
                </div>
                <p className="text-white/70 text-sm">AI Choice</p>
                <p className="text-lg font-bold text-white capitalize">
                  {computerChoice}
                </p>
              </motion.div>
            </div>

            {/* Expanded View Content */}
            {expandedView && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <Separator className="bg-gradient-to-r from-transparent via-white/10 to-transparent h-[1px] my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white/80 text-sm font-medium mb-2">Match Analysis</h3>
                    <p className="text-white/60 text-sm">
                      {result === 'win' 
                        ? `Your ${playerChoice} beats AI's ${computerChoice}`
                        : result === 'lose'
                        ? `AI's ${computerChoice} beats your ${playerChoice}`
                        : `Both chose ${playerChoice} - it's a tie!`}
                    </p>
                  </div>
                  
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white/80 text-sm font-medium mb-2">Win Probability</h3>
                    <div className="w-full bg-gray-800/50 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getResultColorClass(result)}`}
                        style={{ width: `${result === 'win' ? '70%' : result === 'lose' ? '30%' : '50%'}` }}
                      ></div>
                    </div>
                    <p className="text-white/60 text-xs mt-1">
                      {result === 'win' 
                        ? '70% chance to win' 
                        : result === 'lose' 
                        ? '30% chance to win' 
                        : 'Equal chances'}
                    </p>
                  </div>
                </div>
                
                {showStats && gameHistory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 bg-black/20 p-4 rounded-xl border border-white/10"
                  >
                    <h3 className="text-white/80 text-sm font-medium mb-2">Game Statistics</h3>
                    <div className="flex justify-between text-xs text-white/60">
                      <div>Win Rate: {Math.round((gameHistory.wins / (gameHistory.wins + gameHistory.losses + gameHistory.draws)) * 100)}%</div>
                      <div>Streak: 2 wins</div>
                      <div>Total: {gameHistory.wins + gameHistory.losses + gameHistory.draws} games</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </CardContent>

          {/* Footer with Actions */}
          <CardFooter className="p-4 bg-black/20 border-t border-white/10 flex justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={toggleExpandedView}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {expandedView ? 'Hide details' : 'Show details'}
              </TooltipContent>
            </Tooltip>
            
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => setShowStats(!showStats)}
                    disabled={!expandedView}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {showStats ? 'Hide stats' : 'Show stats'}
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={shareResult}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Share result
                </TooltipContent>
              </Tooltip>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 text-black hover:bg-white rounded-full px-4 gap-1"
                onClick={onRematch}
              >
                <RotateCw className="w-4 h-4" />
                Rematch
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameResult;