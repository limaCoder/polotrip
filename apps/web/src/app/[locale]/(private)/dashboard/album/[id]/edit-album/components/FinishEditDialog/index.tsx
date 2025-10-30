'use client';

import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FinishEditDialogProps } from './types';

export function FinishEditDialog({ isOpen, onClose, onConfirm }: FinishEditDialogProps) {
  const t = useTranslations('EditAlbum.FinishEditDialog');

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-2">{t('description_intro')}</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>{t('item_1')}</li>
                <li>{t('item_2')}</li>
                <li>{t('item_3')}</li>
              </ul>
              <p className="mb-2">{t('description_outro')}</p>
              <p className="font-medium">{t('confirmation')}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium hover:bg-secondary-10 transition-colors"
            onClick={onClose}
          >
            {t('cancel_button')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-medium bg-primary text-background hover:bg-primary/90 transition-colors"
            onClick={onConfirm}
          >
            {t('confirm_button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
