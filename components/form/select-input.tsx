"use client";
import { SelectItem, SelectGroup } from "../ui/select";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption_T = {
  label: string;
  value: string;
};

type FormSelectProps_T = {
  defaultValue?: string;
  options: SelectOption_T[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  name: string;
};

export default function SelectInput({
  options,
  defaultValue,
  placeholder,
  required,
  onChange,
  name,
}: FormSelectProps_T) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange} name={name} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Select an option..."} />
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
  );
}
