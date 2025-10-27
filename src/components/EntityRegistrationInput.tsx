import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common countries list
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "Hong Kong",
  "Switzerland",
  "Netherlands",
  "Ireland",
  "Luxembourg",
  "Belgium",
  "Spain",
  "Italy",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Austria",
  "Portugal",
  "Greece",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Slovenia",
  "Slovakia",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Malta",
  "Cyprus",
  "India",
  "China",
  "South Korea",
  "Taiwan",
  "Thailand",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Vietnam",
  "New Zealand",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "South Africa",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "Turkey",
  "Russia",
  "Ukraine",
  "Other"
].sort();

interface EntityRegistrationInputProps {
  onSubmit: (values: { legalName: string; jurisdiction: string }) => void;
  disabled?: boolean;
}

export const EntityRegistrationInput = ({ 
  onSubmit, 
  disabled = false 
}: EntityRegistrationInputProps) => {
  const [legalName, setLegalName] = useState<string>("");
  const [jurisdiction, setJurisdiction] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (legalName.trim() && jurisdiction) {
      onSubmit({ legalName: legalName.trim(), jurisdiction });
    }
  };

  const allFilled = legalName.trim() && jurisdiction;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Full Legal Name
          </label>
          <Input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder="Enter your firm's full legal name..."
            disabled={disabled}
            required
            className="w-full text-base py-6 rounded-xl border-input bg-background"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Jurisdiction of Incorporation
          </label>
          <Select value={jurisdiction} onValueChange={setJurisdiction} disabled={disabled}>
            <SelectTrigger className="w-full text-base py-6 rounded-xl border-input bg-background">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50 max-h-[300px] shadow-lg">
              {COUNTRIES.map((countryName) => (
                <SelectItem 
                  key={countryName} 
                  value={countryName}
                  className="text-base py-3 cursor-pointer hover:bg-accent focus:bg-accent"
                >
                  {countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={disabled || !allFilled}
        className="w-full rounded-xl py-6 text-base font-medium"
      >
        Continue
      </Button>
    </form>
  );
};
