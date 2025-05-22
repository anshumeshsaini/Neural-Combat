
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
  
  // Request camera access
  const startCamera = async () => {
    try {
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
        await videoRef.current.play();
      }
      
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access your camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
    if (!isActive || !handposeModel || !videoRef.current || !canvasRef.current) return;
    
    let animationFrameId: number;
    let lastCaptureTime = 0;
    const captureInterval = 200; // Detect gestures every 200ms
    
    const detectHands = async (timestamp: number) => {
      if (!videoRef.current || !canvasRef.current || !handposeModel) return;
      
      // Check if enough time has passed since last detection
      if (timestamp - lastCaptureTime > captureInterval) {
        const { gesture, landmarks } = await detectHandGesture(handposeModel, videoRef.current);
        
        if (gesture) {
          setCurrentGesture(gesture);
          
          // Notify parent component about the detected gesture if we're in capturing mode
          if (isCapturing && !isCountingDown) {
            onGestureDetected(gesture as Choice);
          }
        } else {
          setCurrentGesture(null);
        }
        
        // Draw hand landmarks
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          if (landmarks) {
            drawHandLandmarks(ctx, landmarks as any, gesture);
          }
        }
        
        lastCaptureTime = timestamp;
      }
      
      // Continue the detection loop
      animationFrameId = requestAnimationFrame(detectHands);
    };
    
    animationFrameId = requestAnimationFrame(detectHands);
    
    // Clean up
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, handposeModel, isCapturing, isCountingDown, onGestureDetected]);

  // Update canvas dimensions when video dimensions change
  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleResize);
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleResize);
      }
    };
  }, []);

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
