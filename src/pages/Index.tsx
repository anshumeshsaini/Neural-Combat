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
import { CircuitBoard, Sparkles } from 'lucide-react';

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
            title: "Neural Network Initialized",
            description: "Gesture recognition system is now online",
            duration: 3000,
          });
        } catch (error) {
          console.error('Failed to load HandPose model:', error);
          toast({
            title: "System Error",
            description: "Neural network initialization failed",
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
    <div className="min-h-screen w-full game-container py-4 md:py-8 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-6 md:mb-8 text-center relative">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-game-highlight to-transparent"></div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 relative inline-block mt-4">
            <span className="absolute -inset-1 blur-lg opacity-50 bg-gradient-to-r from-game-accent via-game-highlight to-game-accent"></span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-game-highlight to-white">
              Neural Combat
            </span>
            <Sparkles className="absolute -top-4 -right-8 text-game-highlight h-5 w-5 animate-pulse" />
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <CircuitBoard className="h-4 w-4 text-game-highlight" />
            <p className="text-base sm:text-lg md:text-xl text-white/70">Gesture Battle System</p>
            <CircuitBoard className="h-4 w-4 text-game-highlight" />
          </div>
          
          <div className="mt-4 md:mt-6 max-w-xl mx-auto">
            <Instructions />
          </div>
        </header>
        
        <main className="w-full space-y-4 md:space-y-6">
          {/* Score display */}
          <div className="px-4 md:px-0">
            <ScoreBoard score={score} />
          </div>
          
          {/* Game result */}
          <div className="px-4 md:px-0">
            <GameResult 
              playerChoice={playerChoice}
              computerChoice={computerChoice}
              result={gameResult}
            />
          </div>
          
          {/* Webcam with gesture detection */}
          <div className="relative w-full max-w-xl mx-auto px-4 md:px-0">
            <div className="gesture-container p-1 overflow-hidden">
              <Webcam 
                isActive={isCameraActive}
                handposeModel={handposeModel}
                onGestureDetected={handleGestureDetected}
                isCapturing={isCapturingGesture}
                isCountingDown={isCountingDown}
              />
            </div>
            
            {/* Countdown overlay */}
            {isCountingDown && (
              <Countdown count={countdownValue} />
            )}
          </div>
          
          {/* Game controls */}
          <div className="px-4 md:px-0">
            <GameControls 
              isCameraActive={isCameraActive}
              isModelLoaded={isModelLoaded}
              isPlaying={isGameActive || isCapturingGesture || isCountingDown}
              onToggleCamera={handleToggleCamera}
              onStartGame={handleStartGame}
              onStopGame={handleStopGame}
            />
          </div>
          
          {/* Info messages */}
          {isCameraActive && isModelLoaded && !isGameActive && !isCapturingGesture && !isCountingDown && (
            <p className="text-center mt-4 md:mt-6 text-sm md:text-base text-white/70 backdrop-blur-sm py-2 px-4 rounded-md inline-block mx-auto">
              <span className="text-game-highlight">⟨</span> Select "Initiate Match" to begin <span className="text-game-highlight">⟩</span>
            </p>
          )}
          
          {isCapturingGesture && (
            <p className="text-center mt-4 md:mt-6 text-sm md:text-base text-game-highlight font-bold animate-pulse backdrop-blur-sm py-2 px-4 rounded-md inline-block mx-auto">
              <span className="text-white">⟨</span> Display your gesture now! <span className="text-white">⟩</span>
            </p>
          )}
          
          {!isCameraActive && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-black/40 backdrop-blur-sm rounded-lg max-w-lg mx-auto card-holographic">

              

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;