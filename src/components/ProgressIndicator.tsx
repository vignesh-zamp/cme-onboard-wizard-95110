import { OnboardingState } from "@/types/onboarding";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  state: OnboardingState;
}

export const ProgressIndicator = ({ state }: ProgressIndicatorProps) => {
  const progress = (state.currentStep / state.totalSteps) * 100;
  
  return (
    <div className="w-full bg-card border-b border-border px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              New Firm Registration
            </h2>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Step {state.currentStep} of {state.totalSteps}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {state.firmName && (
          <p className="text-xs text-muted-foreground mt-2">
            Registering: <span className="font-medium text-foreground">{state.firmName}</span>
          </p>
        )}
      </div>
    </div>
  );
};
