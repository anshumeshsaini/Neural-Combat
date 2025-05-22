
import React, { useRef, useEffect, useState } from 'react';
import { HandPose } from '@tensorflow-models/handpose';
import { drawHandLandmarks, detectHandGesture } from '../utils/handGestures';
import { Choice } from '../utils/gameLogic';

interface WebcamProps {
  isActive: boolean;
  handposeModel: HandPose | null;
  onGestureDetected: (gesture: Choice) => void;
  isCapturing: boolean;
  isCountingDown: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ 
  isActive, 
  handposeModel, 
  onGestureDetected, 
  isCapturing,
  isCountingDown 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  
  // Request camera access
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing video...');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Camera started successfully');
                setCameraReady(true);
                setError(null);
                
                // Update canvas dimensions
                if (canvasRef.current && videoRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setError('Could not start video playback. Please refresh and try again.');
              });
          }
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access your camera. Please check permissions and try again.');
      setCameraReady(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    setCameraReady(false);
    if (stream) {
      console.log('Stopping camera...');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCurrentGesture(null);
  };

  // Effect for handling camera activation/deactivation
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Effect for hand gesture detection loop
  useEffect(() => {
    if (!isActive || !handposeModel || !videoRef.current || !canvasRef.current || !cameraReady) {
      return;
    }
    
    console.log('Starting hand detection loop with model:', handposeModel ? 'loaded' : 'not loaded');
    
    let animationFrameId: number;
    let lastCaptureTime = 0;
    const captureInterval = 150; // Detect gestures more frequently (was 200ms)
    const gestureConfirmationThreshold = 3; // Number of consistent detections to confirm a gesture
    const gestureHistory: string[] = [];
    
    const detectHands = async (timestamp: number) => {
      if (!videoRef.current || !canvasRef.current || !handposeModel || !cameraReady) return;
      
      try {
        // Check if enough time has passed since last detection
        if (timestamp - lastCaptureTime > captureInterval) {
          // Clear the canvas first
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          
          const { gesture, landmarks } = await detectHandGesture(handposeModel, videoRef.current);
          
          if (gesture) {
            console.log('Detected gesture:', gesture);
            
            // Add to gesture history
            gestureHistory.push(gesture);
            if (gestureHistory.length > gestureConfirmationThreshold) {
              gestureHistory.shift(); // Keep history at fixed size
            }
            
            // Check if we have consistent detections
            const mostFrequentGesture = getMostFrequentGesture(gestureHistory);
            if (mostFrequentGesture) {
              setCurrentGesture(mostFrequentGesture);
              
              // Notify parent component about the detected gesture if we're in capturing mode
              if (isCapturing && !isCountingDown && 
                  gestureHistory.filter(g => g === mostFrequentGesture).length >= 2) {
                onGestureDetected(mostFrequentGesture as Choice);
              }
            }
          } else if (gestureHistory.length > 0) {
            // Clear history when no gesture is detected
            gestureHistory.length = 0;
            
            // Don't clear current gesture immediately to avoid flickering
            if (timestamp - lastCaptureTime > 1000) {
              setCurrentGesture(null);
            }
          }
          
          // Draw hand landmarks
          if (landmarks && ctx) {
            drawHandLandmarks(ctx, landmarks, gesture);
          }
          
          lastCaptureTime = timestamp;
        }
      } catch (error) {
        console.error('Error in hand detection loop:', error);
      }
      
      // Continue the detection loop
      animationFrameId = requestAnimationFrame(detectHands);
    };
    
    animationFrameId = requestAnimationFrame(detectHands);
    
    // Clean up
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        console.log('Hand detection loop stopped');
      }
    };
  }, [isActive, handposeModel, isCapturing, isCountingDown, onGestureDetected, cameraReady]);

  // Helper function to get the most frequent gesture from history
  const getMostFrequentGesture = (history: string[]): string | null => {
    if (history.length === 0) return null;
    
    const counts = history.reduce((acc, gesture) => {
      acc[gesture] = (acc[gesture] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mb-4">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/30 rounded-lg z-10">
          <p className="text-white bg-red-900/80 p-4 rounded">{error}</p>
        </div>
      )}
      
      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10">
          <p className="text-white">Camera is turned off</p>
        </div>
      )}

      <div className={`relative ${isCapturing ? 'neon-border rounded-lg' : 'rounded-lg'}`}>
        <video 
          ref={videoRef}
          className="rounded-lg w-full bg-black"
          playsInline
          style={{ transform: 'scaleX(-1)' }} // Mirror the video
          muted
        />
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          style={{ transform: 'scaleX(-1)' }} // Mirror the canvas too
        />
        
        {/* Gesture indicator */}
        {currentGesture && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-full">
            <span className="text-white font-medium">
              Detected: <span className="gesture-label">{currentGesture.toUpperCase()}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Webcam;
