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
  const containerRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [detectionConfidence, setDetectionConfidence] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  
  // FPS calculation
  const frameTimes = useRef<number[]>([]);
  const lastFpsUpdate = useRef(0);
  
  // Request camera access
  const startCamera = async (deviceId?: string) => {
    try {
      console.log('Starting camera...');
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : 'user',
          deviceId: deviceId ? { exact: deviceId } : undefined
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
      }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera...');
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCurrentGesture(null);
    setCameraReady(false);
  };

  // Get available camera devices
  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameraDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  // Switch camera
  const switchCamera = (deviceId: string) => {
    stopCamera();
    setSelectedCamera(deviceId);
    startCamera(deviceId);
  };

  // Effect for handling camera activation/deactivation
  useEffect(() => {
    if (isActive) {
      getCameraDevices();
      startCamera(selectedCamera);
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive, selectedCamera]);

  // Effect for hand gesture detection loop
  useEffect(() => {
    if (!isActive || !handposeModel || !videoRef.current || !canvasRef.current || !cameraReady) {
      return;
    }
    
    console.log('Starting hand detection loop with model:', handposeModel ? 'loaded' : 'not loaded');
    
    let animationFrameId: number;
    let lastCaptureTime = 0;
    const captureInterval = 100; // ms between detections
    const gestureConfirmationThreshold = 3; // Number of consistent detections to confirm
    const gestureHistory: {gesture: string, confidence: number}[] = [];
    
    const detectHands = async (timestamp: number) => {
      // Calculate FPS
      const now = performance.now();
      frameTimes.current.push(now);
      while (frameTimes.current.length > 0 && now - frameTimes.current[0] > 1000) {
        frameTimes.current.shift();
      }
      setFps(frameTimes.current.length);
      
      if (!videoRef.current || !canvasRef.current || !handposeModel || !cameraReady) return;
      
      try {
        // Clear the canvas first
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        // Only detect if enough time has passed
        if (timestamp - lastCaptureTime > captureInterval) {
          const { gesture, landmarks, confidence } = await detectHandGesture(handposeModel, videoRef.current);
          
          if (gesture) {
            // Add to gesture history
            gestureHistory.push({gesture, confidence});
            if (gestureHistory.length > gestureConfirmationThreshold) {
              gestureHistory.shift();
            }
            
            // Get most confident gesture
            const bestGesture = getBestGesture(gestureHistory);
            if (bestGesture) {
              setCurrentGesture(bestGesture.gesture);
              setDetectionConfidence(Math.floor(bestGesture.confidence * 100));
              
              // Notify parent component
              if (isCapturing && !isCountingDown) {
                onGestureDetected(bestGesture.gesture as Choice);
              }
            }
          } else {
            setDetectionConfidence(0);
            if (gestureHistory.length > 0) {
              gestureHistory.length = 0;
              if (timestamp - lastCaptureTime > 1000) {
                setCurrentGesture(null);
              }
            }
          }
          
          // Draw landmarks if enabled
          if (showLandmarks && landmarks && ctx) {
            drawHandLandmarks(ctx, landmarks, gesture);
          }
          
          lastCaptureTime = timestamp;
        }
      } catch (error) {
        console.error('Error in hand detection loop:', error);
      }
      
      animationFrameId = requestAnimationFrame(detectHands);
    };
    
    animationFrameId = requestAnimationFrame(detectHands);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, handposeModel, isCapturing, isCountingDown, cameraReady, showLandmarks]);

  // Helper to get best gesture from history
  const getBestGesture = (history: {gesture: string, confidence: number}[]) => {
    if (history.length === 0) return null;
    
    // Group by gesture and keep highest confidence per gesture
    const bestOfEach = history.reduce((acc, current) => {
      if (!acc[current.gesture] || current.confidence > acc[current.gesture].confidence) {
        acc[current.gesture] = current;
      }
      return acc;
    }, {} as Record<string, {gesture: string, confidence: number}>);
    
    // Return gesture with highest confidence
    return Object.values(bestOfEach).sort((a, b) => b.confidence - a.confidence)[0];
  };

  // Dynamic border effect based on detection confidence
  const getBorderEffect = () => {
    if (!isActive) return '';
    if (isCapturing) return 'ring-4 ring-purple-500 animate-pulse';
    if (currentGesture) {
      const intensity = Math.min(10, Math.floor(detectionConfidence / 10));
      return `ring-${intensity} ring-green-500/50`;
    }
    return 'ring-2 ring-gray-500/30';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-6" ref={containerRef}>
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-900/80 to-black/90 rounded-xl z-20 p-6 backdrop-blur-sm">
          <div className="bg-red-900/90 p-6 rounded-xl shadow-2xl border border-red-700 max-w-md">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Camera Error
            </h3>
            <p className="text-red-100 mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-white/90 text-red-900 rounded-lg font-medium hover:bg-white transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Camera inactive overlay */}
      {!isActive && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10 backdrop-blur-sm">
          <div className="text-center p-6 bg-black/60 rounded-lg border border-gray-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-200 mb-1">Camera Disabled</h3>
            <p className="text-gray-400">Enable camera to start gesture detection</p>
          </div>
        </div>
      )}

      {/* Main camera view */}
      <div className={`relative overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${getBorderEffect()}`}>
        <video 
          ref={videoRef}
          className={`w-full bg-black aspect-video ${mirrorMode ? 'scale-x-[-1]' : ''}`}
          playsInline
          muted
        />
        {showLandmarks && (
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: mirrorMode ? 'scaleX(-1)' : 'none' }}
          />
        )}
        
        {/* Stats overlay */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 flex gap-4 text-xs">
          <div className="flex items-center gap-1 text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span>{fps} FPS</span>
          </div>
          {currentGesture && (
            <div className="flex items-center gap-1 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{detectionConfidence}%</span>
            </div>
          )}
        </div>
        
        {/* Gesture indicator */}
        {currentGesture && (
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
            <span className="text-white font-medium">
              <span className="opacity-80">Detected:</span> <span className="font-bold">{currentGesture.toUpperCase()}</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        )}
        
        {/* Settings button */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-2 rounded-full transition-all"
          aria-label="Camera settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Settings panel */}
      {showSettings && isActive && (
        <div className="absolute top-16 right-3 bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl z-20 p-4 w-64 border border-gray-700/50 animate-slide-down">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-white">Camera Settings</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Camera selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Camera</label>
              <select 
                value={selectedCamera}
                onChange={(e) => switchCamera(e.target.value)}
                className="w-full bg-gray-800/90 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {cameraDevices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Mirror mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Mirror Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={mirrorMode}
                  onChange={() => setMirrorMode(!mirrorMode)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            {/* Landmarks toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Landmarks</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showLandmarks}
                  onChange={() => setShowLandmarks(!showLandmarks)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Webcam;