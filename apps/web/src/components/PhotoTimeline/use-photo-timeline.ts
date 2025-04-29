import useGetPublicAlbumPhotos from '@/hooks/network/queries/useGetPublicAlbumPhotos';
import { useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Photo } from './types';

export function usePhotoTimeline({ albumId }: { albumId: string }) {
  const { timelineEvents, fetchNextPage, hasNextPage, isFetching } =
    useGetPublicAlbumPhotos(albumId);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [height, setHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 90%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    timelineEvents,
    selectedPhoto,
    setSelectedPhoto,
    heightTransform,
    opacityTransform,
    containerRef,
    timelineRef,
    hasNextPage,
    isFetching,
    fetchNextPage,
  };
}
