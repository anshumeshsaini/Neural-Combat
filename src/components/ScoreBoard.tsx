
import React from 'react';
import { GameScore } from '../utils/gameLogic';

interface ScoreBoardProps {
  score: GameScore;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="flex justify-center gap-6 mb-6">
      <div className="text-center px-4 py-2 bg-game-accent/20 rounded-lg">
        <p className="text-game-win text-lg font-bold">{score.wins}</p>
        <p className="text-sm text-white/70">Wins</p>
      </div>
      <div className="text-center px-4 py-2 bg-game-accent/20 rounded-lg">
        <p className="text-game-lose text-lg font-bold">{score.losses}</p>
        <p className="text-sm text-white/70">Losses</p>
      </div>
      <div className="text-center px-4 py-2 bg-game-accent/20 rounded-lg">
        <p className="text-game-tie text-lg font-bold">{score.ties}</p>
        <p className="text-sm text-white/70">Ties</p>
      </div>
    </div>
  );
};

export default ScoreBoard;
