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
      <div className="grid grid-cols-2 gap-3 mt-4">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSelect(option)}
            disabled={disabled}
            className="rounded-lg px-5 py-3 text-base font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            {option}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="rounded-lg px-4 py-3 text-sm hover:bg-accent"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};
