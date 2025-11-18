"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/form/form-item";

export type NumberInputProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  placeholder?: string;
};

export default function NumberInput({ label, htmlFor, required, placeholder }: NumberInputProps) {
  const field = useFieldContext<number>();
  const { isDirty, errors } = field.state.meta;

  return (
    <FormItem label={label} htmlFor={htmlFor} errors={isDirty && errors ? errors : undefined} required={required}>
      <Input
        type="number"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        required={required}
        placeholder={placeholder}
      />
    </FormItem>
  );
}
