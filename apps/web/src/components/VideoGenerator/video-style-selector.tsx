'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { VideoStyleSelectorProps } from './types';
import { STYLE_OPTIONS } from './constants';

export function VideoStyleSelector({
  selectedStyle,
  onStyleSelect,
  disabled = false,
}: VideoStyleSelectorProps) {
  const t = useTranslations('VideoGenerator.styles');

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {STYLE_OPTIONS.map(({ value, icon: Icon, labelKey, descriptionKey }) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          onClick={() => onStyleSelect(value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
            'hover:border-primary hover:bg-primary/5',
            selectedStyle === value ? 'border-primary bg-primary/10' : 'border-border',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <Icon
            className={cn(
              'h-8 w-8',
              selectedStyle === value ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span className="font-semibold">{t(labelKey)}</span>
          <span className="text-center text-muted-foreground text-sm">{t(descriptionKey)}</span>
        </button>
      ))}
    </div>
  );
}
