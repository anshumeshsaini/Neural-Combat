
declare module '@tensorflow-models/handpose' {
  export interface Keypoint {
    0: number; // x coordinate
    1: number; // y coordinate
    2: number; // z coordinate (depth)
  }

  export interface FingerLandmark {
    landmarks: Keypoint[];
  }

  export interface HandPoseEstimate {
    landmarks: Keypoint[];
    annotations: {
      thumb: Keypoint[];
      indexFinger: Keypoint[];
      middleFinger: Keypoint[];
      ringFinger: Keypoint[];
      pinky: Keypoint[];
      palmBase: Keypoint[];
    };
    boundingBox: {
      topLeft: [number, number];
      bottomRight: [number, number];
    };
  }

  export class HandPose {
    constructor();
    estimateHands(
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageData,
      flipHorizontal?: boolean
    ): Promise<HandPoseEstimate[]>;
  }

  export function load(config?: {
    modelUrl?: string;
    detectionConfidence?: number;
  }): Promise<HandPose>;
}
