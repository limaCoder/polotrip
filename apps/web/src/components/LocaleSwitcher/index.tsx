'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getOptions } from './options';
import { cn } from '@/lib/cn';
import Image from 'next/image';

interface LocaleSwitcherProps {
  whiteTrigger?: boolean;
  hideChevron?: boolean;
}

export function LocaleSwitcher({ whiteTrigger = false, hideChevron = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LocaleSwitcher');

  const options = getOptions(t);

  const handleChange = (value: string) => {
    router.replace(pathname, { locale: value });
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
          aria-label={t('select_locale_aria')}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent position="item-aligned" avoidCollisions={false}>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Image src={option.flag} alt={option.alt} width={20} height={20} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
