'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCheckAlbumSpace } from '@/hooks/network/queries/useCheckAlbumSpace';
import { Button } from '@/components/ui/button';

export function AddMorePhotosCard() {
  const { id: albumId, locale } = useParams<{ id: string; locale: string }>();
  const router = useRouter();
  const t = useTranslations('EditAlbum.AddMorePhotosCard');

  const { data: albumSpace, isLoading } = useCheckAlbumSpace({
    albumId,
  });

  const handleAddMorePhotos = () => {
    if (!albumSpace?.canUpload) {
      toast.error(t('limit_exceeded_error_title'), {
        description: t('limit_exceeded_error_description'),
        duration: 5000,
        richColors: true,
      });
      return;
    }

    router.push(`/${locale}/dashboard/album/${albumId}/upload`);
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return t('checking_space');
    }

    if (!albumSpace?.canUpload) {
      return t('limit_reached');
    }

    if (albumSpace.availableSpace === 1) {
      return t('space_available_singular', { count: albumSpace.availableSpace });
    }

    return t('space_available_plural', { count: albumSpace.availableSpace });
  };

  return (
    <div className="bg-background p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <Upload size={24} className="text-primary" />
        <h2 className="font-title_three font-bold">{t('title')}</h2>
      </div>

      <p className="font-body_two text-text/75 mb-6">{getStatusMessage()}</p>

      <Button
        onClick={handleAddMorePhotos}
        disabled={isLoading || !albumSpace?.canUpload}
        className="bg-primary text-background rounded px-8 py-3 hover:bg-primary/90 font-body_two flex items-center gap-2 w-full justify-center"
        aria-label={t('add_more_photos_button_aria')}
      >
        <Upload size={16} />
        <span>{t('add_more_photos_button')}</span>
      </Button>
    </div>
  );
}
