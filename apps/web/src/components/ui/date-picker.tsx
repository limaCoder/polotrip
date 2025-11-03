"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/cn";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();
  const t = useTranslations("DatePicker");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          variant={"outline"}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{t("pick_a_date")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          initialFocus
          mode="single"
          onSelect={setDate}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}
