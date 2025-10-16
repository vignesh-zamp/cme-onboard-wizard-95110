import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformRecommendationProps {
  recommendation: {
    platform: string;
    reasoning: string[];
    confidence: 'high' | 'medium';
  };
}

export const PlatformRecommendation = ({ recommendation }: PlatformRecommendationProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            AI-Powered Recommendation
          </h3>
          <p className="text-sm text-muted-foreground">
            Based on your business profile and requirements
          </p>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            recommendation.confidence === 'high' 
              ? "bg-success/20 text-success"
              : "bg-warning/20 text-warning"
          )}
        >
          {recommendation.confidence === 'high' ? '95% Match' : '78% Match'}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">
            Recommended Platform:
          </h4>
        </div>
        <p className="text-2xl font-bold text-primary ml-7">
          {recommendation.platform}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Why this recommendation:</h4>
        {recommendation.reasoning.map((reason, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">{reason}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          💡 You can still choose a different option if you prefer, but this setup is optimized for your specific needs.
        </p>
      </div>
    </Card>
  );
};
