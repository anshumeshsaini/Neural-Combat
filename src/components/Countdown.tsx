import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  count: number | null;
  onComplete?: () => void;
  theme?: 'futuristic' | 'cyberpunk' | 'neon' | 'holographic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgress?: boolean;
  soundEnabled?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({
  count,
  onComplete,
  theme = 'futuristic',
  size = 'lg',
  showProgress = true,
  soundEnabled = true
}) => {
  const [audio] = useState(() => {
    if (typeof Audio !== 'undefined' && soundEnabled) {
      return new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-explosion-2759.mp3');
    }
    return null;
  });
  const [lastCount, setLastCount] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const themes = {
    futuristic: {
      primary: 'rgba(0, 231, 255, 0.8)',
      secondary: 'rgba(100, 255, 218, 0.6)',
      bg: 'rgba(10, 25, 47, 0.9)',
      text: '#64ffda'
    },
    cyberpunk: {
      primary: 'rgba(255, 0, 231, 0.8)',
      secondary: 'rgba(255, 100, 218, 0.6)',
      bg: 'rgba(47, 10, 25, 0.9)',
      text: '#ff64da'
    },
    neon: {
      primary: 'rgba(57, 255, 20, 0.8)',
      secondary: 'rgba(20, 255, 57, 0.6)',
      bg: 'rgba(0, 0, 0, 0.95)',
      text: '#39ff14'
    },
    holographic: {
      primary: 'rgba(255, 255, 255, 0.8)',
      secondary: 'rgba(200, 200, 255, 0.6)',
      bg: 'rgba(0, 0, 30, 0.85)',
      text: 'white'
    }
  };

  const sizes = {
    sm: { width: 120, fontSize: '3rem' },
    md: { width: 160, fontSize: '4rem' },
    lg: { width: 200, fontSize: '5rem' },
    xl: { width: 280, fontSize: '7rem' }
  };

  useEffect(() => {
    if (count === null) return;

    if (count === 0 && lastCount !== 0) {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
      if (onComplete) onComplete();
    }

    if (count !== lastCount && count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }

    setLastCount(count);
  }, [count, lastCount, audio, onComplete]);

  if (count === null) return null;

  const currentTheme = themes[theme];
  const currentSize = sizes[size];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${currentTheme.primary} 0%, transparent 70%)`,
            opacity: isAnimating ? 0.3 : 0.1
          }}
          animate={{
            opacity: isAnimating ? [0.1, 0.3, 0.1] : 0.1,
            scale: isAnimating ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Main container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: currentSize.width,
            height: currentSize.width,
            backgroundColor: currentTheme.bg,
            boxShadow: `0 0 30px ${currentTheme.primary}, inset 0 0 20px rgba(255, 255, 255, 0.1)`
          }}
        >
          {/* Hexagonal grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <polygon points="25,0 50,14.5 50,43.5 25,58 0,43.5 0,14.5" fill="none" stroke={currentTheme.primary} strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>

          {/* Progress ring */}
          {showProgress && lastCount && count > 0 && (
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="transparent"
                stroke={currentTheme.secondary}
                strokeWidth="2"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - count / (lastCount + count))}
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
              />
            </svg>
          )}

          {/* Count number */}
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 1.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="font-bold tracking-tighter"
                style={{
                  fontSize: currentSize.fontSize,
                  color: currentTheme.text,
                  textShadow: `0 0 10px ${currentTheme.primary}, 0 0 20px ${currentTheme.primary}`
                }}
              >
                {count > 0 ? count : 'GO!'}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Particle effects */}
          {isAnimating && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    backgroundColor: currentTheme.primary,
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                    left: '50%',
                    top: '50%'
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}

          {/* Digital glitch effect */}
          {count === 0 && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 animate-[glitch_0.3s_linear_infinite]"></div>
              <div className="absolute inset-0 bg-black mix-blend-overlay opacity-0 animate-[glitch_0.3s_linear_0.1s_infinite]"></div>
            </div>
          )}

          {/* Holographic reflection */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 opacity-60"
            style={{
              background: `linear-gradient(to top, ${currentTheme.bg}, transparent)`,
              maskImage: 'linear-gradient(to bottom, transparent, black 70%)'
            }}
          />
        </div>

        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: currentTheme.primary,
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 100],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Add to your global CSS or style tag */}
      <style jsx global>{`
        @keyframes glitch {
          0% { opacity: 0.1; transform: translateX(0); }
          20% { opacity: 0.2; transform: translateX(-5px); }
          40% { opacity: 0.1; transform: translateX(5px); }
          60% { opacity: 0.3; transform: translateX(0); }
          80% { opacity: 0.2; transform: translateX(-3px); }
          100% { opacity: 0.1; transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default Countdown;