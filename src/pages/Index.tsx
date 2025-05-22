
import React, { useState, useEffect } from 'react';
import { HandPose } from '@tensorflow-models/handpose';
import { loadHandPoseModel } from '../utils/handGestures';
import { 
  Choice, 
  Result, 
  GameScore, 
  getComputerChoice, 
  determineResult, 
  updateScore 
} from '../utils/gameLogic';

import Webcam from '../components/Webcam';
import GameControls from '../components/GameControls';
import Countdown from '../components/Countdown';
import GameResult from '../components/GameResult';
import ScoreBoard from '../components/ScoreBoard';
import Instructions from '../components/Instructions';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  // Game state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [handposeModel, setHandposeModel] = useState<HandPose | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isCapturingGesture, setIsCapturingGesture] = useState(false);
  
  // Game results
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [gameResult, setGameResult] = useState<Result>(null);
  const [score, setScore] = useState<GameScore>({ wins: 0, losses: 0, ties: 0 });
  
  const { toast } = useToast();

  // Load handpose model
  useEffect(() => {
    const loadModel = async () => {
      if (isCameraActive && !handposeModel) {
        try {
          console.log("Starting to load handpose model...");
          const model = await loadHandPoseModel();
          console.log("Model loaded successfully");
          setHandposeModel(model);
          setIsModelLoaded(true);
          toast({
            title: "Model Loaded",
            description: "Hand detection model is ready!",
            duration: 3000,
          });
        } catch (error) {
          console.error('Failed to load HandPose model:', error);
          toast({
            title: "Error",
            description: "Failed to load hand detection model",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    };
    
    loadModel();
  }, [isCameraActive]);

  // Toggle camera
  const handleToggleCamera = () => {
    console.log("Toggle camera clicked, current state:", isCameraActive);
    setIsCameraActive(prev => !prev);
    
    if (isCameraActive) {
      // Reset game state when turning off camera
      setIsGameActive(false);
      setIsCapturingGesture(false);
      setIsCountingDown(false);
      setCountdownValue(null);
    }
  };

  // Start game round
  const handleStartGame = () => {
    console.log("Start game clicked");
    if (!isCameraActive || !isModelLoaded) return;
    
    setIsGameActive(true);
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameResult(null);
    startCountdown();
  };

  // Stop game
  const handleStopGame = () => {
    console.log("Stop game clicked");
    setIsGameActive(false);
    setIsCapturingGesture(false);
    setIsCountingDown(false);
    setCountdownValue(null);
  };

  // Start countdown before capturing gesture
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdownValue(3);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            setIsCountingDown(false);
            setCountdownValue(null);
            setIsCapturingGesture(true);
            
            // Set a timeout to capture the gesture
            setTimeout(() => {
              if (!playerChoice) {
                // If no gesture detected, use a default
                handleGestureDetected('rock' as Choice);
                toast({
                  title: "No gesture detected",
                  description: "Using 'rock' as default",
                  variant: "destructive",
                  duration: 3000,
                });
              }
            }, 2000); // Give 2 seconds to detect gesture
          }, 500); // Short delay after countdown finishes
          return 0; // "Go!"
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle gesture detection
  const handleGestureDetected = (gesture: Choice) => {
    if (!isCapturingGesture || !gesture) return;
    
    // Only capture the first detected gesture
    setIsCapturingGesture(false);
    setPlayerChoice(gesture);
    
    // Generate computer choice
    const aiChoice = getComputerChoice();
    setComputerChoice(aiChoice);
    
    // Determine the result
    const result = determineResult(gesture, aiChoice);
    setGameResult(result);
    
    // Update the score
    if (result) {
      setScore(prevScore => updateScore(prevScore, result));
    }
    
    // Game round complete
    setIsGameActive(false);
  };

  return (
    <div className="min-h-screen w-full game-container py-8 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Rock Paper Scissors
          </h1>
          <p className="text-xl text-white/70">Play against AI using hand gestures</p>
          
          <div className="mt-4">
            <Instructions />
          </div>
        </header>
        
        <main className="w-full">
          {/* Score display */}
          <ScoreBoard score={score} />
          
          {/* Game result */}
          <GameResult 
            playerChoice={playerChoice}
            computerChoice={computerChoice}
            result={gameResult}
          />
          
          {/* Webcam with gesture detection */}
          <div className="relative w-full max-w-xl mx-auto">
            <Webcam 
              isActive={isCameraActive}
              handposeModel={handposeModel}
              onGestureDetected={handleGestureDetected}
              isCapturing={isCapturingGesture}
              isCountingDown={isCountingDown}
            />
            
            {/* Countdown overlay */}
            {isCountingDown && (
              <Countdown count={countdownValue} />
            )}
          </div>
          
          {/* Game controls */}
          <GameControls 
            isCameraActive={isCameraActive}
            isModelLoaded={isModelLoaded}
            isPlaying={isGameActive || isCapturingGesture || isCountingDown}
            onToggleCamera={handleToggleCamera}
            onStartGame={handleStartGame}
            onStopGame={handleStopGame}
          />
          
          {/* Info messages */}
          {isCameraActive && isModelLoaded && !isGameActive && !isCapturingGesture && !isCountingDown && (
            <p className="text-center mt-6 text-white/70">
              Click "Play Game" to start a new round
            </p>
          )}
          
          {isCapturingGesture && (
            <p className="text-center mt-6 text-game-highlight font-bold animate-pulse">
              Make your gesture now!
            </p>
          )}
          
          {!isCameraActive && (
            <div className="mt-6 p-4 bg-black/40 rounded-lg max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-white mb-2">Getting Started</h3>
              <p className="text-white/80 mb-3">
                To play the game, you need to allow camera access so the app can detect your hand gestures.
              </p>
              <p className="text-white/80">
                Click "Turn On Camera" above to start, then follow the instructions to play.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
