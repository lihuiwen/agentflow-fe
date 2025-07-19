export interface FormData {
  jobTitle: string;
  category: string;
  description: string;
  deliverables: string;
  budget: { min: number; max: number };
  deadline: string;
  paymentType: 'fixed' | 'hourly' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  autoAssign: boolean;
  allowBidding: boolean;
  allowParallelExecution: boolean;
  escrowEnabled: boolean;
  isPublic: boolean;
}

export interface FormSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export interface Category {
  id: string;
  title: string;
}