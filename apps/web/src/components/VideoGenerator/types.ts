import type { VideoStyle, VideoStatus } from '@/http/get-video/types';
import { Loader2 } from 'lucide-react';

type VideoGeneratorProps = {
  albumId: string;
  albumTitle: string;
  photoCount: number;
  isPaid: boolean;
};

type VideoStyleSelectorProps = {
  selectedStyle: VideoStyle;
  onStyleSelect: (style: VideoStyle) => void;
  disabled?: boolean;
};

type VideoProgressProps = {
  status: VideoStatus;
  startedAt?: string | null;
};

type VideoPlayerProps = {
  videoUrl: string;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
};

type StatusConfig = {
  icon: typeof Loader2;
  colorClass: string;
  bgClass: string;
  animate?: boolean;
};

export type {
  VideoGeneratorProps,
  VideoStyleSelectorProps,
  VideoProgressProps,
  VideoPlayerProps,
  StatusConfig,
};
