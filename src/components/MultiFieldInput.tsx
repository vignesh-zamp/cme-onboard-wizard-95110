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

  // Group fields by contact (Contact 1 vs Contact 2)
  const contact1Fields = fields.filter(field => 
    field.name.toLowerCase().includes('contact1') || 
    field.placeholder.toLowerCase().includes('contact 1')
  );
  const contact2Fields = fields.filter(field => 
    field.name.toLowerCase().includes('contact2') || 
    field.placeholder.toLowerCase().includes('contact 2')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact 1 Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact 1</h3>
          {contact1Fields.map((field) => (
            <Input
              key={field.name}
              type={field.type || "text"}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required
              className="w-full text-base py-6 rounded-xl border-input bg-background"
            />
          ))}
        </div>

        {/* Contact 2 Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact 2</h3>
          {contact2Fields.map((field) => (
            <Input
              key={field.name}
              type={field.type || "text"}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              required
              className="w-full text-base py-6 rounded-xl border-input bg-background"
            />
          ))}
        </div>
      </div>
      <Button
        type="submit"
        disabled={disabled || !allFilled}
        className="w-full py-6 rounded-xl text-base"
      >
        Continue
      </Button>
    </form>
  );
};
