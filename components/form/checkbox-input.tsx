"use client";
import { useFieldContext } from "@/hooks/form-context";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { InputError } from "./input-error";
import { CheckedState } from "@radix-ui/react-checkbox";

export type CheckboxInputProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  description?: string;
};

export default function TextInput({ label, htmlFor, description, required }: CheckboxInputProps) {
  const field = useFieldContext<boolean>();
  const { isDirty, errors } = field.state.meta;

  const showError = isDirty && errors;

  // Convert CheckedState to boolean
  const handleCheckedChange = (checked: CheckedState) => {
    field.handleChange(checked === true);
  };

  return (
    <div className="items-top flex gap-x-2">
      <Checkbox id={htmlFor} required={required} checked={field.state.value} onCheckedChange={handleCheckedChange} />
      <div className="grid gap-1.5 mt-[3px]">
        <Label htmlFor={htmlFor} className="m-0">
          {label}
        </Label>
        {description && <p className="text-sm text-muted-foreground leading-none">{description}</p>}
        <div className={`${showError ? "h-auto" : "h-0"}`}>
          {errors?.map((error: { message: string }) => <InputError key={error.message}>{error.message}</InputError>)}
        </div>
      </div>
    </div>
  );
}
