"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/form/form-item";
import { TextInputProps } from "./text-input";

export default function DollarInput({
  label,
  htmlFor,
  required,
  placeholder,
  helpText,
  readOnly,
  disabled,
  minAmount,
}: TextInputProps & { minAmount?: number }) {
  const field = useFieldContext<number>();
  const { isDirty, errors } = field.state.meta;

  return (
    <FormItem
      label={label}
      htmlFor={htmlFor}
      errors={isDirty && errors ? errors : undefined}
      required={required}
      helpText={helpText}
    >
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          readOnly={readOnly}
          type="number"
          step="1.0"
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(Number(e.target.value))}
          required={required}
          placeholder={placeholder}
          min={minAmount || 0}
          disabled={disabled}
          className="pl-6"
        />
      </div>
    </FormItem>
  );
}
