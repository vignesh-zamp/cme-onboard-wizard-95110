import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PlatformComparisonProps {
  onSelect: (platform: string) => void;
}

export const PlatformComparison = ({ onSelect }: PlatformComparisonProps) => {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* CME ClearPort */}
        <Card 
          className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
          onClick={() => onSelect("CME ClearPort")}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">CME ClearPort</h3>
            <p className="text-sm text-muted-foreground">
              Optimized for OTC products and post-trade processing
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">OTC Interest Rate Swaps</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">OTC FX & Commodity Swaps</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Block trades and bilateral transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Specialized reporting and clearing</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Best for:</strong> Firms focused on OTC derivatives and post-trade workflows
              </p>
            </div>
          </div>
        </Card>

        {/* CME Direct */}
        <Card 
          className="p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary"
          onClick={() => onSelect("CME Direct")}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">CME Direct</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive access to exchange-traded products
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Futures on commodities, rates, equity indices</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Exchange-traded Options</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">FX & Energy products</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Real-time market access</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Best for:</strong> Firms trading exchange-listed futures and options
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Click on either platform to continue with your registration
      </p>
    </div>
  );
};
