'use client';

import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UndatedPhotosDialogProps } from './types';

export function UndatedPhotosDialog({ isOpen, onClose }: UndatedPhotosDialogProps) {
  const t = useTranslations('EditAlbum.UndatedPhotosDialog');

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-primary/90 hover:text-background transition-colors"
          >
            {t('confirm_button')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
