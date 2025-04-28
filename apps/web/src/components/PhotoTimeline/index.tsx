'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useScroll, useTransform, AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { MasonryGallery } from './masonry-gallery';
import { Photo, PhotoTimelineProps } from './types';
import useGetPublicAlbumPhotos from '@/hooks/network/queries/useGetPublicAlbumPhotos';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { ScrollArea } from '../ui/scroll-area';

export function PhotoTimeline({ albumId }: PhotoTimelineProps) {
  const { timelineEvents, fetchNextPage, hasNextPage, isFetching } =
    useGetPublicAlbumPhotos(albumId);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    const timeoutId = setTimeout(updateHeight, 500);

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timeoutId);
    };
  }, [timelineRef, timelineEvents.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 90%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="container py-10">
        {timelineEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-500">Nenhuma foto encontrada neste álbum.</p>
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
                    <div className="absolute left-4 md:left-8 h-8 w-8 rounded-full bg-white border-2 border-secondary flex items-center justify-center z-10 transform -translate-x-1/2">
                      <div className="h-3 w-3 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold ml-10 md:ml-14 text-secondary">
                    {event?.date}
                  </h2>
                </div>

                <div className="px-12 md:pl-20">
                  <MasonryGallery photos={event?.photos} onPhotoClick={setSelectedPhoto} />
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

      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setSelectedPhoto(null)}
            />

            <div className="relative z-50 w-full h-full max-w-7xl max-h-[90vh] flex flex-col items-center justify-center p-4">
              <motion.div
                layoutId={`photo-${selectedPhoto?.id}`}
                className="relative w-full max-w-5xl h-[65vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
              >
                <Image
                  src={selectedPhoto?.src}
                  alt={selectedPhoto?.alt}
                  fill
                  sizes="100vw"
                  className="object-contain rounded-sm"
                  priority
                />
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-0 right-0 xl:-right-12 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </motion.button>
              </motion.div>
              {selectedPhoto?.description && (
                <div className="w-full max-w-3xl mt-4">
                  <ScrollArea
                    type="always"
                    className="h-24 rounded-md border bg-background/80 p-3 text-text"
                  >
                    <p className="whitespace-pre-line">{selectedPhoto?.description}</p>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
