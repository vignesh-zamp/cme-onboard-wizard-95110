import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultiSelectInputProps {
  options: string[];
  onSubmit: (values: string[]) => void;
  disabled?: boolean;
}

export const MultiSelectInput = ({ 
  options, 
  onSubmit, 
  disabled = false 
}: MultiSelectInputProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedValues([...selectedValues, option]);
    } else {
      setSelectedValues(selectedValues.filter(v => v !== option));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedValues.length > 0) {
      onSubmit(selectedValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-3 bg-muted/30 p-4 rounded-xl">
        {options.map((option, index) => (
          <div key={index} className="flex items-start space-x-3 py-2">
            <Checkbox
              id={`option-${index}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
              disabled={disabled}
              className="mt-0.5"
            />
            <Label
              htmlFor={`option-${index}`}
              className="text-sm font-normal leading-relaxed cursor-pointer flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      
      {selectedValues.length > 0 && (
        <div className="text-sm text-muted-foreground px-2">
          {selectedValues.length} item{selectedValues.length > 1 ? 's' : ''} selected
        </div>
      )}
      
      <Button
        type="submit"
        disabled={disabled || selectedValues.length === 0}
        className="w-full rounded-xl py-6 text-base font-medium"
      >
        Continue
      </Button>
    </form>
  );
};
