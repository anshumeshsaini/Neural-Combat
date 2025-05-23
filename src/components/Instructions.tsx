import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Scissors, PanelLeft, GripHorizontal, X, ChevronRight, ChevronLeft, Play, Camera, Lightbulb, Zap, Trophy, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Getting Started",
      icon: <Play className="h-5 w-5" />,
      content: (
        <ol className="list-decimal list-inside space-y-3">
          <li className="transition-all hover:text-game-accent">Allow camera access when prompted</li>
          <li className="transition-all hover:text-game-accent">Click "Turn On Camera" to activate your webcam</li>
          <li className="transition-all hover:text-game-accent">Wait for the hand gesture model to load</li>
          <li className="transition-all hover:text-game-accent">Click "Play Game" to start a round</li>
        </ol>
      )
    },
    {
      title: "Game Rules",
      icon: <Trophy className="h-5 w-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-game-bg/50 p-4 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <GripHorizontal className="h-5 w-5 text-game-accent" />
              <span className="font-bold">Rock</span>
            </div>
            <p className="text-sm">Beats Scissors</p>
          </div>
          <div className="bg-game-bg/50 p-4 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <PanelLeft className="h-5 w-5 text-game-accent" />
              <span className="font-bold">Paper</span>
            </div>
            <p className="text-sm">Beats Rock</p>
          </div>
          <div className="bg-game-bg/50 p-4 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="h-5 w-5 text-game-accent" />
              <span className="font-bold">Scissors</span>
            </div>
            <p className="text-sm">Beats Paper</p>
          </div>
        </div>
      )
    },
    {
      title: "Hand Gestures",
      icon: <Camera className="h-5 w-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-game-bg to-game-bg/70 p-6 rounded-xl border border-game-accent/30 flex flex-col items-center"
          >
            <div className="relative mb-4">
              <GripHorizontal className="h-16 w-16 text-game-accent" />
              <div className="absolute -top-2 -right-2 bg-game-highlight text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                1
              </div>
            </div>
            <p className="font-bold text-lg mb-1">Rock</p>
            <p className="text-sm text-center text-white/80">Make a fist with your hand</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-game-bg to-game-bg/70 p-6 rounded-xl border border-game-accent/30 flex flex-col items-center"
          >
            <div className="relative mb-4">
              <PanelLeft className="h-16 w-16 text-game-accent" />
              <div className="absolute -top-2 -right-2 bg-game-highlight text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                2
              </div>
            </div>
            <p className="font-bold text-lg mb-1">Paper</p>
            <p className="text-sm text-center text-white/80">Open hand with fingers extended</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-game-bg to-game-bg/70 p-6 rounded-xl border border-game-accent/30 flex flex-col items-center"
          >
            <div className="relative mb-4">
              <Scissors className="h-16 w-16 text-game-accent" />
              <div className="absolute -top-2 -right-2 bg-game-highlight text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                3
              </div>
            </div>
            <p className="font-bold text-lg mb-1">Scissors</p>
            <p className="text-sm text-center text-white/80">Extend index and middle fingers</p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Pro Tips",
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-game-bg/50 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <Lightbulb className="h-5 w-5 text-game-highlight mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Optimal Lighting</p>
              <p className="text-sm text-white/80">Face a light source to ensure clear hand detection</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-game-bg/50 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <Settings className="h-5 w-5 text-game-highlight mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Camera Position</p>
              <p className="text-sm text-white/80">Keep your hand centered in frame at mid-chest level</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-game-bg/50 rounded-lg border border-game-accent/20 hover:border-game-accent/50 transition-all">
            <Info className="h-5 w-5 text-game-highlight mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Gesture Clarity</p>
              <p className="text-sm text-white/80">Make exaggerated gestures for better recognition</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    setProgress(((currentStep + 1) / steps.length) * 100);
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            className="bg-game-highlight/10 border-game-highlight/30 text-white hover:bg-game-highlight/20 hover:border-game-highlight/50 group"
          >
            <span className="mr-2">How to Play</span>
            <Info className="h-4 w-4 transition-transform group-hover:rotate-12" />
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="bg-game-bg/95 backdrop-blur-md border-game-accent/30 text-white max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-game-accent/20">
            <Progress value={progress} className="h-full bg-game-highlight transition-all duration-300" />
          </div>
          
          <DialogHeader className="p-6 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-game-highlight to-game-accent bg-clip-text text-transparent">
                  {steps[currentStep].title}
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </DialogDescription>
              </div>
              <Button 
                onClick={() => setIsOpen(false)}
                size="icon" 
                variant="ghost" 
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isAnimating ? (currentStep > 0 ? 50 : -50) : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAnimating ? (currentStep > 0 ? -50 : 50) : 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px] flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6 text-game-highlight">
                  {steps[currentStep].icon}
                  <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
                </div>
                
                <div className="flex-1">
                  {steps[currentStep].content}
                </div>
                
                <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
                  <Button 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    variant="outline" 
                    className="gap-1 bg-transparent border-white/20 hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      onClick={nextStep}
                      variant="game"
                      className="gap-1 bg-game-highlight hover:bg-game-highlight/90"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsOpen(false)}
                      variant="game"
                      className="gap-1 bg-game-highlight hover:bg-game-highlight/90"
                    >
                      Got it!
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Instructions;