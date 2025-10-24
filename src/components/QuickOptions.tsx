import { Button } from "@/components/ui/button";

interface QuickOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const QuickOptions = ({ options, onSelect, disabled }: QuickOptionsProps) => {
  // Check if this is a Yes/No question (boolean)
  const isYesNo = options.length === 2 && 
                  options.some(opt => opt.toLowerCase() === 'yes') && 
                  options.some(opt => opt.toLowerCase() === 'no');

  if (isYesNo) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSelect(option)}
            disabled={disabled}
            className="rounded-xl px-8 py-8 text-lg font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="rounded-xl px-6 py-6 text-base hover:bg-accent"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
