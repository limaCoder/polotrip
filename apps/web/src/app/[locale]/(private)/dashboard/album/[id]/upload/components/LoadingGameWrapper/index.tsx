'use client';

import { useTranslations } from 'next-intl';
import { LoadingGameWrapperProps } from './types';

export function LoadingGameWrapper({
  isCompressing,
  isUploading,
  children,
  className,
}: LoadingGameWrapperProps) {
  const t = useTranslations('LoadingGameWrapper');
  if (!isCompressing && !isUploading) return null;

  return (
    <div className={`${className} bg-secondary/5 rounded-xl p-2 mt-8`} id="waiting-game">
      <div className="mx-auto">
        <div className="text-center space-y-3 mb-6">
          <h4 className="font-title_three text-primary">{t('title')}</h4>
          <p className="text-sm text-text/70">
            {isCompressing ? t('optimizing_tip') : t('uploading_tip')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">{children}</div>
      </div>
    </div>
  );
}
