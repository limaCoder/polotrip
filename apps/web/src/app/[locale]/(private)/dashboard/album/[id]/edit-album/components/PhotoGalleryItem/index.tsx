import { Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { PhotoGalleryItemProps } from "./types";

export function PhotoGalleryItem({
  photo,
  isSelected,
  isModified,
  togglePhotoSelection,
}: PhotoGalleryItemProps) {
  const t = useTranslations("EditAlbum.PhotoGalleryItem");
  const isLocationsMetadataAvailable = photo?.latitude && photo?.longitude;

  return (
    <div
      className={cn(
        "group relative aspect-square cursor-pointer overflow-hidden rounded-sm",
        isSelected && "ring-4 ring-primary",
        isModified && "ring-2 ring-green-500"
      )}
      key={photo?.id}
      onClick={() => togglePhotoSelection(photo?.id)}
    >
      <Image
        alt={photo?.originalFileName || t("alt_text", { id: photo?.id })}
        blurDataURL="data:image/gif;base64,R0lGODlhZABkAIEAAMbGxgAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQACAAAACwAAAAAZABkAEAIoQABCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6"
        className="object-cover"
        fill
        placeholder="blur"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={photo?.imageUrl}
      />

      {isSelected && (
        <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-white">
          <Check size={16} />
        </div>
      )}

      {isModified && !isSelected && (
        <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1 text-white">
          <Check size={16} />
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        {isLocationsMetadataAvailable ? (
          <div className="text-center text-sm text-white">
            {t("location_data_present")}
          </div>
        ) : (
          <div className="text-center text-sm text-white">
            {t("location_data_absent")}
          </div>
        )}
      </div>
    </div>
  );
}
