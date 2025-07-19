import { Job } from '@apis/model/Job';
import { Agent } from '@apis/model/Agents';
import { Feedback, FeedbackStats } from '@apis/model/Feedback';

export interface JobDetailProps {
  job: Job;
  agents?: Agent[];
  feedbacks?: Feedback[];
  feedbackStats?: FeedbackStats;
  agentsLoading?: boolean;
  feedbacksLoading?: boolean;
}

export interface StatusUpdateProps {
  job: Job;
  onStatusUpdate: (status: Job['status']) => void;
  isUpdating: boolean;
}

export interface FeedbackFormData {
  rating: number | null;
  comment: string;
  feedbackType: 'general' | 'quality' | 'communication' | 'timeline';
  isAnonymous: boolean;
  dimensions: {
    quality: number;
    communication: number;
    timeliness: number;
    professionalism: number;
  };
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}