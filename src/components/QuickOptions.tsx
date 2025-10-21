import { Button } from "@/components/ui/button";

interface QuickOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const QuickOptions = ({ options, onSelect, disabled }: QuickOptionsProps) => {
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
