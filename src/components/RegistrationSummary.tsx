import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SummarySection {
  title: string;
  items: { label: string; value: string }[];
}

interface RegistrationSummaryProps {
  sections: SummarySection[];
  firmName: string;
}

export const RegistrationSummary = ({ sections, firmName }: RegistrationSummaryProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
        <h3 className="font-semibold text-lg mb-1">Registration Summary</h3>
        <p className="text-sm text-muted-foreground">
          Review your onboarding journey for <span className="font-medium text-foreground">{firmName}</span>
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <Card key={idx} className="p-4 bg-card border-border">
            <div className="flex items-start gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <h4 className="font-semibold text-base">{section.title}</h4>
            </div>
            <div className="space-y-2 ml-7">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                  <span className="text-muted-foreground font-medium">{item.label}:</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
