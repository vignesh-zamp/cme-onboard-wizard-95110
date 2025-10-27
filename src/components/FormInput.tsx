import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";

interface FormInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  onBack?: () => void;
  showBackButton?: boolean;
}

export const FormInput = ({ 
  onSubmit, 
  disabled = false,
  placeholder = "Type your answer...",
  type = "text",
  onBack,
  showBackButton = false
}: FormInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
      <Input
        type={type}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full text-base py-6 rounded-xl border-input bg-background"
      />
      <div className="flex gap-2">
        {showBackButton && onBack && (
          <Button 
            type="button"
            onClick={onBack}
            variant="outline"
            className="px-6 py-6 rounded-xl text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={disabled || !input.trim()} 
          className="flex-1 py-6 rounded-xl text-base"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
