'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDateToDisplay } from '@/utils/dates';
import { PhotoTimelineProps } from './types';

export function PhotoTimeline({ dates, selectedDate, onSelectDate }: PhotoTimelineProps) {
  const sortedDates = [...dates].sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <Calendar size={24} className="text-primary" />
        <h2 className="font-title_three font-bold">Timeline</h2>
      </div>

      <div className="flex flex-col gap-4">
        {sortedDates.map(dateCount => (
          <button
            key={dateCount?.date || 'no-date'}
            className={cn(
              'p-2 rounded-lg flex flex-col items-start transition-colors',
              selectedDate === dateCount?.date ? 'bg-primary' : 'hover:bg-secondary/10',
            )}
            onClick={() => onSelectDate(dateCount?.date)}
            aria-label={`Selecionar data ${formatDateToDisplay(dateCount?.date)}`}
          >
            <p
              className={cn(
                'font-body_two font-bold',
                selectedDate === dateCount?.date ? 'text-background' : '',
              )}
            >
              {formatDateToDisplay(dateCount?.date)}
            </p>
            <p
              className={cn(
                'font-body_two text-sm',
                selectedDate === dateCount?.date ? 'text-background' : '',
              )}
            >
              {dateCount?.count} {dateCount?.count === 1 ? 'foto' : 'fotos'}
            </p>
          </button>
        ))}

        {dates?.length === 0 && (
          <p className="text-center text-text/50 italic">
            Nenhuma foto encontrada para este álbum.
          </p>
        )}
      </div>
    </div>
  );
}
