'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Photo } from './types';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from '../ui/morphing-dialog';
import { XIcon } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/cn';

interface ImageWithLoadingState extends Photo {
  isLoaded?: boolean;
}

export function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [columns, setColumns] = useState<ImageWithLoadingState[][]>([[], [], []]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const getOptimalPaddingBottom = (photo: Photo) => {
    const aspectRatio = photo?.height / photo?.width;
    const maxAspectRatio = 1.1;

    if (aspectRatio > maxAspectRatio) {
      return `${maxAspectRatio * 100}%`;
    }

    return `${aspectRatio * 100}%`;
  };

  useEffect(() => {
    const distributePhotos = () => {
      let numColumns = 3;
      if (window.innerWidth < 768) {
        numColumns = 1;
      } else if (window.innerWidth < 1024) {
        numColumns = 2;
      }

      const newColumns: ImageWithLoadingState[][] = Array.from({ length: numColumns }, () => []);

      photos?.forEach(photo => {
        const columnHeights = newColumns?.map(col =>
          col.reduce((sum, photo) => sum + photo?.height, 0),
        );
        const shortestColumnIndex = columnHeights?.indexOf(Math.min(...columnHeights));

        newColumns[shortestColumnIndex]?.push({
          ...photo,
          isLoaded: loadedImages.has(photo.id),
        });
      });

      setColumns(newColumns);
    };

    distributePhotos();

    window.addEventListener('resize', distributePhotos);
    return () => window.removeEventListener('resize', distributePhotos);
  }, [photos, loadedImages]);

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId));
  };

  return (
    <div className="flex gap-4 w-full">
      {columns?.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4 flex-1">
          {column?.map(photo => (
            <MorphingDialog
              key={photo?.id}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <MorphingDialogTrigger>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: getOptimalPaddingBottom(photo),
                    }}
                  >
                    <motion.div layoutId={`photo-${photo?.id}`} className="absolute inset-0">
                      <MorphingDialogImage
                        src={photo?.src}
                        alt={photo?.alt}
                        className={cn(
                          'object-cover transition-all duration-300 hover:scale-105',
                          loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0',
                        )}
                        onLoad={() => handleImageLoad(photo.id)}
                        loading="eager"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="relative z-20">
                  <MorphingDialogImage
                    src={photo?.src}
                    alt={photo?.alt}
                    className="h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[70vh]"
                  />
                  {photo?.description && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: {
                          duration: 0.2,
                        },
                      }}
                      className="w-full mt-4"
                    >
                      <ScrollArea
                        type="always"
                        className="h-24 rounded-md bg-background/80 p-3 text-text border-0"
                      >
                        <p className="whitespace-pre-line">{photo?.description}</p>
                      </ScrollArea>
                    </motion.div>
                  )}
                </MorphingDialogContent>
                <MorphingDialogClose
                  className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
                  variants={{
                    initial: { opacity: 0 },
                    animate: {
                      opacity: 1,
                      transition: { delay: 0.3, duration: 0.1 },
                    },
                    exit: { opacity: 0, transition: { duration: 0 } },
                  }}
                >
                  <XIcon className="h-5 w-5 text-zinc-500" />
                </MorphingDialogClose>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>
      ))}
    </div>
  );
}
