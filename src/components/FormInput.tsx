import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface FormInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
}

export const FormInput = ({ 
  onSubmit, 
  disabled = false,
  placeholder = "Type your answer...",
  type = "text"
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
      <Button 
        type="submit" 
        disabled={disabled || !input.trim()} 
        className="w-full py-6 rounded-xl text-base"
      >
        Continue
      </Button>
    </form>
  );
};
