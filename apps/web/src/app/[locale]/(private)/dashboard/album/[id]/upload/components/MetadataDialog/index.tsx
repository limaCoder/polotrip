'use client';

import { useState } from 'react';
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

import { MetadataDialogProps } from './types';

export function MetadataDialog({
  isOpen,
  onClose,
  onKeepMetadata,
  onRemoveMetadata,
}: MetadataDialogProps) {
  const [showConfirmRemoveDialog, setShowConfirmRemoveDialog] = useState(false);

  const t = useTranslations('UploadPage.MetadataDialog');

  const handleShowConfirmRemoveDialog = () => {
    setShowConfirmRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    setShowConfirmRemoveDialog(false);
    onRemoveMetadata();
  };

  const handleCancelRemove = () => {
    setShowConfirmRemoveDialog(false);
  };

  const handleKeepMetadata = () => {
    onKeepMetadata();
  };

  return (
    <>
      <AlertDialog open={isOpen && !showConfirmRemoveDialog} onOpenChange={onClose}>
        <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('initial_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>{t('initial_dialog.description_1')}</p>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>{t('initial_dialog.item_1')}</li>
                  <li>{t('initial_dialog.item_2')}</li>
                </ul>
                <p className="mb-2">{t('initial_dialog.description_2')}</p>
                <p className="font-medium">{t('initial_dialog.confirmation')}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-bold bg-red-500 text-background hover:bg-red-600 transition-colors"
              onClick={handleShowConfirmRemoveDialog}
            >
              {t('initial_dialog.remove_button')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-bold bg-primary text-background"
              onClick={handleKeepMetadata}
            >
              {t('initial_dialog.keep_button')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmRemoveDialog} onOpenChange={handleCancelRemove}>
        <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_remove_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-2">{t('confirm_remove_dialog.description')}</p>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  <li>{t('confirm_remove_dialog.item_1')}</li>
                  <li>{t('confirm_remove_dialog.item_2')}</li>
                </ul>
                <p className="font-medium">{t('confirm_remove_dialog.confirmation')}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="font-bold bg-primary text-background hover:bg-primary/90 transition-colors"
              onClick={handleCancelRemove}
            >
              {t('confirm_remove_dialog.cancel_button')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="font-bold bg-red-500 text-background hover:bg-red-600 transition-colors"
              onClick={handleConfirmRemove}
            >
              {t('confirm_remove_dialog.confirm_button')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
