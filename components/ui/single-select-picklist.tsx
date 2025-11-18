"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { useState } from "react";
import { useScreenWidth } from "@/hooks/use-screen-width";

export type SingleSelectOption_T = {
  label: string;
  value: string;
};

export function SingleSelectPickList({
  options,
  label,
  defaultValue,
  onChange,
  className,
  align,
  size = "default",
}: {
  options: SingleSelectOption_T[];
  label: string;
  defaultValue?: string;
  onChange: (selected: string) => void;
  className?: string;
  align?: "start" | "center" | "end";
  size?: "sm" | "default";
}) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || options[0]?.value || "");
  const { isSmaller } = useScreenWidth();

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  const computedAlign = isSmaller("lg") ? "center" : align || "start";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} size={size}>
          <ArrowsDownUp size={20} weight="regular" className="size-5" />
          <span className="whitespace-nowrap">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={computedAlign} alignOffset={0} sideOffset={4} className="min-w-36">
        <DropdownMenuRadioGroup value={selectedValue} onValueChange={handleSelect}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
