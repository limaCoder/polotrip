'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Photo } from './types';

export function MasonryGallery({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}) {
  const [columns, setColumns] = useState<Photo[][]>([[], [], []]);

  useEffect(() => {
    const distributePhotos = () => {
      let numColumns = 3;
      if (window.innerWidth < 768) {
        numColumns = 1;
      } else if (window.innerWidth < 1024) {
        numColumns = 2;
      }

      const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);

      photos.forEach(photo => {
        const columnHeights = newColumns.map(col =>
          col.reduce((sum, photo) => sum + photo.height, 0),
        );
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

        newColumns[shortestColumnIndex].push(photo);
      });

      setColumns(newColumns);
    };

    distributePhotos();

    window.addEventListener('resize', distributePhotos);
    return () => window.removeEventListener('resize', distributePhotos);
  }, [photos]);

  return (
    <div className="flex gap-4 w-full">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4 flex-1">
          {column.map(photo => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => onPhotoClick(photo)}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: `${(photo.height / photo.width) * 100}%`,
                }}
              >
                <Image
                  src={photo.src || '/placeholder.svg'}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
