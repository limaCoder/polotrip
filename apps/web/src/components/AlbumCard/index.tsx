import { Calendar, EllipsisVertical, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  AlbumStatusColorEnum,
  type AlbumStatusLabelEnum,
  AlbumStatusTextColorEnum,
  generateAlbumLink,
} from "@/constants/albumsEnum";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { AlbumCardProps } from "./types";

export function AlbumCard({
  id,
  title,
  date,
  photosCount,
  imageUrl,
  stepAfterPayment,
}: AlbumCardProps) {
  const t = useTranslations("AlbumCard");
  const locale = useLocale();

  const photosCountLabel =
    photosCount === 1 ? t("photo_singular") : t("photo_plural");
  const albumImage = imageUrl || "/pages/dashboard/album-card-fallback.png";

  const albumLink = generateAlbumLink(id, stepAfterPayment);

  const albumStatusLabel = t(
    `status.${stepAfterPayment as keyof typeof AlbumStatusLabelEnum}`
  );

  const albumStatusColor =
    AlbumStatusColorEnum[stepAfterPayment as keyof typeof AlbumStatusColorEnum];
  const albumStatusTextColor =
    AlbumStatusTextColorEnum[
      stepAfterPayment as keyof typeof AlbumStatusTextColorEnum
    ];

  const isAlbumPublished = stepAfterPayment === "published";

  return (
    <div className="group hover:-translate-y-1.5 relative overflow-hidden rounded-3xl bg-muted text-text shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
      <Link className="flex h-full flex-col" href={albumLink}>
        <div className="relative h-[220px] w-full overflow-hidden p-3 pb-0">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              alt={title}
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={albumImage}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent transition-opacity duration-500 group-hover:from-slate-900/90" />

            <div className="absolute top-4 right-4 z-10">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 font-semibold text-xs uppercase tracking-wider shadow-sm backdrop-blur-md",
                  albumStatusTextColor,
                  albumStatusColor,
                  "bg-white/90 text-slate-800"
                )}
              >
                {albumStatusLabel}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-4 pb-4">
              <h3 className="mb-2 line-clamp-2 font-bold font-title_two text-3xl text-white tracking-tight drop-shadow-md">
                {title}
              </h3>

              <div className="flex w-full items-center justify-between gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 opacity-80" />
                  <span className="font-medium text-sm tracking-wide">
                    {(() => {
                      const dateString = new Date(date).toLocaleDateString(
                        locale,
                        {
                          month: "short",
                          year: "numeric",
                          day: "numeric",
                        }
                      );
                      return dateString;
                    })()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 opacity-80" />
                  <span className="max-w-[120px] truncate font-medium text-xs tracking-wide">
                    {photosCount} {photosCountLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between px-5 py-4">
          <p className="flex items-center font-semibold text-primary text-sm tracking-wide transition-colors group-hover:text-primary/80">
            {t("view_album")}
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </p>
        </div>
      </Link>

      {isAlbumPublished && (
        <div className="absolute right-3 bottom-3 z-20">
          <Popover>
            <PopoverTrigger asChild>
              <button
                aria-label="Album Options"
                className="flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-500 shadow-sm transition-all duration-300 hover:bg-slate-200 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                type="button"
              >
                <EllipsisVertical size={16} strokeWidth={2.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 overflow-hidden rounded-xl border border-slate-200 bg-white/80 p-1.5 shadow-xl backdrop-blur-xl"
            >
              <Link
                className="flex w-full grow items-center rounded-lg px-3 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-100 hover:text-primary"
                href={`/dashboard/album/${id}/edit-album`}
              >
                {t("edit_album")}
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
