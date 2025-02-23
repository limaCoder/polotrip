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

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (value: string) => {
    router.replace('/', { locale: value });
  };

  return (
    <div className="relative items-center flex">
      <Select defaultValue={locale} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned" avoidCollisions={false}>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
              <img src={option.flag} alt={option.label} className="w-5 h-5 rounded-full" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
