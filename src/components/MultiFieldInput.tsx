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

  // Check if this is a two-person contact form (billing contacts or VOs)
  const isContactForm = fields.some(field => 
    field.name.includes('contact1') || field.name.includes('contact2') ||
    field.name.includes('vo1') || field.name.includes('vo2')
  );

  // Group fields by person if it's a contact form
  const group1Fields = isContactForm ? fields.filter(field => 
    field.name.includes('contact1') || field.name.includes('vo1')
  ) : [];
  
  const group2Fields = isContactForm ? fields.filter(field => 
    field.name.includes('contact2') || field.name.includes('vo2')
  ) : [];

  // Determine labels based on field names
  const group1Label = fields[0]?.name.includes('vo') ? 'Verification Officer 1' : 'Contact 1';
  const group2Label = fields[0]?.name.includes('vo') ? 'Verification Officer 2' : 'Contact 2';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {isContactForm ? (
        // Two-column layout for contact/VO forms
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group 1 Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{group1Label}</h3>
            {group1Fields.map((field) => (
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

          {/* Group 2 Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{group2Label}</h3>
            {group2Fields.map((field) => (
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
      ) : (
        // Regular grid layout for other forms
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map((field) => (
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
      )}
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
