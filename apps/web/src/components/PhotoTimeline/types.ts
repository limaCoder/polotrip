interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  description: string;
}

interface TimelineEvent {
  date: string;
  photos: Photo[];
}

interface PhotoTimelineProps {
  albumId: string;
}

export type { Photo, TimelineEvent, PhotoTimelineProps };
