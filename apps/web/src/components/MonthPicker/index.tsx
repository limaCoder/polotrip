'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, addYears, subYears, setMonth, isAfter, startOfMonth } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { MonthPickerProps } from './types';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { LocaleDateFnsEnum, LocaleTypesEnum } from '@/constants/localesEnum';

export function MonthPicker({
  value,
  onChange,
  disabled,
  className,
  placeholder,
  name,
}: MonthPickerProps) {
  const t = useTranslations('MonthPicker');
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
    format(new Date(2024, i, 1), 'MMMM', { locale: dateLocale }),
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

  const displayPlaceholder = placeholder || t('placeholder');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal hover:bg-secondary-10 capitalize',
            !date && 'text-text/55',
            className,
          )}
          disabled={disabled}
          aria-label={t('select_month_aria')}
        >
          <CalendarIcon color="#08171C40" className="mr-2 h-4 w-4" />
          {date ? format(date, 'MMMM yyyy', { locale: dateLocale }) : displayPlaceholder}
          {name && (
            <input
              type="hidden"
              name={name}
              value={date ? format(date, 'yyyy-MM', { locale: dateLocale }) : ''}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-secondary" align="start">
        <div className="p-2 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 hover:bg-primary transition-colors duration-300"
            onClick={handlePreviousYear}
            aria-label={t('previous_year_aria')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t('previous_year_sr')}</span>
          </Button>
          <div className="font-medium">{format(date, 'yyyy', { locale: dateLocale })}</div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 hover:bg-primary transition-colors duration-300"
            onClick={handleNextYear}
            disabled={date.getFullYear() >= currentDate.getFullYear()}
            aria-label={t('next_year_aria')}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t('next_year_sr')}</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {months.map((month, index) => {
            const isCurrentMonth =
              date && date.getMonth() === index && date.getFullYear() === date.getFullYear();

            const monthDate = setMonth(date, index);
            const isFutureMonth = isAfter(startOfMonth(monthDate), startOfMonth(currentDate));

            return (
              <Button
                key={month}
                variant={isCurrentMonth ? 'default' : 'outline'}
                className={cn(
                  'h-9 transition-colors duration-300 capitalize',
                  isFutureMonth ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary',
                )}
                onClick={() => handleMonthSelect(index)}
                disabled={isFutureMonth}
                aria-label={t('select_month_button_aria', { month: month.substring(0, 3) })}
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
