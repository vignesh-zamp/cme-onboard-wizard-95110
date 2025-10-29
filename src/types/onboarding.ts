export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  firmName: string;
  answers: Record<string, any>;
  isSwapsSelected: boolean;
  isCanadaEligible: boolean;
}

export interface PlatformRecommendation {
  platform: string;
  reasoning: string[];
  confidence: 'high' | 'medium';
}

export interface ChatMessage {
  id: string;
  type: 'agent' | 'user' | 'system';
  content: string;
  timestamp: Date;
  options?: string[];
  validation?: {
    status: 'pending' | 'success' | 'error' | 'warning';
    message?: string;
    details?: string;
  };
  recommendation?: PlatformRecommendation;
  showComparison?: boolean;
  inputType?: "text" | "address" | "multifield" | "select" | "multiselect" | "country-dropdown" | "entity-registration" | "file-upload" | "none";
  inputFields?: { name: string; placeholder: string; type?: "text" | "email" | "tel" }[];
  selectOptions?: string[];
  multiselectOptions?: string[];
  summary?: { sections: { title: string; items: { label: string; value: string }[] }[]; firmName: string };
  showBackButton?: boolean;
  fileUploadConfig?: {
    acceptedTypes: string;
    bucketName: string;
    label: string;
  };
}

export interface Step {
  id: number;
  title: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'upload' | 'boolean' | 'dropdown' | 'country-dropdown' | 'entity-registration' | 'multifield';
  options?: string[];
  inputFields?: { name: string; placeholder: string; type?: "text" | "email" | "tel" }[];
  validation?: (value: any, state: OnboardingState) => boolean;
  conditional?: (state: OnboardingState) => boolean;
  helpText?: string;
}
