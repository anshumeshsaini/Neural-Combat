
import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Choice, Result, getResultText, getChoiceEmoji, getResultColorClass } from '../utils/gameLogic';

interface GameResultProps {
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
}

const GameResult: React.FC<GameResultProps> = ({ playerChoice, computerChoice, result }) => {
  if (!playerChoice || !computerChoice || !result) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8 card-holographic animate-fade-in">
      <div className="p-4 pb-2">
        <div className={`text-center mb-2 ${getResultColorClass(result)}`}>
          <span className="relative inline-block">
            <span className="absolute inset-0 blur-sm opacity-70">{getResultText(result)}</span>
            <h2 className="text-2xl font-black tracking-wider relative">{getResultText(result)}</h2>
          </span>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-game-accent/30 to-transparent h-0.5" />
      
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="text-center relative group">
            <div className="mb-4 relative">
              <div className="text-5xl mb-1 transform transition-transform group-hover:scale-110 duration-300">
                {getChoiceEmoji(playerChoice)}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-game-accent/0 via-game-accent/10 to-game-accent/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-black text-sm">Your Choice</p>
            <p className="text-lg font-bold text-black capitalize bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {playerChoice}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center border border-white/10">
              <div className="text-black font-bold text-xl">VS</div>
            </div>
            <div className="mt-2 w-0.5 h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          </div>
          
          <div className="text-center relative group">
            <div className="mb-4 relative">
              <div className="text-5xl mb-1 transform transition-transform group-hover:scale-110 duration-300">
                {getChoiceEmoji(computerChoice)}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-game-highlight/0 via-game-highlight/10 to-game-highlight/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <p className="text-black text-sm">AI Choice</p>
            <p className="text-lg font-bold text-black capitalize bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {computerChoice}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameResult;
