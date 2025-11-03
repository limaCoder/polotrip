type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  description: string;
};

type TimelineEvent = {
  date: string;
  photos: Photo[];
};

type PhotoTimelineProps = {
  albumId: string;
};

export type { Photo, TimelineEvent, PhotoTimelineProps };
