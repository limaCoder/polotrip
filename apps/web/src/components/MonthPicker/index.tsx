"use client";

import {
  addYears,
  format,
  isAfter,
  setMonth,
  startOfMonth,
  subYears,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocaleDateFnsEnum, LocaleTypesEnum } from "@/constants/localesEnum";
import { cn } from "@/lib/cn";
import type { MonthPickerProps } from "./types";

export function MonthPicker({
  value,
  onChange,
  disabled,
  className,
  placeholder,
  name,
}: MonthPickerProps) {
  const t = useTranslations("MonthPicker");
  const { locale } = useParams();

  const dateLocale =
    LocaleDateFnsEnum[locale as keyof typeof LocaleDateFnsEnum] ||
    LocaleDateFnsEnum[LocaleTypesEnum.PT as keyof typeof LocaleDateFnsEnum];

  const [date, setDate] = useState<Date>(value || new Date());
  const [open, setOpen] = useState(false);
  const currentDate = useMemo(() => new Date(), []);

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2024, i, 1), "MMMM", { locale: dateLocale })
  );

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(date, monthIndex);

    if (isAfter(startOfMonth(newDate), startOfMonth(currentDate))) {
      return;
    }

    setDate(newDate);
    onChange?.(newDate);
    setOpen(false);
  };

  const handlePreviousYear = () => {
    const newDate = subYears(date, 1);
    setDate(newDate);
  };

  const handleNextYear = () => {
    const newDate = addYears(date, 1);
    if (isAfter(startOfMonth(newDate), startOfMonth(currentDate))) {
      return;
    }
    setDate(newDate);
  };

  const displayPlaceholder = placeholder || t("placeholder");

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t("select_month_aria")}
          className={cn(
            "w-full justify-start text-left font-normal capitalize hover:bg-secondary-10",
            !date && "text-text/55",
            className
          )}
          disabled={disabled}
          variant="outline"
        >
          <CalendarIcon className="mr-2 h-4 w-4" color="#08171C40" />
          {date
            ? format(date, "MMMM yyyy", { locale: dateLocale })
            : displayPlaceholder}
          {name && (
            <input
              name={name}
              type="hidden"
              value={
                date ? format(date, "yyyy-MM", { locale: dateLocale }) : ""
              }
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto bg-secondary p-0">
        <div className="flex items-center justify-between p-2">
          <Button
            aria-label={t("previous_year_aria")}
            className="h-7 w-7 transition-colors duration-300 hover:bg-primary"
            onClick={handlePreviousYear}
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t("previous_year_sr")}</span>
          </Button>
          <div className="font-medium">
            {format(date, "yyyy", { locale: dateLocale })}
          </div>
          <Button
            aria-label={t("next_year_aria")}
            className="h-7 w-7 transition-colors duration-300 hover:bg-primary"
            disabled={date.getFullYear() >= currentDate.getFullYear()}
            onClick={handleNextYear}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("next_year_sr")}</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {months.map((month, index) => {
            const isCurrentMonth =
              date &&
              date.getMonth() === index &&
              date.getFullYear() === currentDate.getFullYear();

            const monthDate = setMonth(date, index);
            const isFutureMonth = isAfter(
              startOfMonth(monthDate),
              startOfMonth(currentDate)
            );

            return (
              <Button
                aria-label={t("select_month_button_aria", {
                  month: month.substring(0, 3),
                })}
                className={cn(
                  "h-9 capitalize transition-colors duration-300",
                  isFutureMonth
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-primary"
                )}
                disabled={isFutureMonth}
                key={month}
                onClick={() => handleMonthSelect(index)}
                variant={isCurrentMonth ? "default" : "outline"}
              >
                {month.substring(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
