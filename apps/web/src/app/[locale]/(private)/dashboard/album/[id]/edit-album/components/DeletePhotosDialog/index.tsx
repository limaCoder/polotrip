'use client';

import { Trash2 } from 'lucide-react';
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
import { DeletePhotosDialogProps } from './types';

export function DeletePhotosDialog({
  isOpen,
  onClose,
  onConfirm,
  photoCount,
  isDeleting,
}: DeletePhotosDialogProps) {
  const t = useTranslations('EditAlbum.DeletePhotosDialog');

  const description =
    photoCount === 1
      ? t('description_singular', { count: photoCount })
      : t('description_plural', { count: photoCount });

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="px-2 w-[90%] overflow-hidden">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <Trash2 size={24} />
            </div>
          </div>
          <AlertDialogTitle className="text-center">{t('title')}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-medium hover:bg-secondary-10 transition-colors"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('cancel_button')}
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('deleting_button')}</span>
              </>
            ) : (
              t('delete_button')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
