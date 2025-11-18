"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MagnifyingGlass } from "@phosphor-icons/react";

export type SearchInputProps_T = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  onSearch?: (value: string) => void;
};

export function SearchInput({
  placeholder = "Search AMGA Members...",
  value,
  onChange,
  className,
  onSearch,
  ...props
}: SearchInputProps_T & Omit<React.ComponentProps<"input">, "onChange">) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch && value) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primitive-light">
        <MagnifyingGlass size={16} />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="pl-8 border-neutral-300 bg-white"
        {...props}
      />
    </div>
  );
}
