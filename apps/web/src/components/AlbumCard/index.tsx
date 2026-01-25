import { EllipsisVertical } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import {
  AlbumStatusColorEnum,
  type AlbumStatusLabelEnum,
  AlbumStatusTextColorEnum,
  generateAlbumLink,
} from '@/constants/albumsEnum';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { AlbumCardProps } from './types';
import { VideoGenerator } from '../VideoGenerator';
import { Separator } from '@/components/ui/separator';

export function AlbumCard({
  id,
  title,
  date,
  photosCount,
  imageUrl,
  stepAfterPayment,
}: AlbumCardProps) {
  const t = useTranslations('AlbumCard');
  const locale = useLocale();

  const photosCountLabel = photosCount === 1 ? t('photo_singular') : t('photo_plural');
  const albumImage = imageUrl || '/pages/dashboard/album-card-fallback.png';

  const albumLink = generateAlbumLink(id, stepAfterPayment);

  const albumStatusLabel = t(`status.${stepAfterPayment as keyof typeof AlbumStatusLabelEnum}`);
  const albumStatusColor =
    AlbumStatusColorEnum[stepAfterPayment as keyof typeof AlbumStatusColorEnum];
  const albumStatusTextColor =
    AlbumStatusTextColorEnum[stepAfterPayment as keyof typeof AlbumStatusTextColorEnum];

  const isAlbumPublished = stepAfterPayment === 'published';

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-md">
        <Link
          className="h-[256px] rounded-2xl transition-all duration-300 hover:brightness-130"
          href={albumLink}
        >
          <div className="relative flex h-[192px] w-full flex-col justify-end rounded-t-xl">
            <Image
              alt={title}
              className="object-cover brightness-60"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={albumImage}
            />
            <span
              className={cn(
                'absolute top-2 right-2 rounded-full px-2 py-1 font-bold text-sm',
                albumStatusTextColor,
                albumStatusColor,
              )}
            >
              {albumStatusLabel}
            </span>
            <div className="z-10 flex flex-col items-start bg-linear-to-t from-black/70 to-transparent p-3 pb-2">
              <h3 className="font-bold font-title_three text-primary-foreground">{title}</h3>
              <div className="flex w-full justify-between">
                <span className="font-body_two text-primary-foreground">
                  {(() => {
                    const dateString = new Date(date).toLocaleDateString(locale, {
                      month: 'long',
                      year: 'numeric',
                    });
                    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
                  })()}
                </span>
                <span className="font-body_two text-accent">
                  {photosCount} {photosCountLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="flex h-16 items-center justify-between border-black/10 border-t px-3 shadow-xl">
            <p className="font-body_one text-primary hover:underline">{t('view_album')}</p>
          </div>
        </Link>
        {isAlbumPublished && (
          <div className="absolute right-3 bottom-4 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="rounded-full p-2 transition-all duration-300 hover:bg-black/10"
                  type="button"
                >
                  <EllipsisVertical size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-background max-w-fit">
                <Link
                  className="flex pb-2 w-full text-primary transition-all duration-300 hover:brightness-130"
                  href={`/dashboard/album/${id}/edit-album`}
                >
                  {t('edit_album')}
                </Link>
                <Separator />
                <VideoGenerator
                  albumId={id}
                  albumTitle={title}
                  photoCount={photosCount}
                  isPaid={isAlbumPublished}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </>
  );
}
