
import React from 'react';
import { GameScore } from '../utils/gameLogic';
import { Separator } from '@/components/ui/separator';
import { Trophy, X, MinusCircle } from 'lucide-react';

interface ScoreBoardProps {
  score: GameScore;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <h2 className="text-xl text-white/80 font-bold mb-4 tech-heading flex items-center justify-center">
        <span className="mr-1 text-game-highlight">⟨</span> 
        Combat Statistics 
        <span className="ml-1 text-game-highlight">⟩</span>
      </h2>
      
      <div className="flex justify-between gap-4">
        <div className="cyber-panel flex-1 px-5 py-4 flex flex-col items-center relative">
          <Trophy className="h-6 w-6 text-game-win mb-1" />
          <Separator className="bg-game-win/30 w-12 my-1" />
          <p className="text-game-win text-3xl font-bold mt-1 tracking-widest">
            {String(score.wins).padStart(2, '0')}
          </p>
          <p className="text-sm text-white/60 mt-1">Victories</p>
          <span className="absolute top-0 right-0 w-2 h-2 bg-game-win rounded-full m-2"></span>
        </div>
        
        <div className="cyber-panel flex-1 px-5 py-4 flex flex-col items-center relative">
          <X className="h-6 w-6 text-game-lose mb-1" />
          <Separator className="bg-game-lose/30 w-12 my-1" />
          <p className="text-game-lose text-3xl font-bold mt-1 tracking-widest">
            {String(score.losses).padStart(2, '0')}
          </p>
          <p className="text-sm text-white/60 mt-1">Defeats</p>
          <span className="absolute top-0 right-0 w-2 h-2 bg-game-lose rounded-full m-2"></span>
        </div>
        
        <div className="cyber-panel flex-1 px-5 py-4 flex flex-col items-center relative">
          <MinusCircle className="h-6 w-6 text-game-tie mb-1" />
          <Separator className="bg-game-tie/30 w-12 my-1" />
          <p className="text-game-tie text-3xl font-bold mt-1 tracking-widest">
            {String(score.ties).padStart(2, '0')}
          </p>
          <p className="text-sm text-white/60 mt-1">Draws</p>
          <span className="absolute top-0 right-0 w-2 h-2 bg-game-tie rounded-full m-2"></span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
