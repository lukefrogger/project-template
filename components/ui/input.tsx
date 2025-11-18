import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, onChange, onBlur, value, ...props }: React.ComponentProps<"input">) {
  // Handle number inputs specifically to allow for empty values
  const [internalValue, setInternalValue] = React.useState<string>(value?.toString() || "");

  // Only apply special handling for number inputs
  if (type === "number") {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      // Allow empty string or valid numbers (including negative and decimals)
      if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
        setInternalValue(val);

        // Call original onChange with appropriate type
        if (onChange) {
          // Create a clone of the event to modify the value
          const syntheticEvent = { ...e } as React.ChangeEvent<HTMLInputElement>;
          const target = { ...e.target, value: val } as HTMLInputElement;
          syntheticEvent.target = target;
          onChange(syntheticEvent);
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // On blur, convert to number if needed
      if (onBlur) {
        const syntheticEvent = { ...e } as React.FocusEvent<HTMLInputElement>;
        // Pass the raw string, let the form handler decide if it wants to convert
        onBlur(syntheticEvent);
      }
    };

    return (
      <input
        type="text"
        inputMode="numeric"
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-neutral-400 selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-lg border bg-transparent px-4 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-9 file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    );
  }

  // For all other input types, use the default behavior
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-neutral-400 selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-lg border bg-transparent px-4 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-9 file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      {...props}
    />
  );
}

export { Input };
