"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { InfiniteScroll } from "@/components/InfiniteScroll";
import { MasonryGallery } from "./masonry-gallery";
import type { PhotoTimelineProps } from "./types";
import { usePhotoTimeline } from "./use-photo-timeline";

export function PhotoTimeline({ albumId }: PhotoTimelineProps) {
  const t = useTranslations("PublicAlbum.PhotoTimeline");
  const {
    timelineEvents,
    heightTransform,
    opacityTransform,
    containerRef,
    timelineRef,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = usePhotoTimeline({ albumId });

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="container py-10">
        {timelineEvents?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">{t("no_photos_found")}</p>
          </div>
        ) : (
          <div className="relative" ref={timelineRef}>
            <div className="absolute top-0 bottom-0 left-8 w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[0%] from-transparent via-neutral-200 to-[99%] to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-12 dark:via-neutral-700">
              <motion.div
                className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[0%] from-secondary via-[50%] via-primary to-transparent"
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
              />
            </div>

            {timelineEvents?.map((event) => (
              <div className="mb-16 md:mb-24" key={event.date}>
                <div className="mb-6 flex items-center pl-4 md:mb-8">
                  <div className="relative flex items-center justify-center">
                    <div className="-translate-x-1/2 absolute left-4 flex h-8 w-8 transform items-center justify-center rounded-full border-2 border-secondary md:left-8">
                      <div className="h-3 w-3 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <h2 className="ml-10 font-bold text-secondary text-xl md:ml-14 md:text-2xl">
                    {event?.date}
                  </h2>
                </div>

                <div className="px-12 md:pl-20">
                  <MasonryGallery photos={event?.photos} />
                </div>
              </div>
            ))}

            <InfiniteScroll
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetching={isFetching}
              loadingComponent={
                <div className="flex w-full justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
