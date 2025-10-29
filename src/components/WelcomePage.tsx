import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import cmeLogo from "@/assets/cme-logo.png";
import paceLogo from "@/assets/pace-logo.png";

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center mb-8">
          <img 
            src={cmeLogo} 
            alt="CME Group Logo" 
            className="h-16 sm:h-20 md:h-24 w-auto object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            Welcome to CME New Firm Registration
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Let's get you set up with the right trading platform for your needs. 
            We'll guide you through a quick onboarding process.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="group text-base px-8 py-6 h-auto hover-scale"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Quick Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Personalized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Secure</span>
          </div>
        </div>

        <div className="pt-12 border-t border-border/50 mt-12">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <img 
              src={paceLogo} 
              alt="Pace Logo" 
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
