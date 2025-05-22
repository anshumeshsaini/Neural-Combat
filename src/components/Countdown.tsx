
import React from 'react';

interface CountdownProps {
  count: number | null;
}

const Countdown: React.FC<CountdownProps> = ({ count }) => {
  if (count === null) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-20">
      <span className={`text-6xl font-bold countdown-text animate-countdown text-white`}>
        {count > 0 ? count : 'Go!'}
      </span>
    </div>
  );
};

export default Countdown;
