export type JobStatus = 'pending' | 'generating' | 'completed' | 'failed';

export type AugmentationModel = 'GAN' | 'Diffusion';

export type ControlNetMode = 'canny' | 'depth';


export interface ControlNetParams {
  referenceImage?: string;
  mode: ControlNetMode;
  strength: number;
}

export interface ValidationRecord {
  isValid: boolean;
  score: number; // 1-5
  comment?: string;
  author: string;
  createdAt: string;
}

export interface AugmentationJob {
  id: string;
  createdAt: string;
  status: JobStatus;
  model: AugmentationModel;
  sampleCount: number;
  prompt: string;
  negativePrompt?: string;
  label?: string;
  guidanceScale: number;
  samplingSteps: number;
  seed: number;
  progress: number; // 0 to 100
  denoisingStep?: number;
  controlNet?: ControlNetParams;
}

export interface SyntheticSample {
  id: string;
  jobId: string;
  imageUrl: string;
  fidScore: number;
  label?: string;
  isValidated?: boolean;
  validation?: ValidationRecord;
  metadata?: Record<string, any>;
  createdAt: string;
}


