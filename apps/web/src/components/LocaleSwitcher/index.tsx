'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { options } from './options';
import { cn } from '@/lib/cn';
import Image from 'next/image';

interface LocaleSwitcherProps {
  whiteTrigger?: boolean;
  hideChevron?: boolean;
}

export function LocaleSwitcher({ whiteTrigger = false, hideChevron = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (value: string) => {
    router.replace('/', { locale: value });
  };

  return (
    <div className="relative flex items-center">
      <Select defaultValue={locale} onValueChange={handleChange}>
        <SelectTrigger
          className={cn(
            'px-2',
            whiteTrigger ? 'text-white' : '',
            hideChevron ? '[&>svg]:hidden' : '',
          )}
          aria-label="Selecione o idioma"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent position="item-aligned" avoidCollisions={false}>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Image src={option.flag} alt={option.label} width={20} height={20} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
