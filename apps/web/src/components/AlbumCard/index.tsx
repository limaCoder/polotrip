import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { AlbumCardProps } from './types';
import {
  AlbumStatusColorEnum,
  AlbumStatusLabelEnum,
  AlbumStatusTextColorEnum,
  generateAlbumLink,
} from '@/constants/albumsEnum';
import { cn } from '@/lib/cn';

export function AlbumCard({
  id,
  title,
  date,
  photosCount,
  imageUrl,
  stepAfterPayment,
}: AlbumCardProps) {
  const photosCountLabel = photosCount === 1 ? 'foto' : 'fotos';
  const albumImage = imageUrl || '/pages/dashboard/album-card-fallback.png';

  const albumLink = generateAlbumLink(id, stepAfterPayment);

  const albumStatusLabel =
    AlbumStatusLabelEnum[stepAfterPayment as keyof typeof AlbumStatusLabelEnum];
  const albumStatusColor =
    AlbumStatusColorEnum[stepAfterPayment as keyof typeof AlbumStatusColorEnum];
  const albumStatusTextColor =
    AlbumStatusTextColorEnum[stepAfterPayment as keyof typeof AlbumStatusTextColorEnum];

  return (
    <Link
      href={albumLink}
      className="h-[256px] rounded-2xl shadow-md overflow-hidden hover:brightness-130 transition-all duration-300"
    >
      <div className="w-full h-[192px] rounded-t-xl relative flex flex-col justify-end">
        <Image
          src={albumImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover brightness-60"
          priority
        />
        <span
          className={cn(
            'absolute top-2 right-2 font-bold px-2 py-1 rounded-full text-sm',
            albumStatusTextColor,
            albumStatusColor,
          )}
        >
          {albumStatusLabel}
        </span>
        <div className="flex flex-col items-start p-3 pb-2 z-10 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="font-title_three text-background font-bold">{title}</h3>
          <div className="flex justify-between w-full">
            <span className="font-body_two text-background">
              {(() => {
                const dateString = new Date(date).toLocaleDateString('pt-BR', {
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
      <div className="h-16 flex items-center justify-start pl-3 border-t border-black/10 shadow-xl">
        <p className="font-body_one text-primary hover:underline">Visualizar</p>
      </div>
    </Link>
  );
}
