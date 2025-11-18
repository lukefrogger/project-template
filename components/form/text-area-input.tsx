"use client";
import { useFieldContext } from "@/hooks/form-context";
import { FormItem } from "@/components/form/form-item";
import { Textarea } from "../ui/textarea";

export type TextInputProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
};

export default function TextAreaInput({ label, htmlFor, required, placeholder, helpText, maxLength }: TextInputProps) {
  const field = useFieldContext<string>();
  const { isDirty, errors } = field.state.meta;

  return (
    <FormItem
      label={label}
      htmlFor={htmlFor}
      errors={isDirty && errors ? errors : undefined}
      required={required}
      helpText={helpText}
      trimErrorMsg={Boolean(maxLength)}
    >
      <Textarea
        className="grow-1"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </FormItem>
  );
}
