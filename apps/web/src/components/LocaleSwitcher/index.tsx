'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { cn } from '@/lib/cn';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace('/', { locale: event.target.value });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleLocaleChange}
        className={cn(
          'appearance-none bg-transparent px-4 py-2',
          'border border-gray-200 rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'cursor-pointer',
        )}
      >
        <option value="pt">🇧🇷</option>
        <option value="en">🇺🇸</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
