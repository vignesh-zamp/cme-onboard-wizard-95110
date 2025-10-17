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
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="flex gap-3 items-center">
        <Input
          type={type}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-12 text-base"
        />
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};
