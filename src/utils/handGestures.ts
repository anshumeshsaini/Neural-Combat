
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';

// Define custom gesture descriptions for rock, paper, scissors
const rockGesture = new fp.GestureDescription('rock');
const paperGesture = new fp.GestureDescription('paper');
const scissorsGesture = new fp.GestureDescription('scissors');

// Rock gesture - all fingers curled in
// Make rock detection more accurate by requiring full curl of all fingers
rockGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
rockGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);

rockGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

// Add direction constraints to help with rock detection
rockGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 0.5);
rockGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 0.5);

// Paper gesture - all fingers extended
paperGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);

// Add direction constraint to ensure palm facing camera
paperGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 0.7);

// Scissors gesture - index and middle extended, rest curled
// Improve scissors detection with more specific finger positions
scissorsGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
scissorsGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);

// Thumb can be half curled or no curl for scissors
scissorsGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.5);
scissorsGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.5);

// Ring and pinky must be fully curled for scissors
scissorsGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

// Strong direction requirements for scissors
scissorsGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.7);
scissorsGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 0.7);

// Initialize the gesture estimator with improved confidence threshold
export const gestureEstimator = new fp.GestureEstimator([
  rockGesture,
  paperGesture,
  scissorsGesture
]);

// Initialize TensorFlow.js with the WebGL backend
const initializeTensorFlow = async () => {
  console.log('Initializing TensorFlow.js...');
  // Register and initialize the WebGL backend
  await tf.setBackend('webgl');
  await tf.ready();
  console.log('TensorFlow backend initialized:', tf.getBackend());
};

// Load the handpose model
export const loadHandPoseModel = async () => {
  console.log('Starting TensorFlow initialization...');
  try {
    // First initialize TensorFlow.js
    await initializeTensorFlow();
    
    console.log('Loading HandPose model...');
    const model = await handpose.load();
    console.log('HandPose model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error initializing or loading model:', error);
    throw error;
  }
};

// Detect and analyze hand gestures with improved detection parameters
export const detectHandGesture = async (
  model: handpose.HandPose,
  video: HTMLVideoElement
): Promise<{ gesture: string | null; landmarks: handpose.Keypoint[] | null }> => {
  try {
    // Detect hand in the video frame
    const predictions = await model.estimateHands(video);
    
    if (predictions.length > 0) {
      // Get landmarks from the first detected hand
      const landmarks = predictions[0].landmarks;
      
      // Get gesture estimates with lower confidence threshold for better detection
      const gestureEstimates = gestureEstimator.estimate(landmarks, 7.5); // Lower threshold from 8.5 to 7.5
      
      if (gestureEstimates.gestures.length > 0) {
        // Get the gesture with highest confidence
        const gesture = gestureEstimates.gestures.reduce((prev, curr) => {
          return prev.score > curr.score ? prev : curr;
        });
        
        console.log("Detected gesture:", gesture.name, "with confidence:", gesture.score);
        
        return {
          gesture: gesture.name,
          landmarks
        };
      } else {
        console.log("Hand detected but no matching gesture found");
      }
    }
    
    // No hands or no recognized gesture
    return { gesture: null, landmarks: null };
  } catch (error) {
    console.error('Error detecting hand gesture:', error);
    return { gesture: null, landmarks: null };
  }
};

// Utility function to draw hand landmarks on canvas
export const drawHandLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: handpose.Keypoint[],
  gesture: string | null
) => {
  if (!landmarks) return;

  // Draw keypoints
  for (const point of landmarks) {
    const x = point[0];
    const y = point[1];

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    
    // Change colors based on detected gesture
    switch(gesture) {
      case 'rock':
        ctx.fillStyle = '#6D28D9'; // Purple
        break;
      case 'paper':
        ctx.fillStyle = '#06B6D4'; // Cyan
        break;
      case 'scissors':
        ctx.fillStyle = '#EC4899'; // Pink
        break;
      default:
        ctx.fillStyle = 'white';
    }
    
    ctx.fill();
  }

  // Draw connections
  const fingerJoints = [
    // Thumb
    [0, 1], [1, 2], [2, 3], [3, 4],
    // Index finger
    [0, 5], [5, 6], [6, 7], [7, 8],
    // Middle finger
    [0, 9], [9, 10], [10, 11], [11, 12],
    // Ring finger
    [0, 13], [13, 14], [14, 15], [15, 16],
    // Pinky
    [0, 17], [17, 18], [18, 19], [19, 20]
  ];

  for (const [start, end] of fingerJoints) {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    ctx.beginPath();
    ctx.moveTo(startPoint[0], startPoint[1]);
    ctx.lineTo(endPoint[0], endPoint[1]);
    
    // Change line colors based on gesture
    switch(gesture) {
      case 'rock':
        ctx.strokeStyle = '#6D28D9';
        break;
      case 'paper':
        ctx.strokeStyle = '#06B6D4';
        break;
      case 'scissors':
        ctx.strokeStyle = '#EC4899';
        break;
      default:
        ctx.strokeStyle = 'white';
    }
    
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};
