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
  inputType?: "text" | "address" | "multifield" | "select" | "country-dropdown" | "entity-registration" | "none";
  inputFields?: { name: string; placeholder: string; type?: "text" | "email" | "tel" }[];
  selectOptions?: string[];
  showBackButton?: boolean;
}

export interface Step {
  id: number;
  title: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'upload' | 'boolean' | 'dropdown' | 'country-dropdown' | 'entity-registration';
  options?: string[];
  validation?: (value: any, state: OnboardingState) => boolean;
  conditional?: (state: OnboardingState) => boolean;
  helpText?: string;
}
