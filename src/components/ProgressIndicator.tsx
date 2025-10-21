import { OnboardingState } from "@/types/onboarding";
import { Circle, CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  state: OnboardingState;
}

const steps = [
  "About you",
  "Company details",
  "Trading info",
  "Review"
];

export const ProgressIndicator = ({ state }: ProgressIndicatorProps) => {
  const getStepStatus = (stepIndex: number) => {
    const stepNumber = stepIndex + 1;
    const stepsPerSection = Math.ceil(state.totalSteps / steps.length);
    const currentSection = Math.ceil(state.currentStep / stepsPerSection);
    
    if (stepNumber < currentSection) return "complete";
    if (stepNumber === currentSection) return "active";
    return "upcoming";
  };

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {status === "complete" ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle
                  className={`w-5 h-5 ${
                    status === "active" ? "text-primary fill-primary" : "text-muted-foreground"
                  }`}
                />
              )}
            </div>
            <span
              className={`text-sm ${
                status === "active"
                  ? "text-foreground font-medium"
                  : status === "complete"
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
