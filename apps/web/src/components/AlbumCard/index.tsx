import Link from 'next/link';
import Image from 'next/image';
import { AlbumCardProps } from './types';

export function AlbumCard({ title, date, photosCount, imageUrl }: AlbumCardProps) {
  return (
    <button
      type="button"
      className="w-[31%] h-[256px] rounded-2xl shadow-md overflow-hidden hover:brightness-130 transition-all duration-300"
    >
      <div className="w-full h-[192px] rounded-t-xl relative flex flex-col justify-end">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover brightness-60"
          priority
        />
        <div className="flex flex-col items-start p-3 pb-2 z-10 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="font-title_three text-background font-bold">{title}</h3>
          <div className="flex justify-between w-full">
            <span className="font-body_two text-background capitalize">
              {new Date(date)?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <span className="font-body_two text-accent">{photosCount} fotos</span>
          </div>
        </div>
      </div>
      <div className="h-16 flex items-center justify-start pl-3 border-t border-black/10 shadow-xl">
        <Link href="#" className="font-body_one text-primary hover:underline">
          Visualizar
        </Link>
      </div>
    </button>
  );
}
