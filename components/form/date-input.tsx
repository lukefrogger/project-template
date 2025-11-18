"use client";
import { useFieldContext } from "@/hooks/form-context";
import { FormItem } from "@/components/form/form-item";
import { TextInputProps } from "./text-input";
import { useState } from "react";
import { BetterDatePicker } from "../ui/date-picker";

export default function DatePicker({ label, htmlFor, required, helpText }: TextInputProps) {
  const [isTouched, setIsTouched] = useState(false);
  const field = useFieldContext<string>();
  const { errors } = field.state.meta;

  const handleChange = (date: any) => {
    if (date) {
      setIsTouched(true);
    }
    field.handleChange(date?.toISOString() ?? "");
  };

  return (
    <FormItem
      label={label}
      htmlFor={htmlFor}
      errors={isTouched ? errors : undefined}
      required={required}
      helpText={helpText}
    >
      <BetterDatePicker
        onChange={handleChange}
        defaultValue={field.state.value ? new Date(field.state.value) : undefined}
      />
    </FormItem>
  );
}
