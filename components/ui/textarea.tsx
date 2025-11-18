import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...allProps }: React.ComponentProps<"textarea">) {
  const { maxLength, ...props } = allProps;
  const isOverLimit = maxLength !== undefined && String(props.value).length > maxLength;
  return (
    <div className="relative">
      <textarea
        data-slot="textarea"
        rows={8}
        className={cn(
          "border-input placeholder:text-neutral-400 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          isOverLimit && "border-destructive ring-destructive/20",
          className,
        )}
        {...props}
      />
      {maxLength !== undefined && (
        <div
          className={cn("absolute right-0 mt-1 text-sm text-end", isOverLimit ? "text-error-600" : "text-black-500")}
        >
          {String(props.value).length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export { Textarea };
