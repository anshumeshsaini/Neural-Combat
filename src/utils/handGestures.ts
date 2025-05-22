
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';

// Define custom gesture descriptions for rock, paper, scissors
const rockGesture = new fp.GestureDescription('rock');
const paperGesture = new fp.GestureDescription('paper');
const scissorsGesture = new fp.GestureDescription('scissors');

// Rock gesture - all fingers curled in
rockGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.5);
rockGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.5);

rockGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
rockGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

// Paper gesture - all fingers extended
paperGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);

paperGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
paperGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);

// Scissors gesture - index and middle extended, rest curled
scissorsGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
scissorsGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);

scissorsGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

// A little extra direction requirement for scissors
scissorsGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 0.7);
scissorsGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 0.7);

// Small angles between index and middle fingers are preferred for scissors
scissorsGesture.addAngle(fp.Finger.Index, fp.Finger.Middle, 0, 0.9);

// Initialize the gesture estimator
export const gestureEstimator = new fp.GestureEstimator([
  rockGesture,
  paperGesture,
  scissorsGesture
]);

// Load the handpose model
export const loadHandPoseModel = async () => {
  console.log('Loading HandPose model...');
  return await handpose.load();
};

// Detect and analyze hand gestures
export const detectHandGesture = async (
  model: handpose.HandPose,
  video: HTMLVideoElement
): Promise<{ gesture: string | null; landmarks: handpose.Keypoint[][] | null }> => {
  try {
    // Detect hand in the video frame
    const predictions = await model.estimateHands(video);
    
    if (predictions.length > 0) {
      // Get landmarks from the first detected hand
      const landmarks = predictions[0].landmarks;
      
      // Get gesture estimates
      const gestureEstimates = gestureEstimator.estimate(landmarks, 8.5); // 8.5 is the confidence threshold
      
      if (gestureEstimates.gestures.length > 0) {
        // Get the gesture with highest confidence
        const gesture = gestureEstimates.gestures.reduce((prev, curr) => {
          return prev.score > curr.score ? prev : curr;
        });
        
        return {
          gesture: gesture.name,
          landmarks
        };
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
