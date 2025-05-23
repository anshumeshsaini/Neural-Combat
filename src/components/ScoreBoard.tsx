import React, { useState, useEffect } from 'react';
import { GameScore } from '../utils/gameLogic';
import { Trophy, X, MinusCircle, BarChart2, ChevronDown, ChevronUp, Zap, RefreshCw, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';

interface ScoreBoardProps {
  score: GameScore;
  onReset?: () => void;
  onShare?: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, onReset, onShare }) => {
  const [expanded, setExpanded] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [winRate, setWinRate] = useState(0);

  // Calculate win streak and last result
  useEffect(() => {
    const totalGames = score.wins + score.losses + score.ties;
    if (totalGames > 0) {
      setWinRate(Math.round((score.wins / totalGames) * 100));
    }
  }, [score]);

  // Animation variants
  const statsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <motion.div 
        className="glass-panel rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-game-highlight/20 to-game-highlight/10 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-game-highlight" />
            <h2 className="text-xl font-bold text-white tracking-wider">
              COMBAT ANALYTICS DASHBOARD
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/60">v2.4.1</span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-game-highlight" />
            ) : (
              <ChevronDown className="h-5 w-5 text-game-highlight" />
            )}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-1 p-4 bg-gray-900/50">
          {/* Wins */}
          <motion.div 
            className="stat-panel"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="flex flex-col items-center p-4 relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-game-win rounded-full pulse-animation"></div>
              <Trophy className="h-7 w-7 text-game-win mb-2" />
              <p className="text-game-win text-4xl font-mono font-bold tracking-tighter">
                {String(score.wins).padStart(2, '0')}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Victories</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-game-win/30">
                <motion.div 
                  className="h-full bg-game-win"
                  initial={{ width: 0 }}
                  animate={{ width: `${winRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Losses */}
          <motion.div 
            className="stat-panel"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="flex flex-col items-center p-4 relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-game-lose rounded-full pulse-animation"></div>
              <X className="h-7 w-7 text-game-lose mb-2" />
              <p className="text-game-lose text-4xl font-mono font-bold tracking-tighter">
                {String(score.losses).padStart(2, '0')}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Defeats</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-game-lose/30">
                <motion.div 
                  className="h-full bg-game-lose"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - winRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Ties */}
          <motion.div 
            className="stat-panel"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="flex flex-col items-center p-4 relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-game-tie rounded-full pulse-animation"></div>
              <MinusCircle className="h-7 w-7 text-game-tie mb-2" />
              <p className="text-game-tie text-4xl font-mono font-bold tracking-tighter">
                {String(score.ties).padStart(2, '0')}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">Draws</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-game-tie/30">
                <motion.div 
                  className="h-full bg-game-tie"
                  initial={{ width: 0 }}
                  animate={{ width: `${score.ties > 0 ? 50 : 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Expanded Stats */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0, height: 0 },
                visible: { opacity: 1, height: 'auto' },
                exit: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/30 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* Win Rate */}
                <motion.div 
                  className="flex items-center space-x-3"
                  variants={statsVariants}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#333"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={winRate > 50 ? "#4ade80" : "#f87171"}
                        strokeWidth="3"
                        strokeDasharray={`${winRate}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {winRate}%
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Win Rate</p>
                    <p className="text-white font-medium">
                      {winRate > 50 ? "Dominating" : winRate > 30 ? "Competitive" : "Needs Improvement"}
                    </p>
                  </div>
                </motion.div>

                {/* Total Games */}
                <motion.div 
                  className="flex items-center space-x-3"
                  variants={statsVariants}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-game-highlight/10 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-game-highlight" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Total Battles</p>
                    <p className="text-white font-medium">
                      {score.wins + score.losses + score.ties} engagements
                    </p>
                  </div>
                </motion.div>

                {/* Last Result */}
                <motion.div 
                  className="flex items-center space-x-3"
                  variants={statsVariants}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg" 
                    style={{ 
                      backgroundColor: lastResult === 'win' ? 'rgba(74, 222, 128, 0.1)' : 
                                      lastResult === 'lose' ? 'rgba(248, 113, 113, 0.1)' : 
                                      'rgba(253, 230, 138, 0.1)'
                    }}
                  >
                    {lastResult === 'win' ? (
                      <Trophy className="h-5 w-5 text-game-win" />
                    ) : lastResult === 'lose' ? (
                      <X className="h-5 w-5 text-game-lose" />
                    ) : (
                      <MinusCircle className="h-5 w-5 text-game-tie" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider">Last Outcome</p>
                    <p className="text-white font-medium">
                      {lastResult === 'win' ? 'Victory' : 
                       lastResult === 'lose' ? 'Defeat' : 
                       lastResult === 'tie' ? 'Standoff' : 'No data'}
                    </p>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div 
                  className="flex items-center space-x-2"
                  variants={statsVariants}
                  transition={{ delay: 0.4 }}
                >
                  <Tooltip content="Reset Stats">
                    <button 
                      onClick={onReset}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <RefreshCw className="h-5 w-5 text-white/80" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Share Stats">
                    <button 
                      onClick={onShare}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-white/80" />
                    </button>
                  </Tooltip>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add these styles to your global CSS */}
      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(17, 24, 39, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.125);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .stat-panel {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-panel:hover {
          background: rgba(55, 65, 81, 0.5);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ScoreBoard;