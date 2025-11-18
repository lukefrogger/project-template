"use client";
import { useFieldContext } from "@/hooks/form-context";
import { FormItem } from "@/components/form/form-item";
import { SelectItem, SelectGroup } from "../ui/select";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { TextInputProps } from "./text-input";

type SelectOption_T = {
  label: string;
  value: string;
};

type FormSelectProps_T = TextInputProps & {
  options: SelectOption_T[];
  disabled?: boolean;
  helpText?: string;
};

export default function SelectPickList({ label, htmlFor, options, required, disabled }: FormSelectProps_T) {
  const field = useFieldContext<string>();
  const { isDirty, errors } = field.state.meta;

  const showErrors = isDirty && errors;

  return (
    <FormItem label={label} htmlFor={htmlFor} errors={showErrors ? errors : undefined} required={required} >
      <Select
        defaultValue={field.state.value}
        onValueChange={field.handleChange}
        name={field.name}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder="Select an option..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
