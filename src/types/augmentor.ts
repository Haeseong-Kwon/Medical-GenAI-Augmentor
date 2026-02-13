export type JobStatus = 'pending' | 'generating' | 'completed' | 'failed';

export type AugmentationModel = 'GAN' | 'Diffusion';

export interface AugmentationJob {
  id: string;
  createdAt: string;
  status: JobStatus;
  model: AugmentationModel;
  sampleCount: number;
  prompt: string;
  progress: number; // 0 to 100
}

export interface SyntheticSample {
  id: string;
  jobId: string;
  imageUrl: string;
  fidScore: number;
  metadata?: Record<string, any>;
  createdAt: string;
}
