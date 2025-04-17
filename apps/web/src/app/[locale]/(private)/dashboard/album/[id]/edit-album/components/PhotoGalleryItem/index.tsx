import { cn } from '@/lib/cn';
import { type PhotoGalleryItemProps } from './types';
import Image from 'next/image';
import { Check } from 'lucide-react';

export function PhotoGalleryItem({
  photo,
  isSelected,
  isModified,
  togglePhotoSelection,
}: PhotoGalleryItemProps) {
  return (
    <div
      key={photo?.id}
      className={cn(
        'aspect-square rounded-sm relative group overflow-hidden cursor-pointer',
        isSelected && 'ring-4 ring-primary',
        isModified && 'ring-2 ring-green-500',
      )}
      onClick={() => togglePhotoSelection(photo?.id)}
    >
      <Image
        src={photo?.imageUrl}
        alt={photo?.originalFileName || `Foto ${photo?.id}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
          <Check size={16} />
        </div>
      )}

      {isModified && !isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
          <Check size={16} />
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
    </div>
  );
}
