"use client";

import { Label } from "@/components/ui/label";
import { InputError } from "./input-error";

type FormItemProps = {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  errors?: any[];
  required?: boolean;
  helpText?: string;
  trimErrorMsg?: boolean;
};

export function FormItem({ children, label, htmlFor, errors, required, helpText, trimErrorMsg }: FormItemProps) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {helpText && <div className="text-sm text-muted-foreground mb-1.5 -mt-1.5">{helpText}</div>}
      {children}
      <div className={`${errors && errors.length > 0 ? "h-auto" : "h-0"} ${trimErrorMsg ? "mr-16" : ""}`}>
        {errors?.map((error: { message: string }) => <InputError key={error.message}>{error.message}</InputError>)}
      </div>
    </div>
  );
}
