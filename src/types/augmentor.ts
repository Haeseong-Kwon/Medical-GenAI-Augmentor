export type JobStatus = 'pending' | 'generating' | 'completed' | 'failed';

export type AugmentationModel = 'GAN' | 'Diffusion';

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
}

export interface SyntheticSample {
  id: string;
  jobId: string;
  imageUrl: string;
  fidScore: number;
  label?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

