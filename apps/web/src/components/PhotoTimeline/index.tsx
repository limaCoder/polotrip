'use client';

import { motion } from 'motion/react';
import { MasonryGallery } from './masonry-gallery';
import { PhotoTimelineProps } from './types';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { usePhotoTimeline } from './use-photo-timeline';
import { useTranslations } from 'next-intl';

export function PhotoTimeline({ albumId }: PhotoTimelineProps) {
  const t = useTranslations('PublicAlbum.PhotoTimeline');
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
    <div className="relative w-full bg-secondary-10" ref={containerRef}>
      <div className="container py-10">
        {timelineEvents?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-500">{t('no_photos_found')}</p>
          </div>
        ) : (
          <div ref={timelineRef} className="relative">
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
              <motion.div
                style={{
                  height: heightTransform,
                  opacity: opacityTransform,
                }}
                className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-secondary via-primary to-transparent from-[0%] via-[50%] rounded-full"
              />
            </div>

            {timelineEvents?.map((event, index) => (
              <div key={index} className="mb-16 md:mb-24">
                <div className="flex items-center mb-6 md:mb-8 pl-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-4 md:left-8 h-8 w-8 rounded-full bg-white border-2 border-secondary flex items-center justify-center transform -translate-x-1/2">
                      <div className="h-3 w-3 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold ml-10 md:ml-14 text-secondary">
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
                <div className="w-full py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
