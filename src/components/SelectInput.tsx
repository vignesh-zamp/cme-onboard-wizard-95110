import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface SelectInputProps {
  options: string[];
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectInput = ({ 
  options, 
  onSubmit, 
  disabled = false,
  placeholder = "Select an option..."
}: SelectInputProps) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <Select value={value} onValueChange={setValue} disabled={disabled}>
        <SelectTrigger className="w-full text-base py-6 rounded-xl border-input bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50 max-h-[300px] shadow-lg">
          {options.map((option, index) => (
            <SelectItem 
              key={index} 
              value={option}
              className="text-base py-3 cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="submit"
        disabled={disabled || !value}
        className="w-full rounded-xl py-6 text-base font-medium"
      >
        Continue
      </Button>
    </form>
  );
};
