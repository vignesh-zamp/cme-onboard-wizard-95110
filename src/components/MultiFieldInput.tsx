import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Field {
  name: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
}

interface MultiFieldInputProps {
  fields: Field[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
}

export const MultiFieldInput = ({ 
  fields, 
  onSubmit, 
  disabled = false 
}: MultiFieldInputProps) => {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFilled = fields.every(field => values[field.name]?.trim());
    if (allFilled && !disabled) {
      onSubmit(values);
      setValues(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
    }
  };

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const allFilled = fields.every(field => values[field.name]?.trim());

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <div className="flex gap-3 items-start">
        <div className="flex-1 grid grid-cols-2 gap-3">
          {fields.map((field) => (
            <Input
              key={field.name}
              type={field.type || "text"}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              className="h-12 text-base"
            />
          ))}
        </div>
        <Button
          type="submit"
          disabled={!allFilled || disabled}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};
