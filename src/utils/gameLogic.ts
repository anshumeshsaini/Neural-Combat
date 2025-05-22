
// Game choices
export type Choice = 'rock' | 'paper' | 'scissors' | null;

// Game result types
export type Result = 'win' | 'lose' | 'tie' | null;

// Game score
export interface GameScore {
  wins: number;
  losses: number;
  ties: number;
}

// Get computer's random choice
export const getComputerChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
};

// Determine the game result based on player and computer choices
export const determineResult = (playerChoice: Choice, computerChoice: Choice): Result => {
  if (!playerChoice || !computerChoice) return null;

  if (playerChoice === computerChoice) {
    return 'tie';
  }

  switch (playerChoice) {
    case 'rock':
      return computerChoice === 'scissors' ? 'win' : 'lose';
    case 'paper':
      return computerChoice === 'rock' ? 'win' : 'lose';
    case 'scissors':
      return computerChoice === 'paper' ? 'win' : 'lose';
    default:
      return null;
  }
};

// Update game score based on result
export const updateScore = (currentScore: GameScore, result: Result): GameScore => {
  if (!result) return currentScore;

  const newScore = { ...currentScore };
  
  switch (result) {
    case 'win':
      newScore.wins += 1;
      break;
    case 'lose':
      newScore.losses += 1;
      break;
    case 'tie':
      newScore.ties += 1;
      break;
    default:
      break;
  }
  
  return newScore;
};

// Get display text for result
export const getResultText = (result: Result): string => {
  switch (result) {
    case 'win':
      return 'You Win!';
    case 'lose':
      return 'You Lose!';
    case 'tie':
      return 'It\'s a Tie!';
    default:
      return '';
  }
};

// Get corresponding emoji for a choice
export const getChoiceEmoji = (choice: Choice): string => {
  switch (choice) {
    case 'rock':
      return '✊';
    case 'paper':
      return '✋';
    case 'scissors':
      return '✌️';
    default:
      return '';
  }
};

// Get color class for result styling
export const getResultColorClass = (result: Result): string => {
  switch (result) {
    case 'win':
      return 'text-game-win';
    case 'lose':
      return 'text-game-lose';
    case 'tie':
      return 'text-game-tie';
    default:
      return '';
  }
};
