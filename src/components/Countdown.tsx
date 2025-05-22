
import React from 'react';

interface CountdownProps {
  count: number | null;
}

const Countdown: React.FC<CountdownProps> = ({ count }) => {
  if (count === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-20">
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border-4 border-game-highlight/30 animate-pulse"></div>
        </div>
        
        {/* Inner glowing ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-game-accent/50 animate-ping opacity-70"></div>
        </div>
        
        {/* Count number */}
        <div className="relative z-10 flex items-center justify-center w-24 h-24">
          <span 
            className="text-7xl font-bold countdown-text animate-countdown text-white"
            data-text={count > 0 ? count : 'Go!'}
          >
            {count > 0 ? count : 'Go!'}
          </span>
        </div>
        
        {/* Tech scanlines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <div className="w-full h-0.5 bg-game-highlight/30 absolute top-1/2 transform -translate-y-1/2 left-0 animate-[scanLine_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
