import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface CountryDropdownInputProps {
  onSubmit: (values: { country: string; crossBorder: string }) => void;
  disabled?: boolean;
}

export const CountryDropdownInput = ({ 
  onSubmit, 
  disabled = false 
}: CountryDropdownInputProps) => {
  const [country, setCountry] = useState<string>("");
  const [crossBorder, setCrossBorder] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && crossBorder) {
      onSubmit({ country, crossBorder });
    }
  };

  const allFilled = country && crossBorder;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Primary Jurisdiction (Country of Incorporation)
          </label>
          <Select value={country} onValueChange={setCountry} disabled={disabled}>
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

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Cross-Border Operations
          </label>
          <Select value={crossBorder} onValueChange={setCrossBorder} disabled={disabled}>
            <SelectTrigger className="w-full text-base py-6 rounded-xl border-input bg-background">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50 shadow-lg">
              <SelectItem 
                value="Yes"
                className="text-base py-3 cursor-pointer hover:bg-accent focus:bg-accent"
              >
                Yes
              </SelectItem>
              <SelectItem 
                value="No"
                className="text-base py-3 cursor-pointer hover:bg-accent focus:bg-accent"
              >
                No
              </SelectItem>
              <SelectItem 
                value="N/A"
                className="text-base py-3 cursor-pointer hover:bg-accent focus:bg-accent"
              >
                N/A
              </SelectItem>
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
