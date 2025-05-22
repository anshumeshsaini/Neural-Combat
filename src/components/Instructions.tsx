
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Scissors, PanelLeft, GripHorizontal } from 'lucide-react';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5">
          How to Play
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-game-bg border-game-accent/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-4 text-game-highlight">
            How to Play Rock Paper Scissors with Gestures
          </DialogTitle>
          <DialogDescription className="text-white/80">
            Play the classic Rock Paper Scissors game using hand gestures detected by your webcam!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-game-accent">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-white/80">
              <li>Allow camera access when prompted</li>
              <li>Click "Turn On Camera" to activate your webcam</li>
              <li>Wait for the hand gesture model to load</li>
              <li>Click "Play Game" to start a round</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-game-accent">Game Rules</h3>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>Rock beats Scissors</li>
              <li>Scissors beats Paper</li>
              <li>Paper beats Rock</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-game-accent">Hand Gestures</h3>
            <div className="flex flex-col sm:flex-row justify-around gap-4 mt-3">
              <div className="flex flex-col items-center text-center">
                <GripHorizontal className="h-12 w-12 text-game-accent mb-2" />
                <p className="font-bold">Rock</p>
                <p className="text-sm text-white/70">Make a fist with your hand</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <PanelLeft className="h-12 w-12 text-game-accent mb-2" />
                <p className="font-bold">Paper</p>
                <p className="text-sm text-white/70">Open your hand with fingers extended</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Scissors className="h-12 w-12 text-game-accent mb-2" />
                <p className="font-bold">Scissors</p>
                <p className="text-sm text-white/70">Extend index and middle fingers</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-game-accent">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>Ensure good lighting for better hand detection</li>
              <li>Position your hand clearly in the camera view</li>
              <li>Make distinct gestures for better recognition</li>
              <li>Keep your hand steady during the countdown</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Instructions;
