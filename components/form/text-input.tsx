"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/form/form-item";

export type TextInputProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function TextInput({
  label,
  htmlFor,
  required,
  placeholder,
  helpText,
  readOnly,
  disabled,
}: TextInputProps) {
  const field = useFieldContext<string>();
  const { isDirty, errors } = field.state.meta;

  return (
    <FormItem
      label={label}
      htmlFor={htmlFor}
      errors={isDirty && errors ? errors : undefined}
      required={required}
      helpText={helpText}
    >
      <Input
        readOnly={readOnly}
        type="text"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
    </FormItem>
  );
}
