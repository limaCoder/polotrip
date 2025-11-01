'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InstallPwaModalProps } from './types';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function InstallPwaModal({ isOpen, onClose, onInstall }: InstallPwaModalProps) {
  const t = useTranslations('Dashboard.install_pwa');

  const handleOpenInstallGuide = () => {
    window.open('https://www.installpwa.com/from/polotrip.com', '_blank');
    onInstall?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="px-2 w-[90%] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-muted-foreground">
          {t('description')}
        </DialogDescription>
        <DialogFooter>
          <div className="flex w-full justify-evenly">
            <Button variant="outline" onClick={onClose} aria-label={t('later_button_aria')}>
              {t('later_button')}
            </Button>

            <Button
              className="text-white flex items-center gap-2"
              onClick={handleOpenInstallGuide}
              aria-label={t('install_button_aria')}
            >
              {t('install_button')}
              <ExternalLink size={16} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
