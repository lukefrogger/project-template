"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/form/form-item";
import { useState } from "react";
import { TextInputProps } from "./text-input";

export const formatPhoneNumber = (value: string): string => {
  if (!value) return "";

  // Strip all non-numeric characters
  const phoneNumber = value.replace(/\D/g, "");

  // Apply formatting based on length
  if (phoneNumber.length < 4) {
    return phoneNumber;
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export default function PhoneInput({ label, htmlFor, required }: TextInputProps) {
  const [canShowErrors, setCanShowErrors] = useState(false);
  const field = useFieldContext<string>();
  const { isDirty, errors } = field.state.meta;

  const showErrors = canShowErrors && isDirty && errors;

  // Format the displayed value while maintaining the original value in state
  const displayValue = formatPhoneNumber(field.state.value);

  return (
    <FormItem label={label} htmlFor={htmlFor} errors={showErrors ? errors : undefined} required={required}>
      <Input
        type="tel"
        id={field.name}
        name={field.name}
        value={displayValue}
        onBlur={() => setCanShowErrors(true)}
        onChange={(e) => {
          // Store only the numeric values in the field state
          const numericValue = e.target.value.replace(/\D/g, "");
          field.handleChange(numericValue);
        }}
        placeholder="(000) 000-0000"
        required={required}
        autoComplete="tel"
      />
    </FormItem>
  );
}
