'use client';

import * as React from 'react';
import { format, addYears, subYears, setMonth } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { MonthPickerProps } from './types';
import { ptBR } from 'date-fns/locale';

export function MonthPicker({
  value,
  onChange,
  disabled,
  className,
  placeholder = 'Selecione um mês',
  name,
}: MonthPickerProps) {
  const [date, setDate] = React.useState<Date>(value || new Date());
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(date, monthIndex);
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
    setDate(newDate);
  };

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
          aria-label="Selecionar mês"
        >
          <CalendarIcon color="#08171C40" className="mr-2 h-4 w-4" />
          {date ? format(date, 'MMMM yyyy', { locale: ptBR }) : placeholder}
          {name && (
            <input
              type="hidden"
              name={name}
              value={date ? format(date, 'yyyy-MM', { locale: ptBR }) : ''}
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
            aria-label="Ano anterior"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Ano anterior</span>
          </Button>
          <div className="font-medium">{format(date, 'yyyy', { locale: ptBR })}</div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 hover:bg-primary transition-colors duration-300"
            onClick={handleNextYear}
            aria-label="Ano posterior"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Ano posterior</span>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {months.map((month, index) => {
            const isCurrentMonth =
              date && date.getMonth() === index && date.getFullYear() === date.getFullYear();

            return (
              <Button
                key={month}
                variant={isCurrentMonth ? 'default' : 'outline'}
                className="h-9 hover:bg-primary transition-colors duration-300"
                onClick={() => handleMonthSelect(index)}
                aria-label={`Selecionar mês ${month?.substring(0, 3)}`}
              >
                {month?.substring(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
