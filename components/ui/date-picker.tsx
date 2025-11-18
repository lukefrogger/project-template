"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDots } from "@phosphor-icons/react";

export function BetterDatePicker({
  onChange,
  defaultValue,
  disableFuture = false,
}: {
  onChange: (date: Date | undefined) => void;
  defaultValue?: Date | undefined;
  disableFuture?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  const handleChange = (date: Date | undefined) => {
    setDate(date);
    onChange(date);
    setOpen(false);
  };

  const endMonth = React.useMemo(() => {
    if (disableFuture) {
      return new Date();
    }

    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    return fiveYearsFromNow;
  }, [disableFuture]);

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (disableFuture) {
        return date > new Date();
      }
      return false;
    },
    [disableFuture],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={`justify-between font-normal ${!date ? "text-primitive-light" : ""}`}
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <CalendarDots className="size-5" size={20} weight="duotone" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
          defaultMonth={date}
          captionLayout="dropdown"
          endMonth={endMonth}
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  );
}
