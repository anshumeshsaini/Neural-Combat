
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
    <Card className="w-full max-w-md mx-auto mb-6 bg-black/40 border border-game-accent/30 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className={`text-center text-xl ${getResultColorClass(result)}`}>
          {getResultText(result)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center mt-2">
          <div className="text-center">
            <div className="text-4xl mb-2">{getChoiceEmoji(playerChoice)}</div>
            <p className="text-white/80">Your Choice</p>
            <p className="text-lg font-bold text-white capitalize">{playerChoice}</p>
          </div>
          
          <div className="text-gray-400 font-bold">VS</div>
          
          <div className="text-center">
            <div className="text-4xl mb-2">{getChoiceEmoji(computerChoice)}</div>
            <p className="text-white/80">AI Choice</p>
            <p className="text-lg font-bold text-white capitalize">{computerChoice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameResult;
