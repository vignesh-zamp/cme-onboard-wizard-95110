import { Button } from "@/components/ui/button";

interface QuickOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const QuickOptions = ({ options, onSelect, disabled }: QuickOptionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="text-sm hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
