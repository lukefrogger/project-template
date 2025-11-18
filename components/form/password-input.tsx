"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/form/form-item";
import { useState } from "react";
import { TextInputProps } from "./text-input";

export default function PasswordInput({ label, htmlFor, required = true, placeholder }: TextInputProps) {
  const [canShowErrors, setCanShowErrors] = useState(false);

  const field = useFieldContext<string>();
  const { isDirty, errors } = field.state.meta;

  const showErrors = canShowErrors && isDirty && errors;

  return (
    <FormItem label={label} htmlFor={htmlFor} errors={showErrors ? errors : undefined} required={required}>
      <Input
        type="password"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={() => setCanShowErrors(true)}
        onChange={(e) => field.handleChange(e.target.value)}
        required={required}
        autoComplete="current-password"
        placeholder={placeholder}
      />
    </FormItem>
  );
}
